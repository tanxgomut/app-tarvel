import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PlaceDetailPage } from '../place-detail/place-detail.page';
import { TrPlaceShowStatusService } from '../services/trPlaceShowStatus.service';
import { ViewImagePage } from '../view-image/view-image.page';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-view-topic',
  templateUrl: './view-topic.page.html',
  styleUrls: ['./view-topic.page.scss'],
})
export class ViewTopicPage implements OnInit {

  public endPoint: any = environment.pointWeb;
  private ngUnsubscribe = new Subject();
  public topic: any;
  public topicId: any;
  public subSlide = {
    slidesPerView: 3.2,
    slidesOffsetBefore: 10,
    spaceBetween: 1,
    loop: false,
  };
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private trPlaceShowStatusService: TrPlaceShowStatusService,
    private modalController: ModalController,
    private loadingCtrl: LoadingController
  ) {

  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.topicId = params['topicId'];
      if(this.topicId !== '' && this.topicId !== null){
        this.printCurrentPosition();
      }
    });
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.activatedRoute.queryParams.subscribe(params => {
        this.topicId = params['topicId'];
        if(this.topicId !== '' && this.topicId !== null){
          this.printCurrentPosition();
        }
      });
      event.target.complete();
    }, 1000);
  };

  async printCurrentPosition(){
    const loading = await this.loadingCtrl.create({
      cssClass: 'custom-loading',
      showBackdrop: false,
      backdropDismiss: false,
    });
    await loading.present();
    const coordinates = await Geolocation.getCurrentPosition();
    this.getPlaceShowById(coordinates, loading);
  };

  async getPlaceShowById(points: any, loading: any){
    this.trPlaceShowStatusService.findPlaceShowById(this.topicId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        this.topic = result.serviceResult.value[0];
        console.log(this.topic, 'topicList');
        for(let place of this.topic.placeList){
          place.km = this.getDistanceFromLatLonInKm(points.coords.latitude, points.coords.longitude, +place.latitude, +place.longtitude);
        }
        this.topic.placeList = this.topic.placeList.sort((a: any,b: any)=> a.km - b.km);
        loading.dismiss();
      }
    }, err => {
      loading.dismiss();
      console.error(err);
    });
  }

  async modalViewImage(image: any = null) {
    const modal = await this.modalController.create({
      component: ViewImagePage,
      componentProps: {data: image}
    });
    modal.onDidDismiss().then((result) => {
      if (result.data !== null && result.data !== undefined) {
        console.log(result);
      }
    });
    return await modal.present();
  }

  async gotoPlaceDetail(id:any, km: any) {
    const modal = await this.modalController.create({
      component: PlaceDetailPage,
      componentProps: {data: id, km: km}
    });
    modal.onDidDismiss().then((result) => {
      if (result.data !== null && result.data !== undefined) {
      }
    });
    return await modal.present();
  }

  getDistanceFromLatLonInKm(lat1: any,lon1: any, lat2: any,lon2: any  ) {
    var R = 6371;
    var dLat = this.deg2rad(lat2 - lat1);
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d;
  }

  deg2rad(deg: any) {
    return deg * (Math.PI/180)
  }

}
