import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewImagePageRoutingModule } from './view-image-routing.module';

import { ViewImagePage } from './view-image.page';
import { SwiperModule } from 'swiper/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewImagePageRoutingModule,
    SwiperModule
  ],
  declarations: [ViewImagePage]
})
export class ViewImagePageModule {}
