import { inject, Injectable } from '@angular/core';
import { RavelryPatternResponse, RavelryPatternsResponse } from '../../shared/models/raverly';
import { HttpClient, httpResource } from '@angular/common/http';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Patterns {
  //    readonly #patterns = signal<RavelryPattern[]>([]);
  //  readonly patterns = this.#patterns.asReadonly();
  readonly apiBaseUrl = 'http://localhost:3000/api/patterns';

  /*    #searchPatterns = httpResource<RavelryPattern[]>(
           () => ({ url: `${this.apiBaseUrl}/search` }),
           { defaultValue: [] }
       );
   
       readonly searchPatterns = this.#searchPatterns.asReadonly(); */

  readonly http = inject(HttpClient);

  getPatterns() {
    return this.http
      .get<RavelryPatternsResponse>(this.apiBaseUrl)
      .pipe(map((response) => response.patterns));
  }

  search(term: string, sort: string, page: number = 1) {
    console.log(term, sort, page);
    return this.http
      .get<RavelryPatternsResponse>(`${this.apiBaseUrl}/search`, {
        params: { q: term, sort, page: page.toString() },
      })
      .pipe(map((response) => response));
  }

  getDetails(id: number) {
    return this.http.get<RavelryPatternResponse>(`${this.apiBaseUrl}/${id}`).pipe(
      map((response) => response.pattern), // Assuming the API returns a single pattern in an array
      catchError((error) => {
        console.error('Error fetching pattern details:', error);
        throw 'Something went wrong while fetching pattern details'; // Rethrow the error to be handled by the component
      }),
    );
  }
}
