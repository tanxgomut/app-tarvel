import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalPlacePage } from './modal-place.page';

const routes: Routes = [
  {
    path: '',
    component: ModalPlacePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalPlacePageRoutingModule {}
