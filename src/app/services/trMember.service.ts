import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrMemberService {

  constructor(private httpClient: HttpClient) { }

  public createORupdate(data: any) {
    return this.httpClient.post<any>((environment.endPointWeb + 'tr_member/createORupdate'), data).pipe(map(respons => {
        return {
            serviceResult: respons
        }
      }));
  }

  public updatePassword(data: any) {
    return this.httpClient.post<any>((environment.endPointWeb + 'tr_member/updatePassword'), data).pipe(map(respons => {
        return {
            serviceResult: respons
        }
      }));
  }

  public findAll() {
    return this.httpClient.get<any>(environment.endPointWeb + 'tr_member/findAll').pipe(map(respons => {
        return {
            serviceResult: respons
        }
      }));
  }

  public webSignIn(data: any) {
    const params = '?username=' + data.username + '&password=' + data.password ;
    return this.httpClient.get<any>(environment.endPointWeb + 'tr_member/webSignIn' + params).pipe(map(respons => {
        return {
            serviceResult: respons
        }
      }));
  }

  public appSignIn(data: any) {
    const params = '?email=' + data.email + '&password=' + data.password ;
    return this.httpClient.get<any>(environment.endPointWeb + 'tr_member/appSignIn' + params).pipe(map(respons => {
        return {
            serviceResult: respons
        }
      }));
  }

  public checkEmailMember(email: any){
    const params = '?email=' + email ;
    return this.httpClient.get<any>(environment.endPointWeb + 'tr_member/checkEmailMember' + params).pipe(map(respons => {
        return {
            serviceResult: respons
        }
      }));
  }

}
