import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Show } from '../../backend-models/show';

@Component({
  selector: 'app-explore-container',
  templateUrl: './explore-container.component.html',
  styleUrls: ['./explore-container.component.scss']
})
export class ExploreContainerComponent {
  @Input() timeslots$: Observable<Show[]>;

  @Input() favorites: number[] | undefined;

  @Output() readonly timeslotSelected = new EventEmitter<number>();

  onItemSelected(itemId: number): void {
    this.timeslotSelected.emit(itemId);
  }
}
