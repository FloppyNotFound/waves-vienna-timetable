import { StorageService } from './../../services/storage.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { TimeSlot } from './../../backend-models/backend-models.interface';
import { EventDataService } from './../../services/event-data.service';

@Component({
  selector: 'app-explore-container-details',
  templateUrl: './explore-container-details.component.html'
})
export class ExploreContainerDetailsComponent implements OnInit, OnDestroy {
  isFavorite: boolean;

  item: TimeSlot;

  private readonly unsubscribe = new Subject();

  constructor(
    private eventDataService: EventDataService,
    private route: ActivatedRoute,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private storageService: StorageService
  ) {}

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });

    await loading.present();

    this.route.paramMap
      .pipe(
        map(paramMap => Number(paramMap.get('id'))),
        switchMap(id => this.eventDataService.getItem(id)),
        tap(item => (this.item = item as TimeSlot)),
        switchMap(() => this.storageService.checkIsFavorite(this.item.id)),
        tap(isFavorite => (this.isFavorite = isFavorite))
      )
      .subscribe(() => {
        loading.dismiss();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onToggleFavorite(): void {
    if (!this.item) {
      return;
    }

    this.isFavorite = !this.isFavorite;

    this.storageService
      .setFavorite(this.item.id, this.isFavorite)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(async () => {
        await this.presentToast(this.isFavorite);
      });
  }

  private async presentToast(isFavActive: boolean): Promise<void> {
    const msg = isFavActive ? 'Favorite saved' : 'Favorite removed';

    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      color: isFavActive ? 'success' : 'dark'
    });

    toast.present();
  }
}
