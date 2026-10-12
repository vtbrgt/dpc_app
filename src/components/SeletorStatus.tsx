import { Select, Tag } from 'antd';
import { COR_STATUS, STATUS_OPCOES, type StatusTarefa } from '../types/tarefa';

interface Props {
  valor: StatusTarefa;
  rotulo: string;
  onChange: (novo: StatusTarefa) => void;
}

const opcoes = STATUS_OPCOES.map((op) => ({
  value: op.valor,
  label: (
    <Tag color={COR_STATUS[op.valor]} style={{ marginInlineEnd: 0 }}>
      {op.rotulo}
    </Tag>
  ),
}));

export function SeletorStatus({ valor, rotulo, onChange }: Props) {
  return (
    <Select<StatusTarefa>
      value={valor}
      options={opcoes}
      onChange={onChange}
      aria-label={rotulo}
      style={{ width: 150 }}
    />
  );
}
