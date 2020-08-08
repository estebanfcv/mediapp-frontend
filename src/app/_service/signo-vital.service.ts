import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { SignoVital } from './../_model/signoVital';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignoVitalService extends GenericService<SignoVital>{

  signoVitalCambio = new Subject<SignoVital[]>();
  mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) {
    super(
      http,
      `${environment.HOST}/signosvitales`
    );
  }

  listarPageable(p: number, s: number) {
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }
}
