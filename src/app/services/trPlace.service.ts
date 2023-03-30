import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrPlaceService {

  constructor(private httpClient: HttpClient) { }

  public createORupdate(data: any) {
    return this.httpClient.post<any>((environment.endPointWeb + 'tr_place/createORupdate'), data).pipe(map(respons => {
        return {
            serviceResult: respons
        }
      }));
  }

  public findAll() {
    return this.httpClient.get<any>(environment.endPointWeb + 'tr_place/findAll').pipe(map(respons => {
        return {
            serviceResult: respons
        }
      }));
  }

  public findDistrict() {
    return this.httpClient.get<any>(environment.endPointWeb + 'tr_district/findAll').pipe(map(respons => {
        return {
            serviceResult: respons
        }
      }));
  }

  public findPlaceJionTourism(tm_id: any, district: any) {
    const param = '?tm_id=' + tm_id + '&district_id=' + district;
    return this.httpClient.get<any>(environment.endPointWeb + 'tr_place/findPlaceJionTourism'+ param).pipe(map(respons => {
        return {
            serviceResult: respons
        }
      }));
  }

  public findPlaceDetail(place_id: any) {
    const param = '?place_id=' + place_id;
    return this.httpClient.get<any>(environment.endPointWeb + 'tr_place/findPlaceDetail'+ param).pipe(map(respons => {
        return {
            serviceResult: respons
        }
      }));
  }

  public findPlaceInApp(search: any) {
    return this.httpClient.get<any>((environment.endPointWeb + 'tr_place/findPlaceInApp'),{
      params: {
        text: search.text,
        location: search.location,
        main: search.main,
        sub: search.sub
      }
    }).pipe(map(respons => {
        return {
            serviceResult: respons
        }
      }));
  }

  public findPlaceRecommend(id: any) {
    const param = '?member_id=' + id;
    return this.httpClient.get<any>(environment.endPointWeb + 'tr_place/findPlaceRecommend'+ param).pipe(map(respons => {
        return {
            serviceResult: respons
        }
      }));
  }

}
