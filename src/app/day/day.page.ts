import { StorageService } from './../services/storage.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { TimeSlot } from '../backend-models/backend-models.interface';
import { EventDataService } from '../services/event-data.service';
import { Day } from '../tabs/models/day.enum';

@Component({
  selector: 'app-day',
  templateUrl: 'day.page.html',
  styleUrls: ['day.page.scss'],
})
export class DayPage implements OnInit, OnDestroy {
  timeslotsToShow$: Observable<TimeSlot[]>;

  day: Day;

  favorites: number[];

  isFavoritesFilterActive: boolean;

  private readonly timeslotsToShow = new Subject<TimeSlot[]>();

  private readonly unsubscribe = new Subject<void>();

  private timeslots: TimeSlot[];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private eventDataService: EventDataService,
    private loadingController: LoadingController,
    private storageService: StorageService
  ) {
    this.timeslotsToShow$ = this.timeslotsToShow.asObservable();
  }

  async ngOnInit(): Promise<void> {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });

    await loading.present();

    this.activatedRoute.data
      .pipe(
        takeUntil(this.unsubscribe),
        switchMap((data) => {
          this.day = data.day;

          switch (data.day) {
            case Day.thursday:
              return this.eventDataService.getThursday();
            case Day.friday:
              return this.eventDataService.getFriday();
            case Day.saturday:
              return this.eventDataService.getSaturday();
            default:
              throw Error('Unknown date');
          }
        })
      )
      .subscribe(async (timeslots) => {
        this.timeslots = timeslots;

        this.setFilteredItems();

        await loading.dismiss();
      });
  }

  ionViewWillEnter(): void {
    this.storageService
      .getFavorites()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((favs) => (this.favorites = favs));
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onItemSelected(itemId: number): void {
    this.router.navigate([itemId], { relativeTo: this.activatedRoute });
  }

  onToggleFavorites(): void {
    this.isFavoritesFilterActive = !this.isFavoritesFilterActive;

    this.setFilteredItems();
  }

  private setFilteredItems() {
    const newItems = this.isFavoritesFilterActive
      ? this.timeslots.filter((t) => this.favorites?.includes(t.id))
      : this.timeslots;

    this.timeslotsToShow.next(newItems);
  }
}
