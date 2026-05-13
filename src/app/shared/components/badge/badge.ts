import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type BadgeVariant = 'teal' | 'purple' | 'amber' | 'blue';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.html',
  styleUrl: './badge.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Badge {
  readonly variant = input<BadgeVariant>('teal');
}
