import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Exam } from '../model/exam';

@Injectable({
  providedIn: 'root',
})
export class ExamService extends GenericService<Exam> {
  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/exams`);
  }
}
