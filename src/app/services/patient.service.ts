import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Patient } from '../model/patient';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private url: string = `${environment.HOST}/patients`;
  patients: Patient[] = [];
  constructor(private http: HttpClient) {}
  findAll() {
    return this.http.get<Patient[]>(this.url);
  }
  findById(id: number) {
    return this.http.get<Patient>(`${this.url}/${id}`);
  }

  save(patient: Patient) {
    return this.http.post<Patient>(this.url, patient);
  }

  update(id: number, patient: Patient) {
    return this.http.put<Patient>(`${this.url}/${id}`, patient);
  }

  delete(id: number) {
    this.http.delete<Patient>(`${this.url}/${id}`);
  }
  
}
