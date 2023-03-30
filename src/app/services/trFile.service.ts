import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrFileService {

  constructor(private httpClient: HttpClient) { }

  public uploadFile(data: any, ref_id: any, module_name: any, updateBy:any) {
    const params = '?ref_id=' +ref_id+ '&module_name=' +module_name+ '&updateBy=' +updateBy;
    return this.httpClient.post<any>((environment.endPointWeb + 'tr_file/uploadFile' + params), data).pipe(map(respons => {
        return {
            serviceResult: respons
        }
      }));
  }

  public updateFile(data: any) {
    return this.httpClient.post<any>((environment.endPointWeb + 'tr_file/updateFile'), data).pipe(map(respons => {
        return {
            serviceResult: respons
        }
      }));
  }

  public findAll() {
    return this.httpClient.get<any>(environment.endPointWeb + 'tr_file/findAll').pipe(map(respons => {
        return {
            serviceResult: respons
        }
      }));
  }

  public findById(member_id: any) {
    const params = '?member_id=' + member_id;
    return this.httpClient.get<any>(environment.endPointWeb + 'tr_file/findById' + params).pipe(map(respons => {
        return {
            serviceResult: respons
        }
      }));
  }

  public testuploadFile(data: any) {
    return this.httpClient.post<any>((environment.endPointWeb + 'tr_file/testuploadFile'), data).pipe(map(respons => {
        return {
            serviceResult: respons
        }
      }));
  }

}
