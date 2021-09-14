import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import { TimeSlot } from '../backend-models/backend-models.interface';

@Injectable({ providedIn: 'root' })
export class EventDataService {
  // private readonly uri = 'http://127.0.0.1:8787';
  private readonly uri =
    'https://waves-vienna-worker.floppynotfound.workers.dev';

  private data: TimeSlot[] | undefined;

  constructor(private backendService: HttpClient) {}

  getThursday(): Observable<TimeSlot[]> {
    return this.getDataForDay('donnerstag');
  }

  getFriday(): Observable<TimeSlot[]> {
    return this.getDataForDay('freitag');
  }

  getSaturday(): Observable<TimeSlot[]> {
    return this.getDataForDay('samstag');
  }

  getItem(id: number): Observable<TimeSlot | undefined> {
    return this.getData().pipe(map(items => items.find(d => d.id === id)));
  }

  private getData(): Observable<TimeSlot[]> {
    if (this.data) {
      return observableOf(this.data);
    }

    return this.backendService
      .get<TimeSlot[]>(this.uri)
      .pipe(map(data => (this.data = data)));
  }

  private getDataForDay(
    day: 'donnerstag' | 'freitag' | 'samstag'
  ): Observable<TimeSlot[]> {
    return this.getData().pipe(
      map(data => data.filter(d => d.terms.wcs_type[0].slug === day)),
      map(data => {
        data.forEach(d => {
          d.start = d.start.replace('+00:00', '+02:00');
          d.end = d.end.replace('+00:00', '+02:00');

          d.excerpt = d.excerpt.replace('<p>', '');
          d.excerpt = d.excerpt.replace('</p>', '');
          d.excerpt = d.excerpt.replace('&#8230;', '');
        });

        return data;
      })
    );
  }
}
