import { Cliente } from './cliente.model';

export interface Retirada {
  id: number;
  cliente: Cliente;
  dataRetirada: string;
}

export interface RetiradaRequest {
  codigo?: string;
  nome?: string;
  rg?: string;
  moradorRua?: string;
  descricao?: string;
}

export interface RetiradaResponse {
  mensagem: string;
  id_retirada?: number;
  nome_cliente?: string;
  codigo_cliente?: number;
  data_retirada?: string;
  id_morador?: number;
  nome_morador?: string;
  erro?: string;
}

export interface MoradorRua {
  id: number;
  nome: string;
  rg?: string;
  descricao?: string;
  dataRetirada: string;
  dataRegistro: string;
}

export interface RelatorioDiario {
  data: string;
  total_clientes: number;
  total_moradores_rua: number;
  total_geral: number;
}

export interface ProducaoDiaria {
  data: string;
  quantidade_produzida: number;
  total_entregue: number;
  saldo_restante: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  role: string;
}
