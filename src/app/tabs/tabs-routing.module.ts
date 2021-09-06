import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Day } from './models/day.enum';
import { TabsPage } from './tabs.page';

const getDayRoute = (day: Day): Routes => [
  {
    path: '',
    loadChildren: () =>
      import('../day/day.module').then((m) => m.DayPageModule),
    data: { day },
    pathMatch: 'full',
  },
  {
    path: ':id',
    loadChildren: () =>
      import(
        '../day/explore-container-details/explore-container-details.module'
      ).then((m) => m.ExploreContainerDetailsModule),
  },
];

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'thursday',
        children: getDayRoute(Day.thursday),
      },
      {
        path: 'friday',
        children: getDayRoute(Day.friday),
      },
      {
        path: 'saturday',
        children: getDayRoute(Day.saturday),
      },
      {
        path: 'about',
        loadChildren: () =>
          import('../about/about.module').then((m) => m.AboutPageModule),
      },
      {
        path: '',
        redirectTo: '/tabs/thursday',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/thursday',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
