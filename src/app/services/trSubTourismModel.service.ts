import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrSubTourismModelService {

  constructor(private httpClient: HttpClient) { }

  public createORupdate(data: any) {
    return this.httpClient.post<any>((environment.endPointWeb + 'tr_sub_tourism_model/createORupdate'), data).pipe(map(respons => {
        return {
            serviceResult: respons
        }
      }));
  }

  public findAll() {
    return this.httpClient.get<any>(environment.endPointWeb + 'tr_sub_tourism_model/findAll').pipe(map(respons => {
        return {
            serviceResult: respons
        }
      }));
  }

  public findAllSubMain() {
    return this.httpClient.get<any>(environment.endPointWeb + 'tr_sub_tourism_model/findAllSubMain').pipe(map(respons => {
        return {
            serviceResult: respons
        }
      }));
  }

}
