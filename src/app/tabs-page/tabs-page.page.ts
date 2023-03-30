import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs-page',
  templateUrl: './tabs-page.page.html',
  styleUrls: ['./tabs-page.page.scss'],
})
export class TabsPagePage implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }

  gotoProfile(){
    this.router.navigate(['profile']);
  }

  placeRecommend(){
    this.router.navigate(['place-recommend']);
  }

}
