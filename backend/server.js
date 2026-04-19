
// Importa o framework Express para criar o servidor web
const express = require('express');
// Importa o módulo de sistema de arquivos para ler e escrever arquivos
const fs = require('fs');
// Importa o middleware CORS para permitir requisições de outros domínios
const cors = require('cors');
// Cria uma instância do aplicativo Express
const app = express();
// Define a porta em que o servidor irá rodar
const PORT = process.env.PORT || 3000;



// Aplica o middleware CORS para todas as rotas
app.use(cors());
// Permite que o servidor entenda requisições com JSON no corpo
app.use(express.json());


// Caminho do arquivo onde os agendamentos são salvos
const FILE = './agendamentos.json';
// Caminho do arquivo onde os contatos são salvos
const CONTATOS_FILE = './contatos.json';


// Função para ler os agendamentos do arquivo JSON
function lerAgendamentos() {
  // Se o arquivo não existe, cria um novo arquivo com lista vazia
  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, JSON.stringify({ agendamentos: [] }, null, 2));
  }
  // Lê o conteúdo do arquivo
  const data = fs.readFileSync(FILE);
  // Retorna apenas a lista de agendamentos
  return JSON.parse(data).agendamentos;
}


// Função para salvar a lista de agendamentos no arquivo JSON
function salvarAgendamentos(lista) {
  fs.writeFileSync(FILE, JSON.stringify({ agendamentos: lista }, null, 2));
}


// Função para ler os contatos do arquivo JSON
function lerContatos() {
  if (!fs.existsSync(CONTATOS_FILE)) {
    fs.writeFileSync(CONTATOS_FILE, JSON.stringify({ contatos: [] }, null, 2));
  }
  const data = fs.readFileSync(CONTATOS_FILE);
  return JSON.parse(data).contatos;
}


// Função para salvar a lista de contatos no arquivo JSON
function salvarContatos(lista) {
  fs.writeFileSync(CONTATOS_FILE, JSON.stringify({ contatos: lista }, null, 2));
}


// Lista de especialidades médicas disponíveis
const ESPECIALIDADES = ['Cardiologia', 'Ortopedia', 'Pediatria'];
// Profissionais disponíveis para cada especialidade
const PROFISSIONAIS = {
  Cardiologia: ['Dr. Carlos'],
  Ortopedia: ['Dr. João'],
  Pediatria: ['Dra. Maria']
};


// Rota para obter a lista de especialidades
app.get('/especialidades', (req, res) => {
  res.json(ESPECIALIDADES);
});


// Rota para obter os profissionais de uma especialidade
app.get('/profissionais', (req, res) => {
  // Pega a especialidade informada na query string
  const esp = req.query.especialidade;
  // Retorna os profissionais da especialidade ou lista vazia
  res.json(PROFISSIONAIS[esp] || []);
});


// Rota para obter horários disponíveis de um profissional em uma data
app.get('/disponibilidades', (req, res) => {
  // Extrai profissional e data da query string
  const { profissional, data } = req.query;
  // Lista de todos os horários possíveis
  const todosHorarios = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00'];
  // Filtra agendamentos para o profissional e data informados
  const ags = lerAgendamentos().filter(a => a.profissional === profissional && a.data === data);
  // Pega os horários já ocupados
  const ocupados = ags.map(a => a.hora);
  // Filtra horários livres
  const livres = todosHorarios.filter(h => !ocupados.includes(h));
  // Retorna os horários livres
  res.json(livres);
});


// Rota para salvar dados do formulário de contato
app.post('/contato', (req, res) => {
  const lista = lerContatos();
  const novo = {
    id: lista.length ? lista[lista.length - 1].id + 1 : 1,
    nome: req.body.nome,
    email: req.body.email,
    cidade: req.body.cidade,
    estado: req.body.estado,
    data: new Date().toISOString().split('T')[0]
  };
  lista.push(novo);
  salvarContatos(lista);
  res.status(201).json(novo);
});


// Rota para criar um novo agendamento
app.post('/agendamentos', (req, res) => {
  // Lê a lista atual de agendamentos
  const lista = lerAgendamentos();
  // Cria um novo agendamento com id sequencial
  const novo = {
    id: lista.length ? lista[lista.length - 1].id + 1 : 1,
    ...req.body
  };
  // Adiciona o novo agendamento à lista
  lista.push(novo);
  // Salva a lista atualizada
  salvarAgendamentos(lista);
  // Retorna o novo agendamento criado
  res.status(201).json(novo);
});


// Rota para listar agendamentos, podendo filtrar por CPF
app.get('/agendamentos', (req, res) => {
  // Pega o CPF da query string, se houver
  const { cpf } = req.query;
  // Lê a lista de agendamentos
  const lista = lerAgendamentos();
  // Filtra por CPF se informado, senão retorna todos
  const filtrados = cpf ? lista.filter(a => a.cpf === cpf) : lista;
  // Retorna a lista filtrada
  res.json(filtrados);
});


// Rota para deletar um agendamento pelo id
app.delete('/agendamentos/:id', (req, res) => {
  // Pega o id do agendamento a ser removido
  const id = Number(req.params.id);
  // Lê a lista de agendamentos
  let lista = lerAgendamentos();
  // Guarda o tamanho antes da remoção
  const tamanhoAntes = lista.length;
  // Remove o agendamento com o id informado
  lista = lista.filter(a => a.id !== id);
  // Se não removeu nada, retorna erro 404
  if (lista.length === tamanhoAntes) {
    return res.status(404).json({ erro: 'Não encontrado' });
  }
  // Salva a lista atualizada
  salvarAgendamentos(lista);
  // Retorna status 204 (sem conteúdo)
  res.status(204).send();
});


// Inicia o servidor na porta definida e exibe mensagem no console
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
