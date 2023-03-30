import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalPlacePageRoutingModule } from './modal-place-routing.module';

import { ModalPlacePage } from './modal-place.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalPlacePageRoutingModule
  ],
  declarations: [ModalPlacePage]
})
export class ModalPlacePageModule {}
