import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Alert, App as AntApp, Button, Flex, Input, Layout, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { FiltroStatus, type Filtro } from './components/FiltroStatus';
import {
  FormularioTarefa,
  type DadosFormulario,
} from './components/FormularioTarefa';
import { ModalExclusao } from './components/ModalExclusao';
import { TabelaTarefas } from './components/TabelaTarefas';
import { useTarefas } from './hooks/useTarefas';
import type { StatusTarefa, Tarefa } from './types/tarefa';
import { normalizarTexto } from './utils/normalizarTexto';

const LARGURA_MAXIMA = 1040;

export default function App() {
  const { message } = AntApp.useApp();
  const {
    tarefas,
    carregando,
    erro,
    recarregar,
    criar,
    atualizar,
    mudarStatus,
    remover,
  } = useTarefas();

  const [filtro, setFiltro] = useState<Filtro>('Todas');
  const [busca, setBusca] = useState('');

  const [formulario, setFormulario] = useState<{
    aberto: boolean;
    tarefa: Tarefa | null;
    chave: number;
  }>({ aberto: false, tarefa: null, chave: 0 });

  const [exclusao, setExclusao] = useState<{
    aberta: boolean;
    tarefa: Tarefa | null;
  }>({ aberta: false, tarefa: null });

  // Filtro de texto
  const correspondentes = useMemo(() => {
    const termo = normalizarTexto(busca.trim());
    if (!termo) return tarefas;
    return tarefas.filter((t) =>
      normalizarTexto(`${t.titulo} ${t.descricao ?? ''}`).includes(termo),
    );
  }, [tarefas, busca]);

  // Filtro de status
  const visiveis = useMemo(
    () =>
      filtro === 'Todas'
        ? correspondentes
        : correspondentes.filter((t) => t.status === filtro),
    [correspondentes, filtro],
  );

  function abrirFormulario(tarefa: Tarefa | null) {
    setFormulario((f) => ({ aberto: true, tarefa, chave: f.chave + 1 }));
  }

  async function salvar(dados: DadosFormulario) {
    const titulo = dados.titulo.trim();
    const descricao = dados.descricao.trim() || null;

    if (formulario.tarefa) {
      await atualizar(formulario.tarefa.id, { titulo, descricao, status: dados.status });
      message.success('Tarefa atualizada.');
    } else {
      await criar({ titulo, descricao });
      message.success('Tarefa criada.');
    }
  }

  async function alterarStatus(tarefa: Tarefa, novo: StatusTarefa) {
    if (await mudarStatus(tarefa.id, novo)) {
      message.success('Status atualizado.');
    }
  }

  async function confirmarExclusao() {
    const tarefa = exclusao.tarefa;
    if (!tarefa) return;

    const excluida = await remover(tarefa.id);
    setExclusao((e) => ({ ...e, aberta: false }));
    if (excluida) message.success('Tarefa excluída.');
  }

  const textoVazio =
    erro && tarefas.length === 0
      ? 'Não foi possível carregar as tarefas.'
      : tarefas.length === 0
        ? 'Nenhuma tarefa cadastrada. Clique em Nova tarefa para criar a primeira.'
        : busca.trim()
          ? 'Nenhuma tarefa encontrada para a busca.'
          : 'Nenhuma tarefa com este status.';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Header style={{ height: 'auto', lineHeight: 1.4, padding: '16px 24px' }}>
        <div style={{ maxWidth: LARGURA_MAXIMA, margin: '0 auto' }}>
          <Typography.Title level={4} style={{ color: '#fff', margin: 0 }}>
            Gerenciador de tarefas
          </Typography.Title>
          <Typography.Text style={{ color: '#c5d2e3' }}>
            Cadastre, acompanhe e atualize o status das tarefas.
          </Typography.Text>
        </div>
      </Layout.Header>

      <Layout.Content
        style={{ width: '100%', maxWidth: LARGURA_MAXIMA, margin: '0 auto', padding: 24 }}
      >
        <Flex vertical gap={16}>
          <FiltroStatus tarefas={correspondentes} filtro={filtro} onChange={setFiltro} />

          {erro && (
            <Alert
              type="error"
              showIcon
              title={erro}
              action={
                <Button size="small" onClick={recarregar}>
                  Tentar novamente
                </Button>
              }
            />
          )}

          <Flex justify="space-between" align="center" gap={12} wrap>
            <Typography.Title level={5} style={{ margin: 0 }}>
              {visiveis.length === 1 ? '1 tarefa' : `${visiveis.length} tarefas`}
            </Typography.Title>
            <Flex gap={12} wrap>
              <Input
                allowClear
                prefix={<SearchOutlined />}
                placeholder="Buscar por título ou descrição"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                style={{ width: 280 }}
              />
              <Button type="primary" icon={<PlusOutlined />} onClick={() => abrirFormulario(null)}>
                Nova tarefa
              </Button>
            </Flex>
          </Flex>

          <TabelaTarefas
            tarefas={visiveis}
            carregando={carregando}
            textoVazio={textoVazio}
            onEditar={abrirFormulario}
            onExcluir={(tarefa) => setExclusao({ aberta: true, tarefa })}
            onMudarStatus={alterarStatus}
          />
        </Flex>
      </Layout.Content>

      <FormularioTarefa
        key={formulario.chave}
        aberto={formulario.aberto}
        tarefa={formulario.tarefa}
        onSalvar={salvar}
        onFechar={() => setFormulario((f) => ({ ...f, aberto: false }))}
      />

      <ModalExclusao
        aberto={exclusao.aberta}
        tarefa={exclusao.tarefa}
        onConfirmar={confirmarExclusao}
        onCancelar={() => setExclusao((e) => ({ ...e, aberta: false }))}
      />
    </Layout>
  );
}
