export interface PontoColeta {
  id: number;
  nome: string;
  endereco: string | null;
}

export interface PontoColetaRequest {
  nome: string;
  endereco?: string | null;
}