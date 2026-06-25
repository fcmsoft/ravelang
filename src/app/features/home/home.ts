import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Auth } from '../../shared/services/auth';
import { Card } from '../../shared/components/card/card';
import { RavelryFavoritesResponse, RavelryPattern } from '../../shared/models/raverly';

const API = 'http://localhost:3000/api';

@Component({
  selector: 'app-home',
  imports: [Card, RouterLink, MatProgressSpinnerModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  protected readonly auth = inject(Auth);
  private readonly http = inject(HttpClient);

  protected readonly isLoading = signal(false);
  protected readonly favoritePatterns = signal<RavelryPattern[]>([]);
  protected readonly error = signal<string | null>(null);

  constructor() {
    effect(() => {
      const user = this.auth.user();
      if (user) {
        this.loadFavorites();
      } else {
        this.favoritePatterns.set([]);
      }
    });
  }

  private loadFavorites() {
    this.isLoading.set(true);
    this.error.set(null);
    this.http
      .get<RavelryFavoritesResponse>(`${API}/patterns/favorites`, { withCredentials: true })
      .subscribe({
        next: (response) => {
          const patterns = response.favorites
            .filter((f) => f.favorited)
            .map((f) => f.favorited as RavelryPattern);
          this.favoritePatterns.set(patterns);
          this.isLoading.set(false);
        },
        error: () => {
          this.error.set('Could not load your favorites. Please try again.');
          this.isLoading.set(false);
        },
      });
  }

  protected get greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }
}
