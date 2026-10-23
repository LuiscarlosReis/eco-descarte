import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  PontoColeta,
  PontoColetaRequest
} from '../../models/ponto-coleta.model';

@Injectable({
  providedIn: 'root'
})
export class PontoColetaService {
  private readonly apiUrl = `${environment.apiUrl}/pontos-coleta`;

  constructor(private http: HttpClient) {}

  listar(): Observable<PontoColeta[]> {
    return this.http.get<PontoColeta[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<PontoColeta> {
    return this.http.get<PontoColeta>(`${this.apiUrl}/${id}`);
  }

  criar(dados: PontoColetaRequest): Observable<PontoColeta> {
    return this.http.post<PontoColeta>(this.apiUrl, dados);
  }

  atualizar(
    id: number,
    dados: PontoColetaRequest
  ): Observable<PontoColeta> {
    return this.http.put<PontoColeta>(
      `${this.apiUrl}/${id}`,
      dados
    );
  }

  excluir(id: number): Observable<{ mensagem: string }> {
    return this.http.delete<{ mensagem: string }>(
      `${this.apiUrl}/${id}`
    );
  }
}