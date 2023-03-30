import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlaceRecommendPageRoutingModule } from './place-recommend-routing.module';

import { PlaceRecommendPage } from './place-recommend.page';
import { TabsPagePageModule } from '../tabs-page/tabs-page.module';
import { SwiperModule } from 'swiper/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlaceRecommendPageRoutingModule,
    TabsPagePageModule,
    SwiperModule
  ],
  declarations: [PlaceRecommendPage]
})
export class PlaceRecommendPageModule {}
