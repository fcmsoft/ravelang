import { inject, Injectable } from '@angular/core';
import { RavelryYarnsResponse, RavelryYarnResponse } from '../../shared/models/raverly';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Yarns {
  readonly apiBaseUrl = 'http://localhost:3000/api/yarns';
  readonly http = inject(HttpClient);

  getYarns() {
    return this.http.get<RavelryYarnsResponse>(this.apiBaseUrl).pipe(
      tap((response) => console.log('Raw API response:', response)),
      map((response) => ({
        yarns: Object.values(response.yarns),
        paginator: response.paginator,
      })),
    );
  }

  search(term: string, page: number = 1) {
    console.log(term, page);
    return this.http
      .get<RavelryYarnsResponse>(`${this.apiBaseUrl}/search`, {
        params: { q: term, page: page.toString() },
      })
      .pipe(
        map((response) => ({
          yarns: Object.values(response.yarns),
          paginator: response.paginator,
        })),
      );
  }

  getDetails(id: number) {
    return this.http.get<RavelryYarnResponse>(`${this.apiBaseUrl}/${id}`).pipe(
      map((response) => response.yarn),
      catchError((error) => {
        console.error('Error fetching yarn details:', error);
        throw 'Something went wrong while fetching yarn details';
      }),
    );
  }
}
