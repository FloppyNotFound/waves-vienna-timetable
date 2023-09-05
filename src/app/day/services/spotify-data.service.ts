import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  SpotifyArtist,
  SpotifyArtistResponse
} from './models/spotify-artist-response';
import { SpotifyToken } from './models/spotify-token';

// TDOO expires every hour, refresh in time

@Injectable({
  providedIn: 'root'
})
export class SpotifyDataService {
  constructor(private _httpClient: HttpClient) {}

  getData(artistName: string): Observable<SpotifyArtist | null> {
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
        tap(token => console.log(token)),
        switchMap(token =>
          this._httpClient.get(
            `https://api.spotify.com/v1/search?query=artist%3A${artistName}&type=artist&limit=10`,
            {
              headers: { Authorization: `Bearer ${token.access_token}` }
            }
          )
        ),
        map(res => <SpotifyArtistResponse>res),
        map(res =>
          res.artists.items.find(
            i => i.name.toLowerCase() === artistName.toLowerCase()
          )
        ),
        map(artist => artist ?? null)
      );
  }
}
