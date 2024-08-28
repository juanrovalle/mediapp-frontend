import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GenericService<T> {

  constructor(
    protected http: HttpClient,
    @Inject('url') protected url: string
  ) { }

  findAll() {
    return this.http.get<T[]>(this.url);
  }
  findById(id: number) {
    return this.http.get<T>(`${this.url}/${id}`);
  }

  save(T: T) {
    return this.http.post<T>(this.url, T);
  }

  update(id: number, T: T) {
    return this.http.put<T>(`${this.url}/${id}`, T);
  }

  delete(id: number) {
   return this.http.delete<T>(`${this.url}/${id}`);
  }
}
