class Livro {
    constructor(titulo, autor, anoPublicacao, isbn) {
      this.titulo = titulo;
      this.autor = autor;
      this.anoPublicacao = anoPublicacao;
      this.isbn = isbn;
      this.disponivel = true;  
    }
  
    emprestar() {
      if (this.disponivel) {
        this.disponivel = false;
        return true;
      } else {
        return false;
      }
    }
  
    devolver() {
      this.disponivel = true;
    }
  }
  
  module.exports = Livro;
  