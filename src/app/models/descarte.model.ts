import { Categoria } from './categoria.model';
import { PontoColeta } from './ponto-coleta.model';
import { Responsavel } from './responsavel.model';

export interface Descarte {
  id: number;
  data_descarte: string;
  descricao_equipamento: string;
  categoria: Categoria;
  quantidade: number;
  unidade_medida: string;
  ponto_coleta: PontoColeta;
  responsavel: Responsavel;
  status_certificado: string;
  observacoes: string | null;
}

export interface DescarteRequest {
  data_descarte: string;
  descricao_equipamento: string;
  categoria_id: number;
  quantidade: number;
  unidade_medida: string;
  ponto_coleta_id: number;
  responsavel_id: number;
  status_certificado: string;
  observacoes?: string | null;
}