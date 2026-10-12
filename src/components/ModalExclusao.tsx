import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal, Space, Typography, theme } from 'antd';
import { useState } from 'react';
import type { Tarefa } from '../types/tarefa';

interface Props {
  aberto: boolean;
  tarefa: Tarefa | null;
  onConfirmar: () => Promise<void>;
  onCancelar: () => void;
}

export function ModalExclusao({ aberto, tarefa, onConfirmar, onCancelar }: Props) {
  const { token } = theme.useToken();
  const [excluindo, setExcluindo] = useState(false);

  async function confirmar() {
    setExcluindo(true);
    try {
      await onConfirmar();
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <Modal
      open={aberto}
      centered
      width={440}
      title={
        <Space>
          <ExclamationCircleFilled style={{ color: token.colorError }} />
          Excluir tarefa
        </Space>
      }
      okText="Excluir"
      cancelText="Cancelar"
      okButtonProps={{ danger: true }}
      cancelButtonProps={{ disabled: excluindo }}
      confirmLoading={excluindo}
      onOk={confirmar}
      onCancel={onCancelar}
    >
      <Typography.Paragraph style={{ marginBottom: 0 }}>
        Você vai excluir a tarefa <Typography.Text strong>{tarefa?.titulo}</Typography.Text>.
        Esta ação não pode ser desfeita.
      </Typography.Paragraph>
    </Modal>
  );
}
