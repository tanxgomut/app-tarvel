import { TrBuriramService } from './../services/trBuriram.service';
import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Subject, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-buriram',
  templateUrl: './buriram.page.html',
  styleUrls: ['./buriram.page.scss'],
})
export class BuriramPage implements OnInit {

  public userInfo: any;
  public endPoint: any = environment.pointWeb;
  private ngUnsubscribe = new Subject();
  public buriram: any;
  constructor(
    private TrBuriramService:  TrBuriramService
  ) { }

  ngOnInit() {
    // this.getBuriram();
  }

  ionViewWillEnter(){
    this.getBuriram();
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.getBuriram();
      event.target.complete();
    }, 1000);
  };

  async getUserInfo(){
    const {value} = await Preferences.get({ key: 'userInfo' });
    const userInfo = JSON.parse(value!);
    this.userInfo = userInfo;
    // console.log( this.userInfo);
  };

  getBuriram(){
    this.TrBuriramService.findAll().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        this.buriram = result.serviceResult.value[0];
        console.log(this.buriram);
        console.log(this.buriram.tr_file[0]);


        // this.mockplaceList = result.serviceResult.value;
      }
    }, err => {
      console.error(err);
    });
  }

}
