import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { from, Observable, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class StorageService {
  readonly favoritesKey = 'favorites';

  private storage: Storage | null = null;

  constructor(private storageService: Storage) {
    this.init();
  }

  async init(): Promise<void> {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storageService.create();
    this.storage = storage;
  }

  // Create and expose methods that users of this service can
  // call, for example:
  setFavorite(id: number, isActive: boolean): Observable<number[]> {
    return this.getFavorites().pipe(
      map(favorites => {
        const newFavs = isActive
          ? [...favorites, id]
          : [...favorites].filter(f => f !== id);

        return newFavs;
      }),
      switchMap(newFavs =>
        !this.storage
          ? throwError('Storage not ready')
          : from(this.storage.set(this.favoritesKey, newFavs)).pipe(
              map(() => newFavs)
            )
      )
    );
  }

  getFavorites(): Observable<number[]> {
    if (!this.storage) {
      return throwError('Storage not ready');
    }

    return from(this.storage.get(this.favoritesKey)).pipe(
      map(favorites => favorites ?? [])
    );
  }

  checkIsFavorite(id: number): Observable<boolean> {
    return this.getFavorites().pipe(map(favs => favs.includes(id)));
  }
}
