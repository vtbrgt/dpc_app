import { Alert, Form, Input, Modal, Select } from 'antd';
import { useState } from 'react';
import { mensagemDeErro } from '../api/tarefasApi';
import { STATUS_OPCOES, type StatusTarefa, type Tarefa } from '../types/tarefa';

export interface DadosFormulario {
  titulo: string;
  descricao: string;
  status: StatusTarefa;
}

interface Props {
  aberto: boolean;
  tarefa: Tarefa | null;
  onSalvar: (dados: DadosFormulario) => Promise<void>;
  onFechar: () => void;
}

const MAX_TITULO = 150;
const MAX_DESCRICAO = 1000;

const opcoesStatus = STATUS_OPCOES.map((op) => ({
  value: op.valor,
  label: op.rotulo,
}));

export function FormularioTarefa({ aberto, tarefa, onSalvar, onFechar }: Props) {
  const [form] = Form.useForm<DadosFormulario>();
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const editando = tarefa !== null;

  async function aoEnviar(valores: DadosFormulario) {
    setEnviando(true);
    setErro(null);
    try {
      await onSalvar({
        titulo: valores.titulo,
        descricao: valores.descricao ?? '',
        status: valores.status ?? 'Pendente',
      });
      onFechar();
    } catch (e) {
      setErro(mensagemDeErro(e));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Modal
      open={aberto}
      title={editando ? 'Editar tarefa' : 'Nova tarefa'}
      okText={editando ? 'Salvar alterações' : 'Criar tarefa'}
      cancelText="Cancelar"
      confirmLoading={enviando}
      onOk={() => form.submit()}
      onCancel={onFechar}
      maskClosable={false}
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={aoEnviar}
        initialValues={{
          titulo: tarefa?.titulo,
          descricao: tarefa?.descricao ?? '',
          status: tarefa?.status ?? 'Pendente',
        }}
        style={{ marginTop: 16 }}
      >
        {erro && (
          <Alert type="error" showIcon title={erro} style={{ marginBottom: 16 }} />
        )}

        <Form.Item
          name="titulo"
          label="Título"
          rules={[
            { required: true, whitespace: true, message: 'Informe o título da tarefa.' },
            { max: MAX_TITULO, message: `Use no máximo ${MAX_TITULO} caracteres.` },
          ]}
        >
          <Input maxLength={MAX_TITULO} showCount autoFocus />
        </Form.Item>

        <Form.Item name="descricao" label="Descrição">
          <Input.TextArea rows={4} maxLength={MAX_DESCRICAO} showCount />
        </Form.Item>

        {editando && (
          <Form.Item name="status" label="Status">
            <Select options={opcoesStatus} />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}
