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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Yarns } from '../yarns';
import { Card } from '../../../shared/components/card/card';
import { RavelryYarnSummary } from '../../../shared/models/raverly';

@Component({
  selector: 'app-yarn-list',
  imports: [
    RouterLink,
    Card,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './yarn-list.html',
  styleUrl: './yarn-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YarnList implements OnDestroy {
  protected readonly yarnsService = inject(Yarns);

  // Signals for state management
  protected readonly currentPage = signal(1);
  protected readonly isLoading = signal(false);
  protected readonly hasMore = signal(true);
  protected readonly allYarns = signal<RavelryYarnSummary[]>([]);
  protected readonly initialLoadComplete = signal(false);

  // ViewChild for sentinel element (used for Intersection Observer)
  protected readonly sentinel = viewChild<ElementRef>('sentinel');

  private intersectionObserver?: IntersectionObserver;

  searchForm = new FormGroup({
    searchTerm: new FormControl(''),
  });

  constructor() {
    // Watch for search changes and reset state
    this.searchForm.valueChanges
      .pipe(
        startWith(this.searchForm.value),
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => {
          // Reset state for new search
          this.currentPage.set(1);
          this.allYarns.set([]);
          this.hasMore.set(true);
          this.isLoading.set(true);
          this.initialLoadComplete.set(false);
        }),
        switchMap((changes) => this.yarnsService.search(changes.searchTerm ?? '', 1)),
      )
      .subscribe({
        next: (response) => {
          this.allYarns.set(response.yarns);
          this.hasMore.set(response.paginator.page < response.paginator.page_count);
          this.isLoading.set(false);
          this.initialLoadComplete.set(true);
        },
        error: (error) => {
          console.error('Error loading yarns:', error);
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

    this.yarnsService.search(formValues.searchTerm ?? '', nextPage).subscribe({
      next: (response) => {
        // Append new yarns to existing ones
        this.allYarns.update((yarns) => [...yarns, ...response.yarns]);
        this.currentPage.set(nextPage);
        this.hasMore.set(response.paginator.page < response.paginator.page_count);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading more yarns:', error);
        this.isLoading.set(false);
        // Silently fail - stop loading more on error
        this.hasMore.set(false);
      },
    });
  }
}
