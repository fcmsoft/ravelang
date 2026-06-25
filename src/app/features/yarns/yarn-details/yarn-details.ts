import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';

import { Yarns } from '../yarns';
import { Carousel } from '../../../shared/components/carousel/carousel';
import { Badge } from '../../../shared/components/badge/badge';
import { BadgeGroup } from '../../../shared/components/badge-group/badge-group';
import { YarnWeightTable } from '../../../shared/components/yarn-weight-table/yarn-weight-table';

@Component({
  selector: 'app-yarn-details',
  imports: [Carousel, BadgeGroup, Badge, DecimalPipe, MatChipsModule],
  templateUrl: './yarn-details.html',
  styleUrl: './yarn-details.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YarnDetails {
  protected readonly yarnsService = inject(Yarns);
  private readonly activatedRoute = inject(ActivatedRoute);
  readonly dialog = inject(MatDialog);
  protected readonly errorMessage = signal('');

  protected readonly yarn = toSignal(
    this.activatedRoute.paramMap.pipe(
      switchMap((params) =>
        this.yarnsService.getDetails(+(params.get('id') ?? 0)).pipe(
          catchError(() => {
            this.errorMessage.set('Something went wrong while fetching yarn details');
            return of(null);
          }),
        ),
      ),
    ),
  );

  protected readonly photos = computed(() => this.yarn()?.photos ?? []);
  openYarnWeightDialog() {
    this.dialog.open(YarnWeightTable, {});
  }
}
