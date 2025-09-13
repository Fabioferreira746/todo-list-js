const lista = document.getElementById('lista');

function salvarTarefas() {
  const tarefas = [];
  lista.querySelectorAll('li').forEach(li => {
    const texto = li.querySelector('span').textContent;
    const concluida = li.classList.contains('concluida');
    tarefas.push({ texto, concluida });
  });
  localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function carregarTarefas() {
  const tarefasSalvas = JSON.parse(localStorage.getItem('tarefas')) || [];
  tarefasSalvas.forEach(tarefa => {
    criarTarefa(tarefa.texto, tarefa.concluida);
  });
}

function adicionar() {
  const inputTarefa = document.getElementById('texto');
  const texto = inputTarefa.value.trim();

  if (texto === '') {
    alert('Digite uma tarefa.');
  } else {
    criarTarefa(texto, false);
    inputTarefa.value = '';
    salvarTarefas();
  }
}

function criarTarefa(texto, concluida) {
  const li = document.createElement('li');
  if (concluida) li.classList.add('concluida');

  li.innerHTML = `
    <span>${texto}</span>
    <div class="botoes">
      <button onclick="editar(this)">✏️</button>
      <button onclick="excluirTarefa(this)">🗑️</button>
    </div>
  `;

  li.querySelector('span').addEventListener('click', () => {
    li.classList.toggle('concluida');
    salvarTarefas();
  });

  lista.appendChild(li);
}

function excluir() {
  if (confirm("Tem certeza que deseja excluir todas as tarefas?")) {
    lista.innerHTML = '';
    localStorage.removeItem('tarefas');
  }
}

function excluirTarefa(botao) {
  botao.parentElement.parentElement.remove();
  salvarTarefas();
}

function editar(botao) {
  const li = botao.parentElement.parentElement;
  const span = li.querySelector('span');
  const textoAtual = span.textContent;

  const input = document.createElement('input');
  input.type = 'text';
  input.value = textoAtual;

  li.insertBefore(input, span);
  li.removeChild(span);

  botao.textContent = "💾";
  botao.onclick = function () {
    const novoTexto = input.value.trim();
    if (novoTexto === '') {
      alert('A tarefa não pode ficar vazia.');
      return;
    }

    const novoSpan = document.createElement('span');
    novoSpan.textContent = novoTexto;

    novoSpan.addEventListener('click', () => {
      li.classList.toggle('concluida');
      salvarTarefas();
    });

    li.insertBefore(novoSpan, input);
    li.removeChild(input);

    botao.textContent = '✏️';
    botao.onclick = function () {
      editar(botao);
    };

    salvarTarefas();
  };
}

document.getElementById('texto').addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    adicionar();
  }
});

window.addEventListener('load', carregarTarefas);
