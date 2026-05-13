import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { RavelryPhoto } from '../../models/raverly';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.html',
  styleUrl: './carousel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Carousel {
  // Input: array of items to display in carousel
  items = input.required<RavelryPhoto[]>();

  // Input: alt text for images
  altText = input<string>('Carousel image');

  private readonly _step = signal(0);

  protected readonly currentIndex = computed(() => {
    const count = this.items().length;
    if (count === 0) return 0;
    return ((this._step() % count) + count) % count;
  });

  protected readonly currentItem = computed(() => {
    const items = this.items();
    const index = this.currentIndex();
    return items[index];
  });

  protected readonly currentImageUrl = computed(() => {
    const item = this.currentItem();
    return item ? item.medium2_url : undefined;
  });

  protected next() {
    this._step.update((s) => s + 1);
  }

  protected prev() {
    this._step.update((s) => s - 1);
  }

  protected goTo(index: number) {
    this._step.set(index);
  }
}
