import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, of, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { Designers } from '../designers';

@Component({
  selector: 'app-designer-details',
  imports: [RouterLink],
  templateUrl: './designer-details.html',
  styleUrl: './designer-details.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesignerDetails {
  protected readonly designersService = inject(Designers);
  private readonly activatedRoute = inject(ActivatedRoute);

  readonly errorMessage = signal('');

  readonly designer = toSignal(
    this.activatedRoute.paramMap.pipe(
      switchMap((params) =>
        this.designersService.getDetails(+(params.get('id') ?? 0)).pipe(
          catchError((error) => {
            console.error('Error fetching designer details:', error);
            this.errorMessage.set('Something went wrong while fetching designer details');
            return of(null);
          }),
        ),
      ),
    ),
    { initialValue: null },
  );
}
