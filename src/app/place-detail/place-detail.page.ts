import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TrPlaceService } from '../services/trPlace.service';
import { ViewImagePage } from '../view-image/view-image.page';
import { Geolocation } from '@capacitor/geolocation';
import { threadId } from 'worker_threads';
@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {

  @Input() data: any;
  @Input() km: any;
  public userInfo: any;
  public endPoint: any = environment.pointWeb;
  private ngUnsubscribe = new Subject();
  public placeId: any;
  public place: any;
  public work: any;
  public subSlide = {
    slidesPerView: 3.2,
    slidesOffsetBefore: 10,
    spaceBetween: 1,
    loop: false,
  };
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private trPlaceService: TrPlaceService,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    if(this.data !== null && this.data !== undefined){
      this.placeId = this.data;
      if(this.km !== undefined){
        this.getPlaceDetail();
      }else{
        this.printCurrentPosition();
      }
    }
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      if(this.km !== undefined){
        this.getPlaceDetail();
      }else{
        this.printCurrentPosition();
      }
      event.target.complete();
    }, 1000);
  };

  getPlaceDetail(){
    this.trPlaceService.findPlaceDetail(this.placeId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        this.place = result.serviceResult.value[0];
        if(this.place?.tr_working?.length > 0){
          let day_work = this.place?.tr_working[0]?.day_working;
          this.work = JSON.parse(day_work);
        }
      }
    }, err => {
      console.error(err);
    });
  }

  async closeModel(value: any = null) {
    await this.modalController.dismiss(value);
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


  async openGoogleMaps(latitude: any,longtitude: any){
    const coordinates = await Geolocation.getCurrentPosition();
    // window.open('https://www.google.com/maps/dir/?api=1&destination=' + latitude + ',' + longtitude );
    // window.open('https://www.google.com/maps/dir/?api=1&origin=&destination='+ latitude +',' + longtitude);
    window.open('https://www.google.com/maps/dir/'+coordinates.coords.latitude+','+coordinates.coords.longitude+'/'+ latitude +',' + longtitude);

  }

  async printCurrentPosition(){
    const coordinates = await Geolocation.getCurrentPosition();
    this.getPlaceKm(coordinates);
  };

  getPlaceKm(points: any){
    this.trPlaceService.findPlaceDetail(this.placeId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        this.place = result.serviceResult.value[0];
        if(this.place?.tr_working?.length > 0){
          let day_work = this.place?.tr_working[0]?.day_working;
          this.work = JSON.parse(day_work);
        }
        this.place.km = this.getDistanceFromLatLonInKm(points.coords.latitude, points.coords.longitude, +this.place.latitude, +this.place.longtitude);
      }
      console.log(this.place);

    }, err => {
      console.error(err);
    });
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
