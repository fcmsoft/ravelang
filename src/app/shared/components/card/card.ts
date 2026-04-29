import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Card {
  readonly name = input.required<string>();
  readonly imageUrl = input<string>();
  readonly designer = input.required<string>();

  readonly hasImageError = signal(false);

  protected onImageError(): void {
    this.hasImageError.set(true);
  }
}
