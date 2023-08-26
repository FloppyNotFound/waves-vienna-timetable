import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Show } from '../backend-models/show';
import { ShowsResponse } from '../backend-models/shows-response';

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

  private _data: Show[] | undefined;

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

  getItem(id: string): Observable<Show | undefined> {
    return this.getData().pipe(map(items => items.find(d => d.id === id)));
  }

  private getData(): Observable<Show[]> {
    if (this._data) {
      return observableOf(this._data);
    }

    return this.backendService
      .get<ShowsResponse>(this._uri)
      .pipe(map(data => (this._data = data.shows)));
  }

  private getDataForDay(day: Day): Observable<Show[]> {
    return this.getData().pipe(
      map(data =>
        data.filter(d => {
          const dataDate = new Date(d.start);
          const dataDay = dataDate.getDay();
          const dataHour = dataDate.getHours();

          // Show night shows at the previous day
          const dayBreakHour = 5;

          return (
            (dataDay === day && dataHour > dayBreakHour) ||
            (dataDay === day + 1 && dataHour < dayBreakHour)
          );
        })
      ),
      tap(data => data.forEach(d => (d.thumbnail = 'assets/icon/favicon.png')))
    );
  }
}
