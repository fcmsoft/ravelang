import { Component, effect, inject } from '@angular/core';
import { Patterns } from '../patterns';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { RavelryPattern } from '../../../shared/models/raverly';
import { AsyncPipe } from '@angular/common';
import { Card } from '../../../shared/components/card/card';


@Component({
  selector: 'app-pattern-list',
  imports: [RouterLink, AsyncPipe, Card],
  templateUrl: './pattern-list.html',
  styleUrl: './pattern-list.css',
})
export class PatternList {
  readonly patternsService = inject(Patterns);
  patterns$!: Observable<RavelryPattern[]>;

  constructor() {
    effect(() => {
      this.patterns$ = this.patternsService.getPatterns();
    });
  }
}
