import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConsultListExamDTOI } from '../model/consultListExamDTO';
import { Consult } from '../model/consult';
import { FilterConsultDTO } from '../model/filterConsultDTO';

@Injectable({
  providedIn: 'root',
})
export class ConsultService {
  //Files, Image
  saveFile(data: FormData) {
    return this.http.post(`${this.url}/saveFile`, data);

    //this.http.post(`${this.url}/saveFile`, formData);
  }

  generateReport() {
    return this.http.get(`${this.url}/generateReport`, {
      responseType: 'blob',
    });
  }
  private url: string = `${environment.HOST}/consults`;

  constructor(private http: HttpClient) {}

  saveTransactional(dto: ConsultListExamDTOI) {
    console.log(dto);
    return this.http.post(this.url, dto);
  }
  searchByDates(date1: string, date2: string) {
    // const params: HttpParams = new HttpParams();
    // params.set('date1', date1);
    // params.set('date2', date2);

    // return this.http.get<Consult[]>(`${this.url}/search/dates`, {
    //   params: params,
    // });

    return this.http.get<Consult[]>(
      `${this.url}/search/dates?date1=${date1}&date2=${date2}`
    );
  }

  searchOthers(dto: FilterConsultDTO) {
    return this.http.post<Consult[]>(`${this.url}/search/others`, dto);
  }

  callProcedureOrFunction() {
    return this.http.get<any>(`${this.url}/callProcedureNative`);
  }
  readFile(id: number) {
    return this.http.get(`${this.url}/readFile/${id}`, {
      responseType: 'blob',
    });
  }
}
