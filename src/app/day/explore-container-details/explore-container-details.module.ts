import { IonicModule } from '@ionic/angular';
import { ExploreContainerDetailsComponent } from './explore-container-details.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExploreContainerDetailsRoutingModule } from './explore-container-details-routing.module';

@NgModule({
  declarations: [ExploreContainerDetailsComponent],
  imports: [CommonModule, IonicModule, ExploreContainerDetailsRoutingModule],
})
export class ExploreContainerDetailsModule {}
