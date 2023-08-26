import { StorageService } from './../services/storage.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { EventDataService } from '../services/event-data.service';
import { Day } from '../tabs/models/day.enum';
import { Show } from '../backend-models/show';

@Component({
  selector: 'app-day',
  templateUrl: 'day.page.html'
})
export class DayPage implements OnInit, OnDestroy {
  timeslotsToShow$: Observable<Show[]>;

  day: Day;

  favorites: string[];

  isFavoritesFilterActive: boolean;

  private readonly _timeslotsToShow = new Subject<Show[]>();

  private readonly _unsubscribe = new Subject<void>();

  private _timeslots: Show[];

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _eventDataService: EventDataService,
    private _loadingController: LoadingController,
    private _storageService: StorageService
  ) {
    this.timeslotsToShow$ = this._timeslotsToShow.asObservable();
  }

  async ngOnInit(): Promise<void> {
    const loading = await this._loadingController.create({
      message: 'Please wait...'
    });

    await loading.present();

    this._activatedRoute.data
      .pipe(
        takeUntil(this._unsubscribe),
        switchMap(data => {
          // eslint-disable-next-line @typescript-eslint/dot-notation
          this.day = data['day'];

          switch (this.day) {
            case Day.thursday:
              return this._eventDataService.getThursday();
            case Day.friday:
              return this._eventDataService.getFriday();
            case Day.saturday:
              return this._eventDataService.getSaturday();
            default:
              throw Error('Unknown date');
          }
        })
      )
      .subscribe(async timeslots => {
        this._timeslots = timeslots;

        this.setFilteredItems();

        await loading.dismiss();
      });
  }

  ionViewWillEnter(): void {
    this._storageService
      .getFavorites()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(favs => (this.favorites = favs));
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  onItemSelected(itemId: string): void {
    this._router.navigate([itemId], { relativeTo: this._activatedRoute });
  }

  onToggleFavorites(): void {
    this.isFavoritesFilterActive = !this.isFavoritesFilterActive;

    this.setFilteredItems();
  }

  private setFilteredItems() {
    const newItems = this.isFavoritesFilterActive
      ? this._timeslots.filter(t => this.favorites?.includes(t.id))
      : this._timeslots;

    this._timeslotsToShow.next(newItems);
  }
}
