import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Patterns } from '../patterns';
import { catchError, of, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-pattern-details',
  imports: [RouterLink],
  templateUrl: './pattern-details.html',
  styleUrl: './pattern-details.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatternDetails {
  protected readonly patternsService = inject(Patterns);
  private readonly activatedRoute = inject(ActivatedRoute);

  protected readonly errorMessage = signal('');
  private readonly _step = signal(0);

  protected readonly pattern = toSignal(
    this.activatedRoute.paramMap.pipe(
      switchMap(params =>
        this.patternsService.getDetails(+(params.get('id') ?? 0)).pipe(
          catchError(() => {
            this.errorMessage.set('Something went wrong while fetching pattern details');
            return of(null);
          })
        )
      )
    ),
    { initialValue: null }
  );

  protected readonly photos = computed(() => this.pattern()?.photos ?? []);

  protected readonly currentPhotoIndex = computed(() => {
    const count = this.photos().length;
    if (count === 0) return 0;
    return ((this._step() % count) + count) % count;
  });

  constructor() {
    this._step.set(0);
    this.errorMessage.set('');
  }

  nextPhoto() {
    this._step.update(s => s + 1);
  }

  prevPhoto() {
    this._step.update(s => s - 1);
  }

  goToPhoto(index: number) {
    this._step.set(index);
  }
}
