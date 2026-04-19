
// URL base da API backend
const API_URL = 'https://matheus-antonio-marques-da-silva-projeto.onrender.com';



// Carrega as especialidades médicas do backend e preenche o select
async function carregarEspecialidades() {
  // Faz requisição para obter especialidades
  const res = await fetch(`${API_URL}/especialidades`);
  const dados = await res.json();
  // Seleciona o elemento select de especialidades
  const select = document.getElementById('especialidade');
  select.innerHTML = '';
  // Adiciona cada especialidade como opção
  dados.forEach(e => {
    const opt = document.createElement('option');
    opt.value = e;
    opt.textContent = e;
    select.appendChild(opt);
  });
}


// Carrega os profissionais da especialidade selecionada e preenche o select
async function carregarProfissionais() {
  // Pega a especialidade selecionada
  const esp = document.getElementById('especialidade').value;
  // Faz requisição para obter profissionais
  const res = await fetch(`${API_URL}/profissionais?especialidade=${encodeURIComponent(esp)}`);
  const dados = await res.json();
  // Seleciona o elemento select de profissionais
  const select = document.getElementById('profissional');
  select.innerHTML = '';
  // Adiciona cada profissional como opção
  dados.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p;
    opt.textContent = p;
    select.appendChild(opt);
  });
}


// Carrega os horários disponíveis para o profissional e data selecionados
async function carregarHorarios() {
  // Pega o profissional e a data selecionados
  const prof = document.getElementById('profissional').value;
  const data = document.getElementById('data').value;
  // Faz requisição para obter horários disponíveis
  const res = await fetch(`${API_URL}/disponibilidades?profissional=${encodeURIComponent(prof)}&data=${data}`);
  const dados = await res.json();
  // Seleciona o elemento select de horários
  const select = document.getElementById('hora');
  select.innerHTML = '';
  // Adiciona cada horário como opção
  dados.forEach(h => {
    const opt = document.createElement('option');
    opt.value = h;
    opt.textContent = h;
    select.appendChild(opt);
  });
}


// Envia os dados do formulário para agendar uma consulta/exame
async function agendar() {
  // Monta o corpo da requisição com os dados do formulário
  const body = {
    nome: document.getElementById('nome').value,
    cpf: document.getElementById('cpf').value,
    especialidade: document.getElementById('especialidade').value,
    profissional: document.getElementById('profissional').value,
    data: document.getElementById('data').value,
    hora: document.getElementById('hora').value
  };

  // Faz requisição POST para criar o agendamento
  const res = await fetch(`${API_URL}/agendamentos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  // Exibe mensagem de sucesso ou erro
  if (res.ok) {
    alert('Agendado com sucesso!');
  } else {
    alert('Erro ao agendar');
  }
}


// Busca agendamentos pelo CPF informado e exibe na tela
async function buscarPorCpf() {
  // Pega o CPF digitado
  const cpf = document.getElementById('cpf-busca').value;
  // Faz requisição para buscar agendamentos desse CPF
  const res = await fetch(`${API_URL}/agendamentos?cpf=${cpf}`);
  const dados = await res.json();
  // Seleciona o div onde os resultados serão exibidos
  const div = document.getElementById('resultado-agendamentos');
  div.innerHTML = '';

  // Se não encontrou nenhum agendamento
  if (dados.length === 0) {
    div.textContent = 'Nenhum agendamento encontrado.';
    return;
  }

  // Para cada agendamento encontrado, cria um elemento na tela
  dados.forEach(ag => {
    const item = document.createElement('div');
    item.textContent = `${ag.data} ${ag.hora} - ${ag.especialidade} com ${ag.profissional}`;
    // Cria botão para cancelar o agendamento
    const btn = document.createElement('button');
    btn.textContent = 'Cancelar';
    btn.onclick = () => cancelar(ag.id);
    item.appendChild(btn);
    div.appendChild(item);
  });
}


// Cancela um agendamento pelo id e atualiza a lista
async function cancelar(id) {
  // Faz requisição DELETE para cancelar o agendamento
  const res = await fetch(`${API_URL}/agendamentos/${id}`, { method: 'DELETE' });
  if (res.ok) {
    alert('Agendamento cancelado');
    buscarPorCpf(); // Atualiza a lista após cancelar
  } else {
    alert('Erro ao cancelar');
  }
}


// Quando a página carrega, inicializa os selects e eventos dos botões
document.addEventListener('DOMContentLoaded', () => {
  // Carrega especialidades e, em seguida, profissionais
  carregarEspecialidades().then(carregarProfissionais);
  // Atualiza profissionais ao trocar especialidade
  document.getElementById('especialidade').addEventListener('change', carregarProfissionais);
  // Atualiza horários ao trocar profissional
  document.getElementById('profissional').addEventListener('change', carregarHorarios);
  // Atualiza horários ao trocar data
  document.getElementById('data').addEventListener('change', carregarHorarios);
  // Evento do botão de agendar
  document.getElementById('btn-agendar').addEventListener('click', agendar);
  // Evento do botão de buscar por CPF
  document.getElementById('btn-buscar').addEventListener('click', buscarPorCpf);
  // Evento do formulário de contato
  document.getElementById('form-contato').addEventListener('submit', enviarContato);
});


// Envia os dados do formulário de contato para o backend
async function enviarContato(e) {
  e.preventDefault();
  const body = {
    nome: document.getElementById('contato-nome').value,
    email: document.getElementById('contato-email').value,
    cidade: document.getElementById('contato-cidade').value,
    estado: document.getElementById('contato-estado').value
  };

  const res = await fetch(`${API_URL}/contato`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (res.ok) {
    alert('Mensagem enviada com sucesso!');
    document.getElementById('form-contato').reset();
  } else {
    alert('Erro ao enviar mensagem');
  }
}
