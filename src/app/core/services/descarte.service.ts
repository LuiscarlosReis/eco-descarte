import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  Descarte,
  DescarteRequest
} from '../../models/descarte.model';

@Injectable({
  providedIn: 'root'
})
export class DescarteService {
  private readonly apiUrl = `${environment.apiUrl}/descartes`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Descarte[]> {
    return this.http.get<Descarte[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Descarte> {
    return this.http.get<Descarte>(`${this.apiUrl}/${id}`);
  }

  criar(dados: DescarteRequest): Observable<Descarte> {
    return this.http.post<Descarte>(this.apiUrl, dados);
  }

  atualizar(
    id: number,
    dados: Partial<DescarteRequest>
  ): Observable<Descarte> {
    return this.http.put<Descarte>(
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