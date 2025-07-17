const request = require('supertest');
const app = require('../app');
const prisma = require('../../prisma/client');

describe('POST /livros', () => {
  it('deve cadastrar um livro com sucesso', async () => {
    const response = await request(app)
      .post('/livros')
      .send({
        titulo: 'Livro Teste Jest',
        autores: ['Autor Jest'],
        editora: 'Editora Jest',
        preco: 100,
        tipo: 'IMPRESSO',
        frete: 10,
        estoque: 50
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('livro');
    expect(response.body.livro.titulo).toBe('Livro Teste Jest');
  });

  it('deve retornar erro se campos obrigatórios faltarem', async () => {
    const response = await request(app)
      .post('/livros')
      .send({ titulo: '', autores: [], editora: '', preco: null, tipo: '' });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('erro');
  });

  it('não deve permitir título vazio', async () => {
    const response = await request(app)
      .post('/livros')
      .send({
        titulo: '',
        autores: ['Autor Teste'],
        editora: 'Editora Teste',
        preco: 50,
        tipo: 'IMPRESSO',
        frete: 5,
        estoque: 10
      });

    expect(response.statusCode).toBe(400);
  });

  it('deve retornar erro se autores não for array', async () => {
    const response = await request(app)
      .post('/livros')
      .send({
        titulo: 'Livro Inválido',
        autores: 'Autor Único',
        editora: 'Editora Teste',
        preco: 70,
        tipo: 'IMPRESSO',
        frete: 10,
        estoque: 5
      });

    expect(response.statusCode).toBe(400);
  });

  it('deve permitir cadastrar livro com editora e autor já existentes', async () => {
    const response = await request(app)
      .post('/livros')
      .send({
        titulo: 'Livro Duplicado',
        autores: ['Autor Jest'],
        editora: 'Editora Jest',
        preco: 80,
        tipo: 'IMPRESSO',
        frete: 10,
        estoque: 5
      });

    expect(response.statusCode).toBe(201);
  });
});

describe('GET /livros', () => {
  it('deve retornar lista de livros', async () => {
    const response = await request(app).get('/livros');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('livros');
    expect(Array.isArray(response.body.livros)).toBe(true);
  });
});

describe('DELETE /livros/:id', () => {
  let livroCriado;
  let editora;
  let autor;

 beforeAll(async () => {
  await prisma.livroAutor.deleteMany();

  await prisma.livro.deleteMany();
  await prisma.autor.deleteMany();
  await prisma.editora.deleteMany();

  editora = await prisma.editora.upsert({
    where: { nome: 'Editora Teste Delete' },
    update: {},
    create: { nome: 'Editora Teste Delete' },
  });

  autor = await prisma.autor.upsert({
    where: { nome: 'Autor Teste Delete' },
    update: {},
    create: { nome: 'Autor Teste Delete' },
  });

  livroCriado = await prisma.livro.create({
    data: {
      titulo: 'Livro para deletar',
      preco: 50,
      tipo: 'IMPRESSO',
      frete: 10,
      estoque: 5,
      editoraId: editora.id,
      autores: {
        create: [{ autorId: autor.id }],
      },
    },
  });
});

  it('deve remover um livro existente', async () => {
    const response = await request(app).delete(`/livros/${livroCriado.id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('mensagem', 'Livro removido com sucesso!');
  });

  it('deve retornar erro ao tentar remover livro inexistente', async () => {
    const response = await request(app).delete(`/livros/999999`);
   expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('erro');
  });
});

describe('PUT /livros/:id', () => {
  let livroAtualizar;
  let editora;
  let autor;

  beforeAll(async () => {
    editora = await prisma.editora.upsert({
      where: { nome: 'Editora Atualizar' },
      update: {},
      create: { nome: 'Editora Atualizar' },
    });

    autor = await prisma.autor.upsert({
      where: { nome: 'Autor Atualizar' },
      update: {},
      create: { nome: 'Autor Atualizar' },
    });

    livroAtualizar = await prisma.livro.create({
      data: {
        titulo: 'Livro Atualizar',
        preco: 55,
        tipo: 'IMPRESSO',
        frete: 12,
        estoque: 8,
        editoraId: editora.id,
        autores: {
          create: [{ autorId: autor.id }],
        },
      },
    });
  });

  it('deve atualizar um livro com sucesso', async () => {
    const response = await request(app)
      .put(`/livros/${livroAtualizar.id}`)
      .send({
        titulo: 'Livro Atualizado',
        autores: ['Autor Atualizado'],
        editora: 'Editora Atualizada',
        preco: 90,
        tipo: 'ELETRONICO',
        tamanhoArquivo: 1.5,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.livro).toHaveProperty('titulo', 'Livro Atualizado');
    expect(response.body.livro.tipo).toBe('ELETRONICO');
  });

  it('deve retornar erro ao atualizar livro inexistente', async () => {
    const response = await request(app).put('/livros/999999').send({
      titulo: 'Livro Fantasma',
      autores: ['Autor Fantasma'],
      editora: 'Editora Fantasma',
      preco: 100,
      tipo: 'IMPRESSO',
      frete: 5,
      estoque: 10
    });

   expect(response.statusCode).toBe(404);
  });
});

