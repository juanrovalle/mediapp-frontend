import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Speciality } from '../model/speciality';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpecialityService extends GenericService<Speciality> {
  private speciality: Subject<Speciality[]> = new Subject<Speciality[]>();
  private messageChange: Subject<string> = new Subject<string>();
  private patients: Speciality[] = [];

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/specialities`);
  }
  public getSpecialtyChange() {
    return this.speciality
.asObservable();
  }
  public setSpecialtyChange(data: Speciality[]) {
    this.speciality
.next(data);
  }

  public getMessagehange() {
    return this.messageChange.asObservable();
  }
  public setMessageChange(data: string) {
    this.messageChange.next(data);
  }
}
