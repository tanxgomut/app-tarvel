import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewTopicPageRoutingModule } from './view-topic-routing.module';

import { ViewTopicPage } from './view-topic.page';
import { TabsPagePageModule } from '../tabs-page/tabs-page.module';
import { SwiperModule } from 'swiper/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewTopicPageRoutingModule,
    TabsPagePageModule,
    SwiperModule
  ],
  declarations: [ViewTopicPage]
})
export class ViewTopicPageModule {}
