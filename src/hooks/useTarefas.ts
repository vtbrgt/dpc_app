import { useCallback, useEffect, useState } from 'react';
import { mensagemDeErro, tarefasApi } from '../api/tarefasApi';
import type {
  StatusTarefa,
  Tarefa,
  TarefaInput,
  TarefaUpdateInput,
} from '../types/tarefa';

export function useTarefas() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

const carregarTarefas = useCallback(async () => {
    try {
      setCarregando(true);
      const dados = await tarefasApi.listar();
      setTarefas(dados);
      setErro(null);
    } catch (e) {
      setErro(mensagemDeErro(e));
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarTarefas();
  }, [carregarTarefas]);

  async function criar(dados: TarefaInput) {
    await tarefasApi.criar(dados);
    await carregarTarefas();
  }

  async function atualizar(id: number, dados: TarefaUpdateInput) {
    await tarefasApi.atualizar(id, dados);
    await carregarTarefas();
  }

  async function executarComAlerta(acao: () => Promise<unknown>): Promise<boolean> {
    try {
      await acao();
      await carregarTarefas();
      return true;
    } catch (e) {
      setErro(mensagemDeErro(e));
      return false;
    }
  }

  const mudarStatus = (id: number, status: StatusTarefa) =>
    executarComAlerta(() => tarefasApi.atualizarStatus(id, status));

  const remover = (id: number) =>
    executarComAlerta(() => tarefasApi.remover(id));

  return {
    tarefas,
    carregando,
    erro,
    recarregar: carregarTarefas,
    criar,
    atualizar,
    mudarStatus,
    remover,
  };
}
