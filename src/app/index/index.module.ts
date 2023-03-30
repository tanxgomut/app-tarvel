import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IndexPageRoutingModule } from './index-routing.module';
import { SwiperModule } from 'swiper/angular';
import { IndexPage } from './index.page';
import { TabsPagePageModule } from "../tabs-page/tabs-page.module";

@NgModule({
    declarations: [IndexPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        IndexPageRoutingModule,
        TabsPagePageModule,
        SwiperModule

    ]
})
export class IndexPageModule {}
