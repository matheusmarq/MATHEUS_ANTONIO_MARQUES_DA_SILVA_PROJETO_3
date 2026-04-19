# Trabalho CEUB - Sistema de Agendamentos

Sistema de gerenciamento de agendamentos e contatos com backend Node.js e frontend simples.

## Pré-requisitos

- Node.js instalado (versão 14 ou superior)
- npm (gerenciador de pacotes do Node.js)

## Instalação

1. Navegue até a pasta do backend:
   ```bash
   cd backend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

## Executando o Projeto

1. Inicie o servidor backend:
   ```bash
   node server.js
   ```
   O servidor estará disponível em `http://localhost:3000`

2. Abra o arquivo `frontend/index.html` em seu navegador para acessar a interface do sistema.

## Estrutura do Projeto

```
├── backend/
│   ├── server.js        # Servidor Node.js com API REST
│   ├── agendamentos.json  # Dados dos agendamentos
│   ├── contatos.json      # Dados dos contatos
│   └── package.json       # Dependências do projeto
│
└── frontend/
    ├── index.html      # Interface do usuário
    ├── app.js          # Lógica do frontend
    └── style.css       # Estilos da aplicação
```

## API Endpoints

- `GET /agendamentos` - Lista todos os agendamentos
- `POST /agendamentos` - Cria um novo agendamento
- `PUT /agendamentos/:id` - Atualiza um agendamento
- `DELETE /agendamentos/:id` - Remove um agendamento
- `GET /contatos` - Lista todos os contatos
- `POST /contatos` - Cria um novo contato

## Tecnologias

- **Backend:** Node.js, Express, CORS
- **Frontend:** HTML, CSS, JavaScript (Vanilla)