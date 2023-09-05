import { StorageService } from './../../services/storage.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { EventDataService } from './../../services/event-data.service';
import { Show } from '../../backend-models/show';
import { SpotifyDataService } from '../services/spotify-data.service';
import { SpotifyArtist } from '../services/models/spotify-artist-response';

@Component({
  selector: 'app-explore-container-details',
  templateUrl: './explore-container-details.component.html',
  styleUrls: ['./explore-container-details.component.scss']
})
export class ExploreContainerDetailsComponent implements OnInit, OnDestroy {
  isFavorite: boolean;

  item: Show;

  spotifyArtist$: Observable<SpotifyArtist | null>;

  private readonly _unsubscribe = new Subject<void>();

  constructor(
    private _eventDataService: EventDataService,
    private _route: ActivatedRoute,
    private _loadingController: LoadingController,
    private _toastController: ToastController,
    private _storageService: StorageService,
    private _spotifyDataService: SpotifyDataService
  ) {}

  async ngOnInit(): Promise<void> {
    const loading = await this._loadingController.create({
      message: 'Please wait...'
    });

    await loading.present();

    this._route.paramMap
      .pipe(
        map(paramMap => <string>paramMap.get('id')),
        switchMap(id => this._eventDataService.getItem(id)),
        tap(item => (this.item = <Show>item)),
        switchMap(() => this._storageService.checkIsFavorite(this.item.id)),
        tap(isFavorite => (this.isFavorite = isFavorite))
      )
      .subscribe(() => {
        loading.dismiss();

        this.spotifyArtist$ = this.getSpotifyData(this.item.artistName).pipe(
          tap(res => console.log('res', res))
        );
      });
  }

  ngOnDestroy(): void {
    this._unsubscribe.next(void 0);
    this._unsubscribe.complete();
  }

  onToggleFavorite(): void {
    if (!this.item) {
      return;
    }

    this.isFavorite = !this.isFavorite;

    this._storageService
      .setFavorite(this.item.id, this.isFavorite)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(async () => {
        await this.presentToast(this.isFavorite);
      });
  }

  private async presentToast(isFavActive: boolean): Promise<void> {
    const msg = isFavActive ? 'Favorite saved' : 'Favorite removed';

    const toast = await this._toastController.create({
      message: msg,
      duration: 2000,
      color: isFavActive ? 'success' : 'dark'
    });

    toast.present();
  }

  private getSpotifyData(artistName: string): Observable<SpotifyArtist | null> {
    return this._spotifyDataService.getData(
      artistName.replace(/\(.*\)/g, '').trim()
    );
  }
}
