import { Component, computed, inject, signal } from '@angular/core';
import { Yarns } from '../yarns';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap } from 'rxjs';
import { Carousel } from '../../../shared/components/carousel/carousel';

@Component({
  selector: 'app-yarn-details',
  imports: [Carousel],
  templateUrl: './yarn-details.html',
  styleUrl: './yarn-details.css',
})
export class YarnDetails {
  protected readonly yarnsService = inject(Yarns);
  private readonly activatedRoute = inject(ActivatedRoute);

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
}
