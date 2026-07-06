import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProducaoDiaria } from '../models/retirada.model';

@Injectable({
  providedIn: 'root',
})
export class ProducaoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/producao`;

  getProducaoDoDia(data?: string): Observable<ProducaoDiaria> {
    let params = new HttpParams();
    if (data) {
      params = params.set('data', data);
    }
    return this.http.get<ProducaoDiaria>(`${this.apiUrl}/dia`, { params });
  }

  registrarProducao(quantidade: number, data?: string): Observable<ProducaoDiaria> {
    const body: { quantidade: number; data?: string } = { quantidade };
    if (data) {
      body.data = data;
    }
    return this.http.post<ProducaoDiaria>(`${this.apiUrl}/registrar`, body);
  }
}
