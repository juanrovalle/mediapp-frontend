import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Speciality } from '../model/speciality';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SpecialityService extends GenericService<Speciality> {
  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/specialities`);
  }
}