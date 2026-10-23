import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  Responsavel,
  ResponsavelRequest
} from '../../models/responsavel.model';

@Injectable({
  providedIn: 'root'
})
export class ResponsavelService {
  private readonly apiUrl = `${environment.apiUrl}/responsaveis`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Responsavel[]> {
    return this.http.get<Responsavel[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Responsavel> {
    return this.http.get<Responsavel>(`${this.apiUrl}/${id}`);
  }

  criar(dados: ResponsavelRequest): Observable<Responsavel> {
    return this.http.post<Responsavel>(this.apiUrl, dados);
  }

  atualizar(
    id: number,
    dados: ResponsavelRequest
  ): Observable<Responsavel> {
    return this.http.put<Responsavel>(
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