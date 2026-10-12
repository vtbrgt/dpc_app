export type StatusTarefa = 'Pendente' | 'EmAndamento' | 'Concluida';

export const STATUS_OPCOES: { valor: StatusTarefa; rotulo: string }[] = [
  { valor: 'Pendente', rotulo: 'Pendente' },
  { valor: 'EmAndamento', rotulo: 'Em andamento' },
  { valor: 'Concluida', rotulo: 'Concluída' },
];

export const COR_STATUS: Record<StatusTarefa, string> = {
  Pendente: 'gold',
  EmAndamento: 'blue',
  Concluida: 'green',
};

export interface Tarefa {
  id: number;
  titulo: string;
  descricao: string | null;
  status: StatusTarefa;
  criadaEm: string;
  atualizadaEm: string | null;
}

export interface TarefaInput {
  titulo: string;
  descricao: string | null;
}

export interface TarefaUpdateInput extends TarefaInput {
  status: StatusTarefa;
}
