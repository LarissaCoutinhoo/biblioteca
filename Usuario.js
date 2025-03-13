class Usuario {
    constructor(nome, email) {
      this.nome = nome;
      this.email = email;
      this.emprestimos = [];
    }
  
    realizarEmprestimo(livro) {
      if (livro.emprestar()) {
        const dataEmprestimo = new Date();
        this.emprestimos.push({ livro, dataEmprestimo });
        return true;
      }
      return false;
    }
  
    realizarDevolucao(livro) {
      const emprestimo = this.emprestimos.find(e => e.livro === livro);
      if (emprestimo) {
        livro.devolver();
        this.emprestimos = this.emprestimos.filter(e => e !== emprestimo);
        return true;
      }
      return false;
    }
  }
  
  module.exports = Usuario;
  