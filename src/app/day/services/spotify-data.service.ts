import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  SpotifyArtist,
  SpotifyArtistResponse
} from './models/spotify-artist-response';
import { SpotifyToken } from './models/spotify-token';

@Injectable({
  providedIn: 'root'
})
export class SpotifyDataService {
  private _token: string;

  constructor(private _httpClient: HttpClient) {}

  getData(artistName: string): Observable<SpotifyArtist | null> {
    const token$ = this._token ? of(this._token) : this.getNewToken();

    return token$.pipe(
      switchMap(token =>
        this.getSpotify(artistName, token).pipe(
          catchError(() =>
            this.getNewToken().pipe(
              switchMap(tokennew => this.getSpotify(artistName, tokennew))
            )
          )
        )
      ),
      map(res =>
        res.artists.items.find(
          i => i.name.toLowerCase() === artistName.toLowerCase()
        )
      ),
      map(artist => artist ?? null)
    );
  }

  private getSpotify(
    artistName: string,
    token: string
  ): Observable<SpotifyArtistResponse> {
    return this._httpClient
      .get(
        `https://api.spotify.com/v1/search?query=artist%3A${artistName}&type=artist&limit=10`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      .pipe(map(res => <SpotifyArtistResponse>res));
  }

  private getNewToken(): Observable<string> {
    const tokenHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this._httpClient
      .post(
        'https://accounts.spotify.com/api/token',
        `grant_type=client_credentials&client_id=${environment.spotify.clientId}&client_secret=${environment.spotify.clientSecret}`,
        {
          headers: tokenHeaders
        }
      )
      .pipe(
        map(res => <SpotifyToken>res),
        map(res => res.access_token),
        tap(token => (this._token = token))
      );
  }
}
