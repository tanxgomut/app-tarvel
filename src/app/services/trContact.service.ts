import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrContactService {

  constructor(private httpClient: HttpClient) { }

  public createORupdate(data: any) {
    return this.httpClient.post<any>((environment.endPointWeb + 'tr_contact/createORupdate'), data).pipe(map(respons => {
        return {
            serviceResult: respons
        }
      }));
  }

  public findAll() {
    return this.httpClient.get<any>(environment.endPointWeb + 'tr_contact/findAll').pipe(map(respons => {
        return {
            serviceResult: respons
        }
      }));
  }

}
