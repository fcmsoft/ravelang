import { inject, Injectable } from '@angular/core';
import { RavelryPatternsResponse } from '../../shared/models/raverly';
import { HttpClient, httpResource } from '@angular/common/http';
import { map } from 'rxjs';

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
        return this.http.get<RavelryPatternsResponse>(this.apiBaseUrl).pipe(
            map(response => response.patterns)
        );
    }
}
