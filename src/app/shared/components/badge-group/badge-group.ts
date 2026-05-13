import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-badge-group',
  imports: [UpperCasePipe, MatDividerModule],
  templateUrl: './badge-group.html',
  styleUrl: './badge-group.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeGroup {
  readonly label = input.required<string>();
}
