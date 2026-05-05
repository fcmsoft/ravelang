import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs';
import { RavelryDesignerResponse, RavelryDesignersResponse } from '../../shared/models/raverly';

@Injectable({
  providedIn: 'root',
})
export class Designers {
  readonly apiBaseUrl = 'http://localhost:3000/api/designers';
  readonly http = inject(HttpClient);

  getDesigners() {
    return this.http
      .get<RavelryDesignersResponse>(this.apiBaseUrl)
      .pipe(map((response) => response.designers));
  }

  search(term: string) {
    return this.http
      .get<RavelryDesignersResponse>(`${this.apiBaseUrl}/search`, { params: { q: term } })
      .pipe(map((response) => response.designers));
  }

  getDetails(id: number) {
    return this.http.get<RavelryDesignerResponse>(`${this.apiBaseUrl}/${id}`).pipe(
      map((response: RavelryDesignerResponse) => response.pattern_author),
      catchError((error) => {
        console.error('Error fetching designer details:', error);
        throw 'Something went wrong while fetching designer details';
      }),
    );
  }
}
