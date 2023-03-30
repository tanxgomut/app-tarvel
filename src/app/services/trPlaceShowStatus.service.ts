import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrPlaceShowStatusService {

  constructor(private httpClient: HttpClient) { }

  public createORupdate(data: any) {
    return this.httpClient.post<any>((environment.endPointWeb + 'tr_place_show_status/createORupdate'), data).pipe(map(respons => {
        return {
            serviceResult: respons
        }
      }));
  }

  public findAll() {
    return this.httpClient.get<any>(environment.endPointWeb + 'tr_place_show_status/findAll').pipe(map(respons => {
        return {
            serviceResult: respons
        }
      }));
  }

  public findShowStatus() {
    return this.httpClient.get<any>(environment.endPointWeb + 'tr_place_show_status/findShowStatus').pipe(map(respons => {
        return {
            serviceResult: respons
        }
      }));
  }

  public findPlaceShowInApp(page: any) {
    const params = "?page=" + page;
    return this.httpClient.get<any>(environment.endPointWeb + 'tr_place_show_status/findPlaceShowInApp' + params).pipe(map(respons => {
        return {
            serviceResult: respons
        }
      }));
  }

  public findPlaceShowById(pss_id: any) {
    const params = "?pss_id=" + pss_id;
    return this.httpClient.get<any>(environment.endPointWeb + 'tr_place_show_status/findPlaceShowById' + params).pipe(map(respons => {
        return {
            serviceResult: respons
        }
      }));
  }

}
