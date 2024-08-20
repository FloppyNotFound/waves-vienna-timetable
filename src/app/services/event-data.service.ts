import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, zip } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Show } from '../backend-models/show';
import { ShowDays } from '../backend-models/show-days';

enum Day {
  Thursday = 4,
  Friday = 5,
  Saturday = 6
}

@Injectable({ providedIn: 'root' })
export class EventDataService {
  // private readonly uri = 'http://127.0.0.1:8787';
  private readonly _uri =
    'https://waves-vienna-timetable-api.floppynotfound.workers.dev/';

  private _data: ShowDays | undefined;

  constructor(private backendService: HttpClient) {}

  getThursday(): Observable<Show[]> {
    return this.getDataForDay(Day.Thursday);
  }

  getFriday(): Observable<Show[]> {
    return this.getDataForDay(Day.Friday);
  }

  getSaturday(): Observable<Show[]> {
    return this.getDataForDay(Day.Saturday);
  }

  getItem(id: number): Observable<Show | undefined> {
    return zip(
      this.getDataForDay(Day.Thursday),
     this.getDataForDay(Day.Friday),
     this.getDataForDay(Day.Saturday)
    ).pipe(map(items => items.flat().find(d => d.id === id)));
  }

  private getData(): Observable<ShowDays> {
    if (this._data) {
     return observableOf(this._data);
    }

    return this.backendService
      .get<ShowDays>(this._uri)
      .pipe(tap(data => (this._data = data)));
  }

  private getDataForDay(day: Day): Observable<Show[]> {
    return this.getData().pipe(
      map(showDays => {
        if(day === Day.Thursday) {
          return showDays.thursday;
        } else if(day === Day.Friday) {
          return showDays.friday;
        } else {
          return showDays.saturday;
        }
      }),
      tap(data => data.forEach(d => (d.thumbnail = d.thumbnail ?? 'assets/icon/favicon.png')))
    );
  }
}
