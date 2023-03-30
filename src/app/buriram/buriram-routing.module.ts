import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuriramPage } from './buriram.page';

const routes: Routes = [
  {
    path: '',
    component: BuriramPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuriramPageRoutingModule {}
