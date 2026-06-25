import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { RavelryUser } from '../models/raverly';

const API = 'http://localhost:3000/api';

@Injectable({ providedIn: 'root' })
export class Auth {
    private readonly http = inject(HttpClient);
    private readonly _user = signal<RavelryUser | null>(null);

    readonly user = this._user.asReadonly();
    readonly isLoggedIn = computed(() => this._user() !== null);

    constructor() {
        this.checkSession();
    }

    private checkSession() {
        this.http
            .get<RavelryUser>(`${API}/auth/me`, { withCredentials: true })
            .pipe(catchError(() => of(null)))
            .subscribe((user) => this._user.set(user));
    }

    login() {
        window.location.href = `${API}/auth/ravelry`;
    }

    logout() {
        this.http
            .post(`${API}/auth/logout`, {}, { withCredentials: true })
            .pipe(catchError(() => of(null)))
            .subscribe(() => this._user.set(null));
    }
}
