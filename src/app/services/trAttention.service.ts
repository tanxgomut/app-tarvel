import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrAttentionService {

  constructor(private httpClient: HttpClient) { }

  public createORupdate(data: any) {
    return this.httpClient.post<any>((environment.endPointWeb + 'tr_attention/createORupdate'), data).pipe(map(respons => {
        return {
            serviceResult: respons
        }
      }));
  }

  public findAll() {
    return this.httpClient.get<any>(environment.endPointWeb + 'tr_attention/findAll').pipe(map(respons => {
        return {
            serviceResult: respons
        }
      }));
  }

  public findByPk(value: any) {
    const param = '?value=' + value;
    return this.httpClient.get<any>(environment.endPointWeb + 'tr_attention/findByPk' + param).pipe(map(respons => {
        return {
            serviceResult: respons
        }
      }));
  }

}
