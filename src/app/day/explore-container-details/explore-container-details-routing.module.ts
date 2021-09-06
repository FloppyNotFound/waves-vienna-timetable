import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExploreContainerDetailsComponent } from './explore-container-details.component';

const routes: Routes = [
  {
    path: '',
    component: ExploreContainerDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExploreContainerDetailsRoutingModule {}
