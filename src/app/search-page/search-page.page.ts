import { TrPlaceService } from './../services/trPlace.service';
import { TrSubTourismModelService } from './../services/trSubTourismModel.service';
import { TrTourismModelService } from './../services/trTourismModel.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AnyARecord } from 'dns';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.page.html',
  styleUrls: ['./search-page.page.scss'],
})
export class SearchPagePage implements OnInit {

  public userInfo: any;
  public endPoint: any = environment.pointWeb;
  private ngUnsubscribe = new Subject();
  public mainList: any;
  public subList : any;
  public districtList: any;
  public keyword: any;
  public mainSearch: any;
  public subSearch: any;
  public location = '';
  public itemColor = [
    {bg: '#A3DDA3', color: '#27A426'},{bg: '#D4B6E9', color: '#5E1594'},{bg: '#F59DDE', color: '#DC2CAC'},
  ]
  constructor(
    private router: Router,
    private trTourismModelService: TrTourismModelService,
    private trSubTourismModelService: TrSubTourismModelService,
    private trPlaceService: TrPlaceService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getMainTourism();
    this.getSubTourism();
    this.getDistrict();
  }

  setKeyword(id : any){
    for(let main of this.mainList){
      if(main.tm_id === id){ main.check = !main.check; }
    }
  }

  setSubKeyword(id : any){
    for(let sub of this.subList){
      if(sub.stm_id === id){ sub.check = !sub.check; }
    }
  }

  selectChange(e: any){
    this.location = e.detail.value;
    console.log( this.location);

  }

  getMainTourism(){
    this.trTourismModelService.findAll().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        this.mainList = result.serviceResult.value;
        let i = 0;
        for(let main of this.mainList){
          main.check = false;
          main.bg = this.itemColor[i].bg;
          main.color = this.itemColor[i].color;
          i = i + 1;
          if(i === 3){ i = 0; }
        }
        // console.log(this.mainList);
      }
    }, err => {
      console.error(err);
    });
  }

  getSubTourism(){
    this.trSubTourismModelService.findAll().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        this.subList = result.serviceResult.value;
        for(let sub of this.subList){
          sub.check = false;
        }
        console.log(this.subList);
      }
    }, err => {
      console.error(err);
    });
  }

  getDistrict(){
    this.trPlaceService.findDistrict().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        this.districtList = result.serviceResult.value;
        console.log(this.districtList);
      }
    }, err => {
      console.error(err);
    });
  }

  gotoSearch(){
    const mainArr = [];
    const subArr = [];
    for(let main of this.mainList){
      if(main.check === true){ mainArr.push(main.tm_id); }
    }
    this.mainSearch = mainArr.map((e) => e).join(",");

    for(let sub of this.subList){
      if(sub.check === true){ subArr.push(sub.stm_id); }
    }
    this.subSearch = subArr.map((e) => e).join(",");

    this.router.navigate(['/place'], {queryParams: {text: this.keyword, location: this.location ,main: this.mainSearch, sub: this.subSearch}});
    this.keyword = '';
    this.location = '';
  }

}
