import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlaceRecommendPage } from './place-recommend.page';

const routes: Routes = [
  {
    path: '',
    component: PlaceRecommendPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlaceRecommendPageRoutingModule {}
