import { TrTourismModelService } from './../services/trTourismModel.service';
import { TrPlaceShowStatusService } from './../services/trPlaceShowStatus.service';
import { trSubTourismModel } from './../model/trSubTourismModel';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { SwiperComponent } from 'swiper/angular';
import SwiperCore, { Autoplay, Keyboard, Pagination, Scrollbar, Zoom } from 'swiper';
import { ActivatedRoute, Router } from '@angular/router';
import { TrSubTourismModelService } from '../services/trSubTourismModel.service';
import { Subject, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ModalController } from '@ionic/angular';
import { PlaceDetailPage } from '../place-detail/place-detail.page';
SwiperCore.use([Autoplay, Keyboard, Pagination, Scrollbar, Zoom]);

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage implements OnInit {

  @ViewChild('swiper') swiper: SwiperComponent | any;
  @ViewChild('subSwiper') subSwiper: SwiperComponent | any;
  public userInfo: any;
  public endPoint: any = environment.pointWeb;
  public userPassword: any;
  public subModelList: any;
  public mainModelList: any;
  public topicList: any;
  private ngUnsubscribe = new Subject();
  public itemColor =[
    {color: '#1E90FF'},{color: '#ffffff'},{color: '#666666'},{color: '#5E1594'},{color: '#c2c2c2'},
  ]

  public slideOpts = {
    slidesPerView: 1,
    initialSlide: 0,
    speed: 400,
    loop: true,
    spaceBetween: 1,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: true
  };

  public subSlide = {
    slidesPerView: 4.5,
    // freeMode: true,
    // slidesPerView: 5.5,
    slidesOffsetBefore: 10,
    spaceBetween: 2,
    // initialSlide: 0,
    // speed: 400,
    loop: false,
    // spaceBetween: 1,
    // autoplay: {
    //   delay: 3000,
    //   disableOnInteraction: false,
    // },
    // pagination: true
  };

  public topicSlide = {
    slidesPerView: 2.3,
    freeMode: true,
    // slidesPerView: 5.5,
    slidesOffsetBefore: 10,
    spaceBetween: 1,
    // initialSlide: 0,
    // speed: 400,
    // loop: true,
    // spaceBetween: 1,
    // autoplay: {
    //   delay: 3000,
    //   disableOnInteraction: false,
    // },
    // pagination: true
  };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private TrSubTourismModelService: TrSubTourismModelService,
    private TrTourismModelService: TrTourismModelService,
    private TrPlaceShowStatusService: TrPlaceShowStatusService,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    // this.getUserInfo();
    // this.getTourismModel();
    // this.getSubTourismModel();
    // this.getTopicMainPage();
  }

  ionViewWillEnter(){
    this.getUserInfo();
    this.getTourismModel();
    this.getSubTourismModel();
    this.getTopicMainPage();
  }

  ngAfterViewInit() {
    this.swiper.swiperRef.autoplay.running = true;
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.getUserInfo();
      this.getTourismModel();
      this.getSubTourismModel();
      this.getTopicMainPage();
      event.target.complete();
    }, 1000);
  };

  async getSubTourismModel(){
    this.TrSubTourismModelService.findAll().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        this.subModelList = result.serviceResult.value;
        let i = 0;
        for(let sub of  this.subModelList){
          sub.color = this.itemColor[i].color;
          i = i + 1;
          if(i === 5){
            i = 0;
          }
        }
      }
    }, err => {
      console.error(err);
    });
  }

  async getTopicMainPage(){
    this.TrPlaceShowStatusService.findPlaceShowInApp('main').pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        this.topicList = result.serviceResult.value;
      }
    }, err => {
      console.error(err);
    });
  }

  async getTourismModel(){
    this.TrTourismModelService.findAll().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        this.mainModelList = result.serviceResult.value;
        let image = ['c.jpg','n.jpg','s.jpg']
        for(let i = 0; i < this.mainModelList.length ; i++){
          this.mainModelList[i].img = image[i];
        }
      }
    }, err => {
      console.error(err);
    });
  }

  async gotoPlaceDetail(id:any) {
    const modal = await this.modalController.create({
      component: PlaceDetailPage,
      componentProps: {data: id}
    });
    modal.onDidDismiss().then((result) => {
      if (result.data !== null && result.data !== undefined) {
      }
    });
    return await modal.present();
  }

  async gotoTopic(topic:any){
    this.router.navigate(['/view-topic'], {queryParams: {topicId: topic}});
  }

  async gotoPlaceSub(stm:any){
    this.router.navigate(['/place'], {queryParams: {sub: stm}});
  }

  async gotoPlaceMain(tm:any){
    this.router.navigate(['/place'], {queryParams: {main: tm}});
  }

  async gotoSearch(){
    this.router.navigate(['/search-page']);
  }

  async getUserInfo(){
    const {value} = await Preferences.get({ key: 'userInfo' });
    const userInfo = JSON.parse(value!);
    this.userInfo = userInfo;
  };

  async getPassword(){
    const {value} = await Preferences.get({ key: 'password' });
    this.userPassword = value;
  };

  test(){
    window.open('https://www.google.com/maps/dir/?api=1&destination='+ '15.101396957067987' +',' + '103.16884105163315');
  }

}
