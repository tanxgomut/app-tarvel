import { LoginPage } from './../login/login.page';
import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { HttpClient } from '@angular/common/http';
import { FacebookLogin } from '@capacitor-community/facebook-login';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import {isPlatform} from '@ionic/angular'
import { Subject, takeUntil } from 'rxjs';
import { trAttention } from '../model/trAttention';
import { TrMemberService } from '../services/trMember.service';
import { TrAttentionService } from '../services/trAttention.service';
import { trMember } from '../model/trMember';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  private ngUnsubscribe = new Subject();
  public attention = new trAttention();
  public member = new trMember();
  public userInfo: any;
  public statusLogin: any;
  public checkParam : any;
  public token: any;
  public user: any;
  public usergoogle: any;
  constructor(
    public modalController: ModalController,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private toastController: ToastController,
    private trMemberService: TrMemberService,
    private trAttentionService: TrAttentionService,
    private loadingCtrl: LoadingController
  ) {

  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.checkParam = params['login'];
    });
    this.getUserInfo();
    GoogleAuth.initialize();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }


  async login() {
    const FACEBOOK_PERMISSIONS = [  'email',  'user_birthday',  'user_photos', 'user_gender',];
    const result = await FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS });
    if (result.accessToken && result.accessToken.userId) {
      this.token = result.accessToken;
      this.loadUserData();
    } else {
      this.getCurrentToken();
    }
  }

  async getCurrentToken() {
    const result = await FacebookLogin.getCurrentAccessToken();
    if (result.accessToken) {
      this.token = result.accessToken;
      this.loadUserData();
    }
  }

  async loadUserData() {
    const url = `https://graph.facebook.com/${this.token.userId}?fields=id,name,picture.width(720),birthday,email&access_token=${this.token.token}`;
    this.http.get(url).subscribe(res => {
      this.user = res;
      console.log(JSON.stringify(this.user));
    });
  }

  async googleSignIn() {
    const user = await GoogleAuth.signIn();
    this.usergoogle = user;
    if(this.usergoogle.id){
      this.printCurrentPosition(this.usergoogle, 'google');
    }else{
      this.presentToast('Google Sign In Error');
    }
  }

  async getUserInfo(){
    const statusLogin = await Preferences.get({ key: 'statusLogin' });
    const {value} = await Preferences.get({ key: 'userInfo' });
    const userInfo = JSON.parse(value!);
    this.userInfo = userInfo;
    this.statusLogin = statusLogin;
    if(this.statusLogin.value === 'Y' && this.userInfo){
      this.router.navigate(['index']);
    }
  };

  async gotoIndex(){
    this.setStatusLogin();
    await this.router.navigate(['/index']);
  }

  async setStatusLogin(){
    await Preferences.set({
      key: 'statusLogin',
      value: 'Y',
    });
  };

  async presentToast(msg: any) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1000,
      position: 'top',
      cssClass: 'custom-toast',
    });

    await toast.present();
  }

  async modalLogin(page: any = null) {
    let scss = '';
    if(page === 'login'){
      scss = 'loginLogin'
    }
    if(page === 'Register'){
      scss = 'registerLogin'
    }
    const modal = await this.modalController.create({
      component: LoginPage,
      cssClass: scss,
      componentProps: {
        page: page,
      }
    });
    modal.onDidDismiss().then((result) => {
      if (result.data !== null && result.data !== undefined) {
      }
    });
    return await modal.present();
  }


  registerMemberGmail(member: any, type: any , loading: any){
    this.trMemberService.checkEmailMember(member.email).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        const checkEmail = result.serviceResult.value;
        if(checkEmail.length === 0){
          this.member.username = member.familyName + ' ' + member.givenName
          this.member.email = member.email;
          this.member.active = 'Y'
          this.member.createBy = 'system'
          this.member.createDate = new Date();
          this.member.login_with = type;
          this.member.updateBy = 'system';
          this.member.updateDate = new Date();
          this.member.user_type = 'user';
          this.trMemberService.googleRegister(this.member).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
            if (result.serviceResult.status === "Success") {
              const meber_id = result.serviceResult.value.member_id
              this.attention.nature = 1;
              this.attention.culture = 1;
              this.attention.special = 1;
              this.attention.member_id = meber_id;
              this.attention.active = 'Y';
              this.attention.createBy = 'system';
              this.attention.createDate = new Date();
              this.attention.updateBy = 'system';
              this.attention.updateDate = new Date();
              this.trAttentionService.createORupdate(this.attention).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
                if (result.serviceResult.status === "Success") {
                  this.signIn(this.member.email,type ,loading);
                }
              }, err => {
                loading.dismiss();
                console.error(err);
              });

            }
          }, err => {
            loading.dismiss();
            console.error(err);
          });
        }
        if(checkEmail.length > 0){
          if(checkEmail[0].login_with === 'google' || checkEmail[0].login_with === 'facebook'){
            this.signIn(member.email, type, loading)
          }else{
            loading.dismiss();
            this.presentToast('อีเมลล์นี้มีผู้ใช้แล้ว');
          }
        }
      }
    }, err => {
      loading.dismiss();
      console.error(err);
    });
  }

  signIn(email: any,type: any, loading: any){
    this.trMemberService.googleSignIn(email, type).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        this.userInfo = result.serviceResult.value[0];
        const data = new trMember();
        data.member_id = this.userInfo.member_id;
        data.token = this.userInfo.token;
        data.updateDate = new Date();
        this.trMemberService.googleRegister(data).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
          if (result.serviceResult.status === "Success") {
            this.router.navigate(['/index']);
            this.setUserInfo(this.userInfo);
            loading.dismiss();
          }
        }, err => {
          loading.dismiss();
          console.error(err);
        });
      }
    }, err => {
      loading.dismiss();
      this.presentToast('เข้าสู่ระบบล้มเหลว');
      console.error(err);
    });
  }

  async setUserInfo(user: any = null){
    await Preferences.set({
      key: 'userInfo',
      value: (user) ? JSON.stringify(user) : '',
    });
  };

  async printCurrentPosition(user: any, type: any){
    const loading = await this.loadingCtrl.create({
      cssClass: 'custom-loading',
      showBackdrop: false,
      backdropDismiss: false,
    });
    await loading.present();
    this.registerMemberGmail(user, type, loading);
  };

}
