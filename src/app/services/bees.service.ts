import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Bee } from '../models/bee.model';

@Injectable({
  providedIn: 'root',
})
export class BeesService {
  private http = inject(HttpClient);

  getBees(): Observable<Bee[]> {
    return this.http.get<Bee[]>('data/bees.json');
  }
}
