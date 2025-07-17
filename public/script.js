document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('livro-form');
  const tabela = document.getElementById('livros-tabela');
  const alertContainer = document.getElementById('alert-container');

  function mostrarAlerta(mensagem, tipo = 'success') {
    alertContainer.innerHTML = `
      <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
        ${mensagem}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
      </div>
    `;
  }

  function adicionarLinhaNaTabela(livro) {
    const autoresNomes = livro.autores ? livro.autores.join(', ') : 'Autores não disponíveis';
    const editoraNome = livro.editora || 'Editora não disponível';
    const precoFormatado = livro.preco ? livro.preco.toFixed(2) : '0.00';
    const tipoLivro = livro.tipo || 'Tipo não informado';

    const linha = document.createElement('tr');
    linha.innerHTML = `
      <td>${livro.titulo || 'Título não informado'}</td>
      <td>${autoresNomes}</td>
      <td>${editoraNome}</td>
      <td>R$ ${precoFormatado}</td>
      <td>${tipoLivro}</td>
    `;
    tabela.appendChild(linha);
  }

  async function carregarLivros() {
    try {
      const res = await fetch('/livros');
      const data = await res.json();
      if (data.livros && Array.isArray(data.livros)) {
        data.livros.forEach(adicionarLinhaNaTabela);
      }
    } catch {
      mostrarAlerta('Erro ao carregar lista de livros', 'danger');
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const titulo = document.getElementById('titulo').value;
    const autoresTexto = document.getElementById('autores').value;
    const editora = document.getElementById('editora').value;
    const preco = parseFloat(document.getElementById('preco').value);
    const tipo = document.getElementById('tipo').value;
    const frete = document.getElementById('frete').value ? parseFloat(document.getElementById('frete').value) : null;
    const estoque = document.getElementById('estoque').value ? parseInt(document.getElementById('estoque').value) : null;
    const tamanhoArquivo = document.getElementById('tamanhoArquivo').value ? parseFloat(document.getElementById('tamanhoArquivo').value) : null;

    const autores = autoresTexto.split(',').map(a => a.trim()).filter(a => a.length > 0);

    const data = { titulo, autores, editora, preco, tipo, frete, estoque, tamanhoArquivo };

    try {
      const response = await fetch('/livros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const err = await response.json();
        mostrarAlerta('Erro: ' + (err.erro || 'Não foi possível cadastrar o livro'), 'danger');
        return;
      }

      const livroCadastrado = await response.json();
      adicionarLinhaNaTabela(livroCadastrado.livro);
      mostrarAlerta('Livro cadastrado com sucesso!');
      form.reset();
    } catch (error) {
      mostrarAlerta('Erro ao cadastrar livro: ' + error.message, 'danger');
    }
  });

  carregarLivros();
});
