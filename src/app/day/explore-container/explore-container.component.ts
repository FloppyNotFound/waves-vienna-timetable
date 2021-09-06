import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { TimeSlot } from '../../backend-models/backend-models.interface';

@Component({
  selector: 'app-explore-container',
  templateUrl: './explore-container.component.html',
  styleUrls: ['./explore-container.component.scss'],
})
export class ExploreContainerComponent {
  @Input() timeslots$: Observable<TimeSlot[]>;

  @Output() timeslotSelected = new EventEmitter<number>();

  onItemSelected(itemId: number): void {
    this.timeslotSelected.emit(itemId);
  }
}
