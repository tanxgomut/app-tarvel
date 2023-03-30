import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-image',
  templateUrl: './view-image.page.html',
  styleUrls: ['./view-image.page.scss'],
})
export class ViewImagePage implements OnInit {

  @Input() data: any;
  public endPoint: any = environment.pointWeb;
  public preview: any;
  public subSlide = {
    slidesPerView: 1,
    slidesOffsetBefore: 0,
    spaceBetween: 0,
    loop: false,
  };
  constructor(
    private modalController: ModalController,
    private router: Router,
  ) { }

  ngOnInit() {
    if(this.data){
      this.preview = this.data;
    }
  }

  async closeModel(value: any = null) {
    await this.modalController.dismiss(value);
  }

}
