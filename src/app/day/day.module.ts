import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DayPage } from './day.page';
import { ExploreContainerComponent } from './explore-container/explore-container.component';
import { DayPageRoutingModule } from './day-routing.module';
import { IsFavoritePipe } from './pipes/is-favorite.pipe';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, DayPageRoutingModule],
  declarations: [DayPage, ExploreContainerComponent, IsFavoritePipe]
})
export class DayPageModule {}
