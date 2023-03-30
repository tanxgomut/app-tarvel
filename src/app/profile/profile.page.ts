import { TrFileService } from './../services/trFile.service';
import { ModalProfilePage } from './../modal-profile/modal-profile.page';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { TrAttentionService } from '../services/trAttention.service';
import { TrMemberService } from '../services/trMember.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  private ngUnsubscribe = new Subject();
  public endPoint: any = environment.pointWeb;
  public userInfo: any;
  public userPassword: any;
  public AttentionValue: any;
  public fileList: any;
  constructor(
    private modalController: ModalController,
    private trMemberService: TrMemberService,
    private trAttentionService: TrAttentionService,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController,
    private trFileService: TrFileService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getUserInfo();
    this.getPassword();
  }

  // ngOnDestroy() {
  //   // this.ngUnsubscribe.next(null);
  //   // this.ngUnsubscribe.complete();
  // }

  async gotoPlaceMain(){
    this.router.navigate(['/place'], {queryParams: {main: 12}});
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.getUserInfo();
      this.getPassword();
      event.target.complete();
    }, 1000);
  };

  async getUserInfo(){
    const {value} = await Preferences.get({ key: 'userInfo' });
    const userInfo = JSON.parse(value!);
    this.userInfo = userInfo;
    if(this.userInfo){
      this.getAttentionMember(this.userInfo.member_id);
      this.getImageProfile(this.userInfo.member_id);
    }
  };

  getImageProfile(member_id: any){
    this.trFileService.findById(member_id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        this.fileList = result.serviceResult.value[0];

      }
    }, err => {
      console.error(err);
    });
  }

  getAttentionMember(data: any){
    this.trAttentionService.findByPk(data).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        this.AttentionValue = result.serviceResult.value;
      }
    }, err => {
      console.error(err);
    });
  }

  async getPassword(){
    const {value} = await Preferences.get({ key: 'password' });
    this.userPassword = value;
  };

  async setStatusLogin(active: any){
    await Preferences.set({
      key: 'statusLogin',
      value: active,
    });
  };

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'ต้องการล็อกเอ้าท์หรื่อไม่ ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.logout();
          },
        },
      ],
    });

    await alert.present();
  }

  async logout(){
    await Preferences.set({ key: 'statusLogin', value: 'N',});
    await Preferences.remove({ key: 'userInfo' });
    await Preferences.remove({ key: 'password' });
    this.router.navigate(['/home']);
  }

  async gotoLogin(){
    this.router.navigate(['/home'], {queryParams: {login: 'login'}});
  }

  async modalProfile(page: any = null) {
    let scss = '';
    let dataValue = null;
    if(page === 'password'){
      scss = 'passwordUpdate';
    }
    if(page === 'profile'){
      scss = 'profileUpdate';
    }
    if(page === 'Attention'){
      scss = 'attentionUpdate';
      dataValue = this.AttentionValue;
    }
    if(page === 'uploadImage'){
      scss = 'uploadImageUpdate';
    }
    const modal = await this.modalController.create({
      component: ModalProfilePage,
      cssClass: scss,
      componentProps: {
        page: page,
        data: dataValue
      }
    });
    modal.onDidDismiss().then((result) => {
      if (result.data !== null && result.data !== undefined) {
        if(result.data === 'Attention'){
          this.getAttentionMember(this.userInfo.member_id);
        }
        if(result.data === 'profile'){
          this.getUserInfo();
        }

        if(result.data === 'uploadImage'){
          this.getImageProfile(this.userInfo.member_id);
        }


      }
    });
    return await modal.present();
  }

}
