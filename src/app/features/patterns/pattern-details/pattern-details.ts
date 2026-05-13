import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { catchError, of, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';

import { Patterns } from '../patterns';
import { Badge } from '../../../shared/components/badge/badge';
import { BadgeGroup } from '../../../shared/components/badge-group/badge-group';
import { Carousel } from '../../../shared/components/carousel/carousel';
import { RavelryPhoto } from '../../../shared/models/raverly';
import { MatDialog } from '@angular/material/dialog';
import { YarnWeightTable } from '../../../shared/components/yarn-weight-table/yarn-weight-table';

@Component({
  selector: 'app-pattern-details',
  imports: [RouterLink, DatePipe, MatChipsModule, Badge, BadgeGroup, Carousel],
  templateUrl: './pattern-details.html',
  styleUrl: './pattern-details.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatternDetails {
  protected readonly patternsService = inject(Patterns);
  private readonly activatedRoute = inject(ActivatedRoute);
  readonly dialog = inject(MatDialog);

  protected readonly errorMessage = signal('');

  protected readonly pattern = toSignal(
    this.activatedRoute.paramMap.pipe(
      switchMap((params) =>
        this.patternsService.getDetails(+(params.get('id') ?? 0)).pipe(
          catchError(() => {
            this.errorMessage.set('Something went wrong while fetching pattern details');
            return of(null);
          }),
        ),
      ),
    ),
  );

  protected readonly photos = computed(() => this.pattern()?.photos ?? []);
  readonly craftVariantColor = computed(() =>
    this.pattern()?.craft.permalink === 'knitting'
      ? 'purple'
      : this.pattern()?.craft.permalink === 'crochet'
        ? 'blue'
        : 'amber',
  );
  /*   readonly skillLevelVariantColor = computed(() => {
    const skillLevel = this.pattern()?.skill_level.permalink;
 */

  constructor() {
    this.errorMessage.set('');
  }

  openYarnWeightDialog() {
    this.dialog.open(YarnWeightTable, {});
  }
}
