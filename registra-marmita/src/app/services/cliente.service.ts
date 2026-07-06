import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cliente } from '../models/cliente.model';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/clientes`;

  findAll(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  findById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente);
  }

  update(id: number, cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/${id}`, cliente);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  findByNome(nome: string): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/buscar/nome`, {
      params: new HttpParams().set('nome', nome),
    });
  }

  findByRg(rg: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/buscar/rg`, {
      params: new HttpParams().set('rg', rg),
    });
  }

  findByRecebeu(recebeu: boolean): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/buscar/recebeu`, {
      params: new HttpParams().set('recebeu', String(recebeu)),
    });
  }

  findByDataBetween(dataInicio: string, dataFim: string): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/buscar/data`, {
      params: new HttpParams().set('dataInicio', dataInicio).set('dataFim', dataFim),
    });
  }

  getTotal(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/estatisticas/total`);
  }

  getReceberam(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/estatisticas/receberam`);
  }

  getNaoReceberam(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/estatisticas/nao-receberam`);
  }

  exportExcel(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/exportar/excel`, {
      responseType: 'blob',
    });
  }
}
