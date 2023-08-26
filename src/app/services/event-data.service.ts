import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Show } from '../backend-models/show';
import { ShowsResponse } from '../backend-models/shows-response';

@Injectable({ providedIn: 'root' })
export class EventDataService {
  // private readonly uri = 'http://127.0.0.1:8787';
  private readonly _uri =
    'https://waves-vienna-timetable-api.floppynotfound.workers.dev/';

  private _data: Show[] | undefined;

  constructor(private backendService: HttpClient) {}

  getThursday(): Observable<Show[]> {
    return this.getDataForDay('donnerstag');
  }

  getFriday(): Observable<Show[]> {
    return this.getDataForDay('freitag');
  }

  getSaturday(): Observable<Show[]> {
    return this.getDataForDay('samstag');
  }

  getItem(id: number): Observable<Show | undefined> {
    console.log('todo: get item', id);
    return of(void 0); // this.getData().pipe(map(items => items.find(d => d.id === id)));
  }

  private getData(): Observable<Show[]> {
    if (this._data) {
      return observableOf(this._data);
    }

    return this.backendService
      .get<ShowsResponse>(this._uri)
      .pipe(map(data => (this._data = data.shows)));
  }

  private getDataForDay(
    day: 'donnerstag' | 'freitag' | 'samstag'
  ): Observable<Show[]> {
    console.log('todo: handle day', day);
    return this.getData()
      .pipe
      // map(data => data.filter(d => d.terms.wcs_type[0].slug === day)),
      /* map(data => {
        data.forEach(d => {

          d.start = d.start.replace('+00:00', '+02:00');
          d.end = d.end.replace('+00:00', '+02:00');

          // Get image out first, before removing the image tag
          if (!d.thumbnail) {
            d.thumbnail = this.getThumbnailFromExcerpt(d.excerpt);
          }

          d.excerpt = d.excerpt.replace('<p>', '');
          d.excerpt = d.excerpt.replace('</p>', '');
          d.excerpt = d.excerpt.replace(/<img .*?>/g, '');
          d.excerpt = d.excerpt.replace('&#8217;', "'");
          d.excerpt = d.excerpt.replace('&#8220;', '"');
          d.excerpt = d.excerpt.replace('&#8221;', '"');
          d.excerpt = d.excerpt.replace('&#8230;', '');
          d.excerpt = d.excerpt.replace('&nbsp;', ' ');
        });

        return data;
      }) */
      ();
  }

  /*  private getThumbnailFromExcerpt(excerpt: string): string {
    const regex = new RegExp('(?<=src=")(.*?)(?=")');
    const result = regex.exec(excerpt);

    return result && result.length >= 1 ? result[1] : '';
  } */
}
