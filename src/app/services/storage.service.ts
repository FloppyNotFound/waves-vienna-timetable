import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { from, Observable, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class StorageService {
  readonly favoritesKey = 'favorites';

  private _storage: Storage | null = null;

  constructor(private storageService: Storage) {
    this.init();
  }

  async init(): Promise<void> {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storageService.create();
    this._storage = storage;
  }

  // Create and expose methods that users of this service can
  // call, for example:
  setFavorite(id: string, isActive: boolean): Observable<string[]> {
    return this.getFavorites().pipe(
      map(favorites => {
        const newFavs = isActive
          ? [...favorites, id]
          : [...favorites].filter(f => f !== id);

        return newFavs;
      }),
      switchMap(newFavs =>
        !this._storage
          ? throwError('Storage not ready')
          : from(this._storage.set(this.favoritesKey, newFavs)).pipe(
              map(() => newFavs)
            )
      )
    );
  }

  getFavorites(): Observable<string[]> {
    if (!this._storage) {
      throw Error('Storage not ready');
    }

    return from(this._storage.get(this.favoritesKey)).pipe(
      map(favorites => favorites ?? [])
    );
  }

  checkIsFavorite(id: string): Observable<boolean> {
    return this.getFavorites().pipe(map(favs => favs.includes(id)));
  }
}
