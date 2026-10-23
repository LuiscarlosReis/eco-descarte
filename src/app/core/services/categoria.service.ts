import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  Categoria,
  CategoriaRequest
} from '../../models/categoria.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private readonly apiUrl = `${environment.apiUrl}/categorias`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/${id}`);
  }

  criar(dados: CategoriaRequest): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, dados);
  }

  atualizar(
    id: number,
    dados: CategoriaRequest
  ): Observable<Categoria> {
    return this.http.put<Categoria>(
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