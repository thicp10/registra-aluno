import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Retirada,
  RetiradaRequest,
  RetiradaResponse,
  MoradorRua,
  RelatorioDiario,
} from '../models/retirada.model';

@Injectable({
  providedIn: 'root',
})
export class RetiradaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/retiradas`;

  registrarRetirada(request: RetiradaRequest): Observable<RetiradaResponse> {
    return this.http.post<RetiradaResponse>(`${this.apiUrl}/registrar`, request);
  }

  listarTodas(): Observable<Retirada[]> {
    return this.http.get<Retirada[]>(this.apiUrl);
  }

  listarPorCliente(clienteId: number): Observable<Retirada[]> {
    return this.http.get<Retirada[]>(`${this.apiUrl}/cliente/${clienteId}`);
  }

  listarPorPeriodo(dataInicio: string, dataFim: string): Observable<Retirada[]> {
    return this.http.get<Retirada[]>(`${this.apiUrl}/periodo`, {
      params: new HttpParams().set('dataInicio', dataInicio).set('dataFim', dataFim),
    });
  }

  listarMoradoresRua(): Observable<MoradorRua[]> {
    return this.http.get<MoradorRua[]>(`${this.apiUrl}/moradores-rua`);
  }

  listarMoradoresRuaPorNome(nome: string): Observable<MoradorRua[]> {
    return this.http.get<MoradorRua[]>(`${this.apiUrl}/moradores-rua/buscar/nome`, {
      params: new HttpParams().set('nome', nome),
    });
  }

  getEstatisticas(): Observable<{ total_retiradas: number; total_moradores_rua: number }> {
    return this.http.get<{ total_retiradas: number; total_moradores_rua: number }>(
      `${this.apiUrl}/total`
    );
  }

  getRelatorioDiario(data?: string): Observable<RelatorioDiario> {
    let params = new HttpParams();
    if (data) {
      params = params.set('data', data);
    }
    return this.http.get<RelatorioDiario>(`${this.apiUrl}/relatorio-diario`, { params });
  }

  exportarExcel(dataInicio?: string, dataFim?: string): Observable<Blob> {
    let params = new HttpParams();
    if (dataInicio && dataFim) {
      params = params.set('dataInicio', dataInicio).set('dataFim', dataFim);
    }
    return this.http.get(`${this.apiUrl}/exportar/excel`, {
      params,
      responseType: 'blob',
    });
  }

  exportarRelatorioDiarioExcel(data?: string): Observable<Blob> {
    let params = new HttpParams();
    if (data) {
      params = params.set('data', data);
    }
    return this.http.get(`${this.apiUrl}/exportar/relatorio-diario/excel`, {
      params,
      responseType: 'blob',
    });
  }
}
