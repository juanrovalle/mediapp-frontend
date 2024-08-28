import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Medic } from '../model/medic';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MedicService extends GenericService<Medic> {
  private MedicChange: Subject<Medic[]> = new Subject<Medic[]>();
  private messageChange: Subject<string> = new Subject<string>();
  
  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/medics`);
  }

  public getMedicChange() {
    return this.MedicChange.asObservable();
  }
  public setMedicChange(data: Medic[]) {
    this.MedicChange.next(data);
  }
  public getMessagehange() {
    return this.messageChange.asObservable();
  }
  public setMessageChange(data: string) {
    this.messageChange.next(data);
  }
}
