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

  @Input() favorites: string[] | undefined;

  @Output() readonly timeslotSelected = new EventEmitter<string>();

  onItemSelected(itemId: string): void {
    this.timeslotSelected.emit(itemId);
  }
}
