export interface Responsavel {
  id: number;
  nome: string;
  email: string | null;
}

export interface ResponsavelRequest {
  nome: string;
  email?: string | null;
}