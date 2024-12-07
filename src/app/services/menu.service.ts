import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { GenericService } from './generic.service';
import { Menu } from '../model/menu';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService extends GenericService<Menu> {
  
  private menuChange = new Subject<Menu[]>();

  constructor(httpClient: HttpClient) {
    super(httpClient, `${environment.HOST}/menus`);
  }

  getMenusByUser(username: string) {
    return this.http.post<Menu[]>(`${this.url}/user`, username);
  }

  public getMenuChange() {
    return this.menuChange.asObservable();
  }
  public setMenuChange(data: Menu[]) {
    this.menuChange.next(data);
  }
}
