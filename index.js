const fs = require('fs');
const readlineSync = require('readline-sync');
const Livro = require('./Livro');
const Autor = require('./Autor');
const Usuario = require('./Usuario');

let livros = [];
let autores = [];
let usuarios = [];

function carregarDados() {
  try {
    const dados = JSON.parse(fs.readFileSync('dados.json', 'utf-8'));
    livros = dados.livros.map(livroData => {
      const autor = new Autor(livroData.autor.nome, livroData.autor.nacionalidade);
      const livro = new Livro(livroData.titulo, autor, livroData.anoPublicacao, livroData.isbn);
      livro.disponivel = livroData.disponivel;
      return livro;
    });

    autores = dados.autores.map(autorData => new Autor(autorData.nome, autorData.nacionalidade));
    usuarios = dados.usuarios.map(usuarioData => new Usuario(usuarioData.nome, usuarioData.email));

  } catch (err) {
    console.error('Erro ao carregar os dados:', err);
  }
}

function salvarDados() {
  const dados = {
    livros: livros.map(livro => ({
      titulo: livro.titulo,
      autor: { nome: livro.autor.nome, nacionalidade: livro.autor.nacionalidade },
      anoPublicacao: livro.anoPublicacao,
      isbn: livro.isbn,
      disponivel: livro.disponivel
    })),
    autores: autores.map(autor => ({
      nome: autor.nome,
      nacionalidade: autor.nacionalidade
    })),
    usuarios: usuarios.map(usuario => ({
      nome: usuario.nome,
      email: usuario.email
    }))
  };

  fs.writeFileSync('dados.json', JSON.stringify(dados, null, 2));
}


carregarDados();

function cadastrarLivro() {
  const titulo = readlineSync.question('Digite o título do livro: ');
  const nomeAutor = readlineSync.question('Digite o nome do autor: ');
  const anoPublicacao = readlineSync.questionInt('Digite o ano de publicação: ');
  const isbn = readlineSync.question('Digite o ISBN: ');

  let autor = autores.find(a => a.nome === nomeAutor);
  if (!autor) {
    autor = new Autor(nomeAutor, ''); 
    autores.push(autor);
  }

  const livro = new Livro(titulo, autor, anoPublicacao, isbn);
  livros.push(livro);

  salvarDados();

  console.log('Livro cadastrado com sucesso!');
}

function cadastrarAutor() {
  const nome = readlineSync.question('Digite o nome do autor: ');
  const nacionalidade = readlineSync.question('Digite a nacionalidade do autor: ');

  let autor = autores.find(a => a.nome === nome);
  if (autor) {
    autor.nacionalidade = nacionalidade;
    console.log(`Nacionalidade do autor ${nome} atualizada com sucesso!`);
  } else {
    autor = new Autor(nome, nacionalidade);
    autores.push(autor);
    console.log('Autor cadastrado com sucesso!');
  }

  salvarDados();
}

function cadastrarUsuario() {
  const nome = readlineSync.question('Digite o nome do usuário: ');
  const email = readlineSync.question('Digite o e-mail do usuário: ');
  const usuario = new Usuario(nome, email);
  usuarios.push(usuario);

  salvarDados();

  console.log('Usuário cadastrado com sucesso!');
}

function realizarEmprestimo() {
  const usuarioNome = readlineSync.question('Digite o nome do usuário: ');
  const usuario = usuarios.find(u => u.nome === usuarioNome);
  if (!usuario) {
    console.log('Usuário não encontrado!');
    return;
  }

  const tituloLivro = readlineSync.question('Digite o título do livro: ');
  const livro = livros.find(l => l.titulo === tituloLivro && l.disponivel);
  if (!livro) {
    console.log('Livro não disponível ou não encontrado!');
    return;
  }

  if (usuario.realizarEmprestimo(livro)) {
    console.log('Empréstimo realizado com sucesso!');
  } else {
    console.log('Erro ao realizar o empréstimo.');
  }

  salvarDados();
}

function realizarDevolucao() {
  const usuarioNome = readlineSync.question('Digite o nome do usuário: ');
  const usuario = usuarios.find(u => u.nome === usuarioNome);
  if (!usuario) {
    console.log('Usuário não encontrado!');
    return;
  }

  const tituloLivro = readlineSync.question('Digite o título do livro: ');
  const livro = livros.find(l => l.titulo === tituloLivro);
  if (!livro) {
    console.log('Livro não encontrado!');
    return;
  }

  if (usuario.realizarDevolucao(livro)) {
    salvarDados();
    console.log('Devolução realizada com sucesso!');
  } else {
    console.log('Erro ao realizar a devolução.');
  }
}

function consultarLivrosDisponiveis() {
  const livrosDisponiveis = livros.filter(l => l.disponivel);
  console.log('Livros disponíveis:');
  livrosDisponiveis.forEach(l => console.log(`${l.titulo} (${l.isbn})`));
}

function consultarLivrosEmprestados() {
  const livrosEmprestados = livros.filter(l => !l.disponivel);
  console.log('Livros emprestados:');
  livrosEmprestados.forEach(l => console.log(`${l.titulo} (${l.isbn})`));
}

function consultarEmprestimos() {
  usuarios.forEach(usuario => {
    console.log(`Empréstimos de ${usuario.nome}:`);
    usuario.emprestimos.forEach(e => {
      console.log(`- ${e.livro.titulo} (Emprestado em: ${e.dataEmprestimo.toLocaleDateString()})`);
    });
  });
}

function menu() {
  while (true) {
    console.log('\nMenu:');
    console.log('1. Cadastrar Livro');
    console.log('2. Cadastrar Autor');
    console.log('3. Cadastrar Usuário');
    console.log('4. Realizar Empréstimo');
    console.log('5. Realizar Devolução');
    console.log('6. Consultar Livros Disponíveis');
    console.log('7. Consultar Livros Emprestados');
    console.log('8. Consultar Empréstimos');
    console.log('9. Sair');

    const opcao = readlineSync.questionInt('Escolha uma opção: ');

    switch (opcao) {
      case 1:
        cadastrarLivro();
        break;
      case 2:
        cadastrarAutor();
        break;
      case 3:
        cadastrarUsuario();
        break;
      case 4:
        realizarEmprestimo();
        break;
      case 5:
        realizarDevolucao();
        break;
      case 6:
        consultarLivrosDisponiveis();
        break;
      case 7:
        consultarLivrosEmprestados();
        break;
      case 8:
        consultarEmprestimos();
        break;
      case 9:
        console.log('Saindo...');
        return;
      default:
        console.log('Opção inválida!');
    }
  }
}

menu();
