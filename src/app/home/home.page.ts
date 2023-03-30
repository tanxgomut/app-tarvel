import { LoginPage } from './../login/login.page';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public userInfo: any;
  public statusLogin: any;
  public checkParam : any;
  constructor(
    public modalController: ModalController,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {

  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.checkParam = params['login'];
    });
    this.getUserInfo();
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
        console.log(result);

      }
    });
    return await modal.present();
  }

}
