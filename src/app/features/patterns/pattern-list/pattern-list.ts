import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  OnDestroy,
  viewChild,
  ElementRef,
  effect,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, startWith, switchMap, tap } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Patterns } from '../patterns';
import { Card } from '../../../shared/components/card/card';
import { RavelryPattern } from '../../../shared/models/raverly';

@Component({
  selector: 'app-pattern-list',
  imports: [
    RouterLink,
    Card,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './pattern-list.html',
  styleUrl: './pattern-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatternList implements OnDestroy {
  protected readonly patternsService = inject(Patterns);

  // Signals for state management
  protected readonly currentPage = signal(1);
  protected readonly isLoading = signal(false);
  protected readonly hasMore = signal(true);
  protected readonly allPatterns = signal<RavelryPattern[]>([]);
  protected readonly initialLoadComplete = signal(false);

  // ViewChild for sentinel element (used for Intersection Observer)
  protected readonly sentinel = viewChild<ElementRef>('sentinel');

  private intersectionObserver?: IntersectionObserver;

  searchForm = new FormGroup({
    searchTerm: new FormControl(''),
    sortBy: new FormControl('recently-popular'),
  });

  constructor() {
    // Watch for search/sort changes and reset state
    this.searchForm.valueChanges
      .pipe(
        startWith(this.searchForm.value),
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => {
          // Reset state for new search
          this.currentPage.set(1);
          this.allPatterns.set([]);
          this.hasMore.set(true);
          this.isLoading.set(true);
          this.initialLoadComplete.set(false);
        }),
        switchMap((changes) =>
          this.patternsService.search(
            changes.searchTerm ?? '',
            changes.sortBy ?? 'recently-popular',
            1,
          ),
        ),
      )
      .subscribe({
        next: (response) => {
          this.allPatterns.set(response.patterns);
          console.log(response);
          this.hasMore.set(response.paginator.page < response.paginator.page_count);
          this.isLoading.set(false);
          this.initialLoadComplete.set(true);
        },
        error: (error) => {
          console.error('Error loading patterns:', error);
          this.isLoading.set(false);
          this.initialLoadComplete.set(true);
        },
      });

    // Set up Intersection Observer reactively when sentinel becomes available
    effect(() => {
      const sentinelElement = this.sentinel()?.nativeElement;

      // Clean up previous observer if it exists
      if (this.intersectionObserver) {
        this.intersectionObserver.disconnect();
      }

      if (!sentinelElement) return;

      // Create new Intersection Observer
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (
            entry.isIntersecting &&
            this.hasMore() &&
            !this.isLoading() &&
            this.initialLoadComplete()
          ) {
            this.loadMore();
          }
        },
        {
          root: null, // viewport
          rootMargin: '200px', // Trigger 200px before reaching the sentinel
          threshold: 0,
        },
      );

      this.intersectionObserver.observe(sentinelElement);
    });
  }

  ngOnDestroy(): void {
    // Clean up Intersection Observer
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  protected loadMore(): void {
    if (!this.hasMore() || this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    const nextPage = this.currentPage() + 1;
    const formValues = this.searchForm.value;

    this.patternsService
      .search(formValues.searchTerm ?? '', formValues.sortBy ?? 'recently-popular', nextPage)
      .subscribe({
        next: (response) => {
          // Append new patterns to existing ones
          this.allPatterns.update((patterns) => [...patterns, ...response.patterns]);
          this.currentPage.set(nextPage);
          this.hasMore.set(response.paginator.page < response.paginator.page_count);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading more patterns:', error);
          this.isLoading.set(false);
          // Silently fail - stop loading more on error
          this.hasMore.set(false);
        },
      });
  }
}
