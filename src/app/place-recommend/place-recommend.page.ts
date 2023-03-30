import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { LoadingController, ModalController } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PlaceDetailPage } from '../place-detail/place-detail.page';
import { ViewImagePage } from '../view-image/view-image.page';
import { TrPlaceService } from './../services/trPlace.service';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-place-recommend',
  templateUrl: './place-recommend.page.html',
  styleUrls: ['./place-recommend.page.scss'],
})
export class PlaceRecommendPage implements OnInit {

  public userInfo: any;
  public endPoint: any = environment.pointWeb;
  private ngUnsubscribe = new Subject();
  public placeList: any;
  public mockplaceList: any;
  public textPlace: any;
  public subSlide = {
    slidesPerView: 3.2,
    slidesOffsetBefore: 10,
    spaceBetween: 1,
    loop: false,
  };
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private TrPlaceService: TrPlaceService,
    private modalController: ModalController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getUserInfo();
    // this.getPlaceRecommend();
  }

  // ngOnDestroy() {
  //   // this.ngUnsubscribe.next(null);
  //   // this.ngUnsubscribe.complete();
  // }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.getUserInfo();
      event.target.complete();
    }, 1000);
  };

  async getUserInfo(){
    const {value} = await Preferences.get({ key: 'userInfo' });
    const userInfo = JSON.parse(value!);
    this.userInfo = userInfo;
    if(this.userInfo){
      this.printCurrentPosition();
    }
  };

  async printCurrentPosition(){
    const loading = await this.loadingCtrl.create({
      cssClass: 'custom-loading',
      showBackdrop: false,
      backdropDismiss: false,
    });
    await loading.present();
    const coordinates = await Geolocation.getCurrentPosition();
    this.getPlaceRecommend(coordinates, loading);
    // console.log('Current position:', coordinates.coords.latitude);
    // console.log('Current position:', coordinates.coords.longitude);
  };

  async getPlaceRecommend(points: any, loading: any){
    this.TrPlaceService.findPlaceRecommend(this.userInfo.member_id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        this.placeList = result.serviceResult.value.data;
        this.mockplaceList = result.serviceResult.value.data;
        this.textPlace = result.serviceResult.value.text;
        for(let place of this.placeList){
          place.km = this.getDistanceFromLatLonInKm(points.coords.latitude, points.coords.longitude, +place.latitude, +place.longtitude);
        }
        this.placeList = this.placeList.sort((a: any,b: any)=> a.km - b.km);
        loading.dismiss();
        console.log( this.placeList);
        console.log(this.textPlace);

      }
    }, err => {
      loading.dismiss();
      console.error(err);
    });
  }

  async gotoLogin(){
    this.router.navigate(['/home'], {queryParams: {login: 'login'}});
  }

  filterPlace(event: any) {
    this.placeList = this.mockplaceList.filter((x: {
      stmList: any;
      tm_name: any; place_name: string;
    }) =>
    x.place_name.toLowerCase().includes(event.target.value.toLowerCase())
    || x.tm_name.toLowerCase().includes(event.target.value.toLowerCase())
    || x.stmList.toLowerCase().includes(event.target.value.toLowerCase())
    );
  }

  async modalViewImage(image: any = null) {
    const modal = await this.modalController.create({
      component: ViewImagePage,
      componentProps: {data: image}
    });
    modal.onDidDismiss().then((result) => {
      if (result.data !== null && result.data !== undefined) {
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
