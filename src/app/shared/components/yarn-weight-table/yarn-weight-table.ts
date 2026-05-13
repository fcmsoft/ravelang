import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { yarnWeights } from '../../services/yarn-weights';

@Component({
  selector: 'app-yarn-weight-table',
  imports: [MatTableModule, MatProgressSpinnerModule],
  templateUrl: './yarn-weight-table.html',
  styleUrl: './yarn-weight-table.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YarnWeightTable {
  readonly yarnWeights = yarnWeights;

  protected readonly displayedColumns = ['name', 'ply', 'wpi', 'knit_gauge', 'yarnstandard'];
}
