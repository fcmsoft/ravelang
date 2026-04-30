import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { Patterns } from '../patterns';
import { Card } from '../../../shared/components/card/card';



@Component({
  selector: 'app-pattern-list',
  imports: [RouterLink, AsyncPipe, Card],
  templateUrl: './pattern-list.html',
  styleUrl: './pattern-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatternList {
  protected readonly patternsService = inject(Patterns);

  protected readonly searchTerm = signal('');

  patterns$ = toObservable(this.searchTerm).pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(term => this.patternsService.search(term))
  );

  protected onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }
}
