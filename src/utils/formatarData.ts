export function formatarDataHora(iso: string): string {
  const semFracao = iso.replace(/(\.\d{3})\d+/, '$1');
  const temFuso = /(Z|[+-]\d{2}:\d{2})$/.test(semFracao);
  const data = new Date(temFuso ? semFracao : `${semFracao}Z`);

  return data.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}
