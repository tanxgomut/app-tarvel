import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, RangeCustomEvent, ToastController } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { trAttention } from '../model/trAttention';
import { trMember } from '../model/trMember';
import { TrAttentionService } from '../services/trAttention.service';
import { TrMemberService } from '../services/trMember.service';
import { Preferences } from '@capacitor/preferences';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @Input() page: any;
  public attention = new trAttention();
  private ngUnsubscribe = new Subject();
  public user = {
    email: null,
    password: null
  }
  public test : any
  public member = new trMember();
  public cpassword: any;
  public userInfo: any;
  public lastEmittedValue: any;

  constructor(
    private modalController: ModalController,
    private trMemberService: TrMemberService,
    private trAttentionService: TrAttentionService,
    private router: Router,
    private toastController: ToastController,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.test = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required ],
      cpassword: ['', Validators.required],
      email: ['',Validators.email],
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

  async closeModel(value: any = null) {
    await this.modalController.dismiss(value);
  }

  // filterProduct(event: any){
  //   this.productStoreChat = this.productMockList.filter(x => x.product_name.toLowerCase().includes(event.target.value.toLowerCase()));
  // }

  onIonChange(ev: any, mode: any){
    this.lastEmittedValue = (ev as RangeCustomEvent).detail.value;
    if(mode === 'm1'){ this.attention.culture = this.lastEmittedValue; }
    if(mode === 'm2'){ this.attention.nature = this.lastEmittedValue; }
    if(mode === 'm3'){ this.attention.special = this.lastEmittedValue; }
  }

  registerMember(){
    if(this.test.valid){
        this.member.email = this.test.value.email;
        this.member.username = this.test.value.username;
        this.member.password = this.test.value.password;
        this.cpassword = this.test.value.cpassword;
        if( this.member.password === this.cpassword){
          this.attention.culture = (this.attention.culture) ? this.attention.culture : 0;
          this.attention.nature = (this.attention.nature) ? this.attention.nature : 0;
          this.attention.special = (this.attention.special) ? this.attention.special : 0;
          if(this.attention.culture > 0 || this.attention.nature > 0 || this.attention.special > 0){
            this.trMemberService.checkEmailMember(this.member.email).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
              if (result.serviceResult.status === "Success") {
                const checkEmail = result.serviceResult.value;
                if(checkEmail.length === 0){
                  this.member.active = 'Y'
                  this.member.createBy = 'system'
                  this.member.createDate = new Date();
                  this.member.login_with = 'email';
                  this.member.updateBy = 'system';
                  this.member.updateDate = new Date();
                  this.member.user_type = 'user';
                  this.trMemberService.createORupdate(this.member).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
                    if (result.serviceResult.status === "Success") {
                      const meber_id = result.serviceResult.value.member_id
                      this.attention.member_id = meber_id;
                      this.attention.active = 'Y';
                      this.attention.createBy = 'system';
                      this.attention.createDate = new Date();
                      this.attention.updateBy = 'system';
                      this.attention.updateDate = new Date();
                      this.trAttentionService.createORupdate(this.attention).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
                        if (result.serviceResult.status === "Success") {
                          this.closeModel();
                        }
                      }, err => {
                        console.error(err);
                      });

                    }
                  }, err => {
                    console.error(err);
                  });
                }
                if(checkEmail.length > 0){
                  this.presentToast('อีเมลล์นี้มีผู้ใช้แล้ว');
                }
              }
            }, err => {
              console.error(err);
            });

          }else{
            this.presentToast('ระบุความสนใจ');
          }
        }else{
          this.presentToast('รหัสผ่านไม่ตรงกัน');
        }
    }else{
      this.presentToast('กรอกข้อมูลให้ครบ');
    }
  }

  signIn(){
    if(this.user.email != null && this.user.password != null){
      this.trMemberService.appSignIn(this.user).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        if (result.serviceResult.status === "Success") {
          this.userInfo = result.serviceResult.value[0];
          const data = new trMember();
          data.member_id = this.userInfo.member_id;
          data.token = this.userInfo.token;
          data.updateDate = new Date();
          this.trMemberService.createORupdate(data).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
            if (result.serviceResult.status === "Success") {
              this.setPassword(this.user.password);
              this.setUserInfo(this.userInfo);
              this.setStatusLogin('Y');
              this.closeModel();
              this.router.navigate(['/index']);
            }
          }, err => {
            console.error(err);
          });
        }
        if (result.serviceResult.status === "none") {
          this.presentToast('อีเมล์หรือรหัสผ่านไม่ถูกต้อง');
        }
      }, err => {
        this.presentToast('เข้าสู่ระบบล้มเหลว');
        console.error(err);
      });
    }else{
      this.presentToast('กรอกข้อมูลให้ครบ');
    }
  }

  async presentToast(msg: any) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1000,
      position: 'top',
      cssClass: 'custom-toast',
    });

    await toast.present();
  }

  async setPassword(pass: any = null){
    await Preferences.set({
      key: 'password',
      value: (pass) ? pass : '',
    });
  };

  async setUserInfo(user: any = null){
    await Preferences.set({
      key: 'userInfo',
      value: (user) ? JSON.stringify(user) : '',
    });
  };

  async setStatusLogin(active: any){
    await Preferences.set({
      key: 'statusLogin',
      value: active,
    });
  };

  async getUserInfo(){
    const {value} = await Preferences.get({ key: 'userInfo' });
    const userInfo = JSON.parse(value!);
  };

  async getPassword(){
    const {value} = await Preferences.get({ key: 'password' });
  };



}
