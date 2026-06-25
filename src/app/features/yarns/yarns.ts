import { inject, Injectable } from '@angular/core';
import { RavelryYarnsResponse, RavelryYarnResponse, RavelryYarnWeight } from '../../shared/models/raverly';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Yarns {
  readonly apiBaseUrl = 'http://localhost:3000/api/yarns';
  readonly http = inject(HttpClient);

  getYarns() {
    return this.http.get<RavelryYarnsResponse>(this.apiBaseUrl);
  }

  search(term: string, page: number = 1) {
    return this.http
      .get<RavelryYarnsResponse>(`${this.apiBaseUrl}/search`, {
        params: { q: term, page: page.toString() },
      });
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

  getYarnWeights() {
    return this.http.get<RavelryYarnWeight[]>(`${this.apiBaseUrl}/weights`).pipe(
      map((response) => response),
      catchError((error) => {
        console.error('Error fetching yarn weights:', error);
        throw 'Something went wrong while fetching yarn weights';
      }),
    );
  }
}
