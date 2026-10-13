import axios, { AxiosError } from 'axios';
import type {
  StatusTarefa,
  Tarefa,
  TarefaInput,
  TarefaUpdateInput,
} from '../types/tarefa';

const BASE_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function mensagemDeErro(erro: unknown): string {
  return erro instanceof ApiError ? erro.message : 'Ocorreu um erro inesperado.';
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ errors?: Record<string, string[]>; detail?: string; title?: string }>) => {
    if (!error.response) {
      throw new ApiError('Não foi possível conectar à API. Tente novamente.', 0);
    }

    const { status, data } = error.response;
    let mensagem = `A API respondeu com erro ${status}.`;

    if (data) {
      if (data.errors) {
        mensagem = Object.values(data.errors).flat().join(' ');
      } else {
        mensagem = data.detail ?? data.title ?? mensagem;
      }
    }

    throw new ApiError(mensagem, status);
  }
);

export const tarefasApi = {
  listar: async (): Promise<Tarefa[]> => {
    const { data } = await api.get<Tarefa[]>('/api/tarefas');
    return data;
  },

  criar: async (dados: TarefaInput): Promise<Tarefa> => {
    const { data } = await api.post<Tarefa>('/api/tarefas', dados);
    return data;
  },

  atualizar: async (id: number, dados: TarefaUpdateInput): Promise<Tarefa> => {
    const { data } = await api.put<Tarefa>(`/api/tarefas/${id}`, dados);
    return data;
  },

  atualizarStatus: async (id: number, status: StatusTarefa): Promise<Tarefa> => {
    const { data } = await api.patch<Tarefa>(`/api/tarefas/${id}/status`, { status });
    return data;
  },

  remover: async (id: number): Promise<void> => {
    await api.delete(`/api/tarefas/${id}`);
  },
};