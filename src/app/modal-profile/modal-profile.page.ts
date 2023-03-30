import { TrFileService } from './../services/trFile.service';
import { trMember } from './../model/trMember';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { ModalController, RangeCustomEvent, ToastController } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { trAttention } from '../model/trAttention';
import { TrAttentionService } from '../services/trAttention.service';
import { TrMemberService } from '../services/trMember.service';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-modal-profile',
  templateUrl: './modal-profile.page.html',
  styleUrls: ['./modal-profile.page.scss'],
})
export class ModalProfilePage implements OnInit {

  @Input() page: any;
  @Input() data: any;
  public userInfo: any;
  public userPassword: any;
  private ngUnsubscribe = new Subject();
  public lastEmittedValue: any;
  public attention = new trAttention();
  public oldPassword: any;
  public newPassword: any;
  public CPassword: any;
  public fileList: any = [];
  constructor(
    private modalController: ModalController,
    private trMemberService: TrMemberService,
    private trAttentionService: TrAttentionService,
    private router: Router,
    private toastController: ToastController,
    private trFileService: TrFileService
  ) { }

  ngOnInit() {
    this.getUserInfo();
    if(this.page === 'password'){
      this.getPassword();
    }
    if(this.page === 'Attention'){
      this.attention.attention_id = this.data.attention_id
      this.attention.culture = this.data.culture
      this.attention.nature = this.data.nature
      this.attention.special = this.data.special
    }

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

  async getUserInfo(){
    const {value} = await Preferences.get({ key: 'userInfo' });
    const userInfo = JSON.parse(value!);
    this.userInfo = userInfo;
    // console.log(this.userInfo);
  };

  async getPassword(){
    const {value} = await Preferences.get({ key: 'password' });
    this.userPassword = value;
  };


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

  uploadFile(event: any){
    const file = event.target.files[0];
    const fileName = file.name;
    const fileType = file.type;
    const fileExtention = file.type.split('/')[1];
    const fileSize = file.size;
    if (fileSize > 5120000) {
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      const fileDataupload: any = reader.result;
      const fileTest = [];
      fileTest.push({
        fileObj: file,
        fileData: fileDataupload,
        fileType: fileType,
        fileSize: fileSize,
        fileExtention: fileExtention
      });
      this.fileList = fileTest;
      console.log(this.fileList);
    };
    reader.readAsDataURL(file);
  }

  saveImageProfile(){
    const formData = new FormData();
      formData.append('ref_id', this.userInfo.member_id);
      formData.append('module_name', 'profile');
      formData.append('createBy', this.userInfo.member_id);
      formData.append('updateBy', this.userInfo.member_id);
      for (let i = 0; i < this.fileList?.length; i++) {
        formData.append('fileList[]', this.fileList[i]?.fileObj);
      }
      this.trFileService.testuploadFile(formData).pipe().subscribe(res => {
        if (res.serviceResult.status === "Success") {
          this.closeModel('uploadImage');
        }
      }, err => {
        console.error(err);
      });
  }

  saveAttention(){
    this.attention.updateBy = this.userInfo.member_id;
    this.attention.updateDate = new Date();
    this.trAttentionService.createORupdate(this.attention).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        this.closeModel('Attention');
      }
    }, err => {
      console.error(err);
    });
  }

  savePassword(){
    if(this.userPassword === this.oldPassword){
      if(this.newPassword === this.CPassword){
        const member = new trMember();
        member.member_id = this.userInfo.member_id;
        member.password = this.newPassword;
        member.updateBy = this.userInfo.member_id;
        member.updateDate = new Date();
        this.trMemberService.updatePassword(member).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
          if (result.serviceResult.status === "Success") {
            this.setPassword(this.newPassword);
            this.closeModel();
          }
        }, err => {
          console.error(err);
        });
      }else{
        this.presentToast('รหัสผ่านไหม่ไม่ถูกต้อง');
      }
    }else{
      this.presentToast('รหัสผ่านเดิมไม่ถูกต้อง');
    }
  }

  saveProfile(){
    // console.log(this.userInfo);
    if(this.userInfo.username !== null && this.userInfo.username !== '' && this.userInfo.username !== undefined){
      const user = new trMember();
      user.member_id = this.userInfo.member_id;
      user.username = this.userInfo.username;
      user.phone = this.userInfo.phone;
      user.gender = this.userInfo.gender;
      user.birthday = (this.userInfo.birthday !== null && this.userInfo.birthday !== '') ? dayjs(this.userInfo.birthday).format('YYYY-MM-DD') : null;
      user.updateBy = this.userInfo.member_id;
      user.updateDate = new Date();
      console.log(user);
      this.trMemberService.createORupdate(user).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        if (result.serviceResult.status === "Success") {
          this.setUserInfo(this.userInfo);
          this.closeModel('profile');
        }
      }, err => {
        console.error(err);
      });
    }else{
      this.presentToast('กำหนดชื่อโปรไฟล์');
    }

  }

  handleChange(e: any) {
    this.userInfo.gender = e.detail.value;
  }
  public date = null;
  async setPassword(pass: any = null){
    await Preferences.set({ key: 'password', value: (pass) ? pass : '', });
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

  async setUserInfo(user: any = null){
    await Preferences.set({
      key: 'userInfo',
      value: (user) ? JSON.stringify(user) : '',
    });
  };

}

