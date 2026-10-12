import { Badge, Segmented, Space, Typography } from 'antd';
import { COR_STATUS, type StatusTarefa, type Tarefa } from '../types/tarefa';

export type Filtro = 'Todas' | StatusTarefa;

const OPCOES: { valor: Filtro; rotulo: string; cor?: string }[] = [
  { valor: 'Todas', rotulo: 'Todas' },
  { valor: 'Pendente', rotulo: 'Pendentes', cor: COR_STATUS.Pendente },
  { valor: 'EmAndamento', rotulo: 'Em andamento', cor: COR_STATUS.EmAndamento },
  { valor: 'Concluida', rotulo: 'Concluídas', cor: COR_STATUS.Concluida },
];

interface Props {
  tarefas: Tarefa[];
  filtro: Filtro;
  onChange: (novo: Filtro) => void;
}

export function FiltroStatus({ tarefas, filtro, onChange }: Props) {
  const opcoes = OPCOES.map((op) => {
    const quantidade =
      op.valor === 'Todas'
        ? tarefas.length
        : tarefas.filter((t) => t.status === op.valor).length;

    return {
      value: op.valor,
      label: (
        <Space size={8}>
          {op.cor && <Badge color={op.cor} />}
          <span>{op.rotulo}</span>
          <Typography.Text strong>{quantidade}</Typography.Text>
        </Space>
      ),
    };
  });

  return (
    <Segmented<Filtro>
      block
      size="large"
      options={opcoes}
      value={filtro}
      onChange={onChange}
    />
  );
}
