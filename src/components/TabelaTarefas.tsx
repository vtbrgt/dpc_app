import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {
  Button,
  Empty,
  Space,
  Table,
  Typography,
  theme,
  type TableProps,
} from 'antd';
import type { StatusTarefa, Tarefa } from '../types/tarefa';
import { formatarDataHora } from '../utils/formatarData';
import { SeletorStatus } from './SeletorStatus';

interface Props {
  tarefas: Tarefa[];
  carregando: boolean;
  textoVazio: string;
  onEditar: (tarefa: Tarefa) => void;
  onExcluir: (tarefa: Tarefa) => void;
  onMudarStatus: (tarefa: Tarefa, novo: StatusTarefa) => void;
}

export function TabelaTarefas({
  tarefas,
  carregando,
  textoVazio,
  onEditar,
  onExcluir,
  onMudarStatus,
}: Props) {
  const { token } = theme.useToken();

  const colunas: TableProps<Tarefa>['columns'] = [
    {
      title: 'Tarefa',
      key: 'tarefa',
      render: (_, t) => (
        <>
          <Typography.Text strong>{t.titulo}</Typography.Text>
          {t.descricao && (
            <Typography.Paragraph
              type="secondary"
              ellipsis={{ rows: 2, tooltip: t.descricao }}
              style={{ margin: 0, maxWidth: 520 }}
            >
              {t.descricao}
            </Typography.Paragraph>
          )}
        </>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: 180,
      render: (_, t) => (
        <SeletorStatus
          valor={t.status}
          rotulo={`Status da tarefa ${t.titulo}`}
          onChange={(novo) => onMudarStatus(t, novo)}
        />
      ),
    },
    {
      title: 'Criada em',
      dataIndex: 'criadaEm',
      key: 'criadaEm',
      width: 150,
      render: (valor: string) => (
        <Typography.Text type="secondary">{formatarDataHora(valor)}</Typography.Text>
      ),
    },
    {
      title: 'Ações',
      key: 'acoes',
      width: 190,
      align: 'right',
      render: (_, t) => (
        <Space size={4}>
          <Button type="link" icon={<EditOutlined />} onClick={() => onEditar(t)}>
            Editar
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onExcluir(t)}
          >
            Excluir
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        background: token.colorBgContainer,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadius,
        overflow: 'hidden',
      }}
    >
      <Table<Tarefa>
        rowKey="id"
        columns={colunas}
        dataSource={tarefas}
        loading={carregando}
        scroll={{ x: 720 }}
        pagination={{ pageSize: 8, hideOnSinglePage: true, showSizeChanger: false }}
        locale={{
          emptyText: (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={textoVazio} />
          ),
        }}
      />
    </div>
  );
}
