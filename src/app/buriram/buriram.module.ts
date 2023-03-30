import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuriramPageRoutingModule } from './buriram-routing.module';

import { BuriramPage } from './buriram.page';
import { TabsPagePageModule } from '../tabs-page/tabs-page.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BuriramPageRoutingModule,
    TabsPagePageModule
  ],
  declarations: [BuriramPage]
})
export class BuriramPageModule {}
