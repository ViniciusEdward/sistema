export type ClienteStatus = 'ATIVO' | 'INATIVO' | 'INADIMPLENTE';
export type MensalidadeStatus = 'PENDENTE' | 'PAGO' | 'ATRASADO' | 'CANCELADO';
export type FormaPagamento = 'PIX' | 'DINHEIRO' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO' | 'BOLETO' | 'TRANSFERENCIA' | 'OUTRO';

export type Usuario = {
  id: number;
  nome?: string;
  email: string;
};

export type Cliente = {
  id: number;
  nome: string;
  telefone: string | null;
  diaPagamento: number;
  valor: string | number;
  status: ClienteStatus;
  observacoes: string | null;
  dataCadastro: string;
  createdAt: string;
  updatedAt: string;
};

export type Mensalidade = {
  id: number;
  clienteId: number;
  competencia: string;
  vencimento: string;
  valor: string | number;
  status: MensalidadeStatus;
  pagoEm: string | null;
  formaPagamento: FormaPagamento | null;
  observacoes: string | null;
  cliente?: Cliente;
};

export type Pagamento = {
  id: number;
  mensalidadeId: number;
  clienteId: number;
  valor: string | number;
  pagoEm: string;
  formaPagamento: FormaPagamento;
  observacao: string | null;
  cliente: Cliente;
  mensalidade: Mensalidade;
};

export type ApiListResponse<T> = {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  perPage: number;
};

export type ApiDataResponse<T> = {
  success: boolean;
  data: T;
};

export type DashboardData = {
  receitaMes: number;
  lucro: number;
  clientesAtivos: number;
  clientesInadimplentes: number;
  cobrancasHoje: number;
  cobrancasAtrasadas: number;
  ultimosPagamentos: Pagamento[];
  graficoMensal: Array<{
    mes: string;
    receita: number;
    despesas: number;
    lucro: number;
  }>;
};
