import { Component, OnDestroy, OnInit } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { TimeSlot } from './../../backend-models/backend-models.interface';
import { EventDataService } from './../../services/event-data.service';

@Component({
  selector: 'app-explore-container-details',
  templateUrl: './explore-container-details.component.html',
  styleUrls: ['./explore-container-details.component.scss'],
})
export class ExploreContainerDetailsComponent implements OnInit, OnDestroy {
  isFavorite: boolean;

  item: TimeSlot;

  private readonly unsubscribe = new Subject();

  constructor(
    private eventDataService: EventDataService,
    private route: ActivatedRoute,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });

    await loading.present();

    this.route.paramMap
      .pipe(
        map((paramMap) => Number(paramMap.get('id'))),
        switchMap((id) => this.eventDataService.getItem(id))
      )
      .subscribe((item) => {
        this.item = item;

        this.isFavorite = false;

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

    this.presentToast(this.isFavorite);
  }

  private async presentToast(isFavActive: boolean) {
    const msg = isFavActive ? 'Favorite saved' : 'Favorite removed';

    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      color: isFavActive ? 'success' : 'dark',
    });

    toast.present();
  }
}
