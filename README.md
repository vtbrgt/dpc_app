# Gerenciador de Tarefas: Frontend

Sistema web de gerenciadomento de tarefas, desenvolvido em **React + TypeScript** como desafio técnico para a vaga de Desenvolvedor Full Stack. Ele consome uma API REST em .NET e permite cadastrar, buscar, filtrar, editar e excluir tarefas, além de acompanhar o status de cada uma.

## Sumário

1. [Visão geral](#1-visão-geral)
2. [Tecnologias utilizadas](#2-tecnologias-utilizadas)
3. [Como executar a aplicação](#3-como-executar-a-aplicação)
4. [Manual de usabilidade](#4-manual-de-usabilidade)
5. [Decisões técnicas](#5-decisões-técnicas)
6. [Aplicação publicada (deploy)](#6-aplicação-publicada-deploy)
7. [Como foi feito: dificuldades e facilidades](#7-como-foi-feito-dificuldades-e-facilidades)

## 1. Visão geral

O desafio consiste em uma aplicação de gerenciamento de tarefas, dividida em dois repositórios:

| Parte | Repositório | Publicação |
|---|---|---|
| **Frontend** (este repositório) | `https://github.com/vtbrgt/dpc_app/` | `https://dpc-app-seven.vercel.app/` |
| Backend (API em .NET) | `https://github.com/vtbrgt/dpc_api` | API: `https://dpc-api-jhrm.onrender.com` / Swagger: `https://dpc-api-jhrm.onrender.com/swagger/index.html` |

**Funcionalidades**

- Listagem de tarefas com título, descrição, status e data de criação.
- Cadastro, edição e exclusão de tarefas, com confirmação antes de excluir.
- Controle de status (`Pendente`, `Em andamento` e `Concluída`).
- Filtro por status, com a contagem de tarefas em cada situação.
- Busca por texto no título e na descrição, combinável com o filtro de status.
- Validação de formulário e mensagens de erro claras, inclusive quando a API está indisponível.

## 2. Tecnologias utilizadas

* React + TypeScript 
* Vite  
* Ant Design 
* @ant-design/icons  
* Axios  

## 3. Como executar a aplicação

### Pré-requisitos

- [Node.js](https://nodejs.org/)
- **A API do backend em execução** (veja o repositório do backend), seja localmente ou a versão publicada.

### 3.1 Instalar e executar

```bash
git clone https://github.com/vtbrgt/dpc_app.git
cd dpc_app
npm install
npm run dev
```

Abra no navegador o endereço exibido pelo Vite (por padrão, `http://localhost:5173`).

### 3.2 Endereço da API

Por padrão, o frontend chama a API em `http://localhost:8080`, que é a porta em que o backend sobe localmente.

Para usar outro endereço (outra porta ou a API publicada), crie um arquivo `.env` na raiz do projeto, com base no `.env.example`:

```
VITE_API_URL=https://endereco-da-api
```

Reinicie o `npm run dev` depois de alterar o arquivo.

## 4. Manual de usabilidade

A aplicação possui uma única tela, dividida em áreas.

### Faixa de filtros

No topo, quatro opções mostram **quantas tarefas existem em cada situação**: Todas, Pendentes, Em andamento e Concluídas (cada uma com sua cor). Ao clicar em uma delas, a lista abaixo exibe apenas as tarefas daquele status.

### Busca

O campo **Buscar por título ou descrição** filtra a lista enquanto você digita. A busca ignora maiúsculas e acentos ("relatorio" encontra "Relatório") e pode ser combinada com o filtro de status. As contagens da faixa de filtros passam a mostrar apenas as tarefas encontradas. O "x" do campo limpa a busca.

### Lista de tarefas

Cada linha apresenta o título, a descrição, o status, a data de criação e as ações disponíveis. Quando há mais de oito tarefas, a lista é paginada.

### Operações

| Operação | Como fazer |
|---|---|
| **Criar tarefa** | Clique em **Nova tarefa**, preencha o título (obrigatório, até 150 caracteres) e, opcionalmente, a descrição (até 1000 caracteres). Clique em **Criar tarefa**. A nova tarefa começa como *Pendente*. |
| **Editar tarefa** | Clique em **Editar** na linha desejada, altere título, descrição ou status e clique em **Salvar alterações**. |
| **Mudar o status** | Use o seletor colorido da coluna *Status*. A alteração é salva imediatamente. |
| **Excluir tarefa** | Clique em **Excluir**. Uma janela de confirmação mostra o título da tarefa; confirme em **Excluir** ou desista em **Cancelar**. A exclusão não pode ser desfeita. |

### Mensagens do sistema

- Mensagens rápidas no topo confirmam que a operação foi concluída ("Tarefa criada.", "Tarefa excluída.", etc.).
- Erros de validação (por exemplo, título em branco) aparecem dentro do formulário.
- Se a API estiver fora do ar, um alerta vermelho informa o problema e oferece o botão **Tentar novamente**.

## 5. Decisões técnicas

- **Separação de responsabilidades.** Somente a pasta `api/` faz requisições, o hook customizado `useTarefas` fica encarregado do estado e operações, e os componentes cuidam apenas da apresentação dos dados.
- **Axios com instância única e interceptor.** URL base e timeout ficam configurados em um só lugar, e qualquer falha de requisição chega ao restante da aplicação como um `ApiError` com mensagem pronta para exibir e também facilitando qualquer alteração da API.
- **Tratamento dos erros da API.** O frontend lê o o erro retornado pelo backend e mostra uma mensagem personalizada para o usuário.
- **Ant Design** componentes prontos para a interface corporativa solicitada.
- **Filtro e busca feitos no navegador.** A lista completa é carregada uma vez e filtrada localmente, o que mantém as contagens sempre corretas e evita uma requisição a cada tecla digitada. A busca ignora acentos e maiúsculas.
- **Modal de confirmação na exclusão**, mostrando o título da tarefa e para evitar exclusões acidentais.
- **Formulário recriado a cada abertura.** Cada abertura do modal começa com os campos limpos (ou com os dados da tarefa em edição).
- **Tratamento de datas.** A função utilitária `formatarData` faz com que as datas da API sejam exibidas no horário local do usuário.
- **Endereço da API por variável de ambiente** (`VITE_API_URL`), com padrão para o ambiente local, o que permite apontar para a API publicada sem alterar o código.

## 6. Aplicação publicada (deploy)

> A API está em um plano gratuito, que suspende o serviço quando ele fica sem uso. O **primeiro acesso** depois de um tempo parado pode demorar, e a lista pode levar alguns segundos para carregar.

## 7. Como foi feito: dificuldades e facilidades

**Ordem de desenvolvimento**

1. Definição da estrutura do projeto e dos tipos a partir dos DTOs da API.
2. Camada de comunicação com a API e hook de estado.
3. Tela de listagem, formulário de criação e edição, e troca de status.
4. Refinamento da interface com Ant Design, modal de exclusão e mensagens de retorno.
5. Busca por texto e preparação para o deploy.

**Facilidades**

- A familiaridade e experiência que possuo com React e TypeScript tornou o frontend a etapa mais fluida.
- Ter os tipos espelhando os DTOs do backend deixou a integração previsível e evitou erros de formato.
- Utilizar o Ant Design entrega componentes prontos de nível corporativo, o que facilitou no desenvolvimento da interface e manteve o visual consistente.

**Dificuldades**

- Ajustar a integração com a API em ambientes diferentes: a porta local da API e o CORS causaram erros que, no navegador, aparecem como "falha de CORS" mesmo quando o problema é a API estar em outra porta.
- Decidir onde filtrar e buscar (no navegador ou na API), equilibrando simplicidade e consistência das contagens.