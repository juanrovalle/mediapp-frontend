import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Patient } from '../model/patient';
import { Subject } from 'rxjs';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root',
})
export class PatientService extends GenericService<Patient> {
  private patientChange: Subject<Patient[]> = new Subject<Patient[]>();
  private messageChange: Subject<string> = new Subject<string>();
  private patients: Patient[] = [];

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/patients`);
  }
  listPageable(page: Number, s: Number) {
    return this.http.get<any>(`${this.url}/pageable?page=${page}&size=${s}`);
  }

  public getPatientChange() {
    return this.patientChange.asObservable();
  }
  public setPatientChange(data: Patient[]) {
    this.patientChange.next(data);
  }
  public getMessagehange() {
    return this.messageChange.asObservable();
  }
  public setMessageChange(data: string) {
    this.messageChange.next(data);
  }

  // Refactored CRUD Operations
  /** 
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
    return this.http.delete<Patient>(`${this.url}/${id}`);
  }
    */
}
