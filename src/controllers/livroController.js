const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getLivros = async (req, res) => {
  try {
    const livrosRaw = await prisma.livro.findMany({
      include: {
        autores: { include: { autor: true } },
        editora: true
      }
    });
    
    const livros = livrosRaw.map(livro => ({
      id: livro.id,
      titulo: livro.titulo,
      preco: livro.preco,
      tipo: livro.tipo,
      frete: livro.frete,
      estoque: livro.estoque,
      tamanhoArquivo: livro.tamanhoArquivo,
      editora: livro.editora.nome,
      autores: livro.autores.map(a => a.autor.nome),
    }));

    res.json({ livros });
  } catch (error) {
    console.error("Erro ao buscar livros:", error);
    res.status(500).json({ erro: "Erro ao buscar livros." });
  }
};

exports.postLivro = async (req, res) => {
  const { titulo, autores, editora, preco, tipo, frete, estoque, tamanhoArquivo } = req.body;

  if (!titulo || !autores || !editora || !preco || !tipo) {
    return res.status(400).json({ erro: "Campos obrigatórios faltando." });
  }

  if (!Array.isArray(autores)) {
    return res.status(400).json({ erro: "`autores` deve ser um array de nomes." });
  }

  try {
    let editoraDb = await prisma.editora.findUnique({ where: { nome: editora } });
    if (!editoraDb) {
      editoraDb = await prisma.editora.create({ data: { nome: editora } });
    }
    
    const autoresConectados = [];
    for (const nomeAutor of autores) {
      let autorDb = await prisma.autor.findUnique({ where: { nome: nomeAutor } });
      if (!autorDb) {
        autorDb = await prisma.autor.create({ data: { nome: nomeAutor } });
      }
      autoresConectados.push({ autorId: autorDb.id });
    }

    const livroCriado = await prisma.livro.create({
      data: {
        titulo,
        preco: parseFloat(preco),
        tipo: tipo.toUpperCase(),
        frete: tipo.toUpperCase() === "IMPRESSO" ? parseFloat(frete) : null,
        estoque: tipo.toUpperCase() === "IMPRESSO" ? parseInt(estoque) : null,
        tamanhoArquivo: tipo.toUpperCase() === "ELETRONICO" ? parseFloat(tamanhoArquivo) : null,
        editoraId: editoraDb.id,
        autores: {
          create: autoresConectados.map(ac => ({
            autor: { connect: { id: ac.autorId } }
          }))
        }
      },
      include: {
        autores: { include: { autor: true } },
        editora: true
      }
    });

    console.log("Livro salvo com sucesso no banco:", livroCriado);

    res.status(201).json({
      mensagem: "Livro criado com sucesso!",
      livro: {
        id: livroCriado.id,
        titulo: livroCriado.titulo,
        preco: livroCriado.preco,
        tipo: livroCriado.tipo,
        frete: livroCriado.frete,
        estoque: livroCriado.estoque,
        tamanhoArquivo: livroCriado.tamanhoArquivo,
        editora: livroCriado.editora.nome,
        autores: livroCriado.autores.map(a => a.autor.nome),  
      }
    });

  } catch (error) {
    console.error("Erro ao cadastrar livro:", error);
    res.status(500).json({ erro: "Erro ao cadastrar livro.", detalhe: error.message });
  }
};
exports.deleteLivro = async (req, res) => {
  const { id } = req.params;

  try {
    const livroExistente = await prisma.livro.findUnique({
      where: { id: parseInt(id) },
    });

    if (!livroExistente) {
      return res.status(404).json({ erro: "Livro não encontrado." });
    }

    await prisma.livroAutor.deleteMany({
      where: { livroId: parseInt(id) },
    });

    await prisma.livro.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ mensagem: "Livro removido com sucesso!" });
  } catch (error) {
    console.error("Erro ao remover livro:", error);
    res.status(500).json({ erro: "Erro ao remover livro." });
  }
};
exports.updateLivro = async (req, res) => {
  const { id } = req.params;
  const { titulo, autores, editora, preco, tipo, frete, estoque, tamanhoArquivo } = req.body;

  try {
    const livroExistente = await prisma.livro.findUnique({
      where: { id: parseInt(id) },
    });

    if (!livroExistente) {
      return res.status(404).json({ erro: "Livro não encontrado." });
    }

    let editoraDb = await prisma.editora.findUnique({ where: { nome: editora } });
    if (!editoraDb) {
      editoraDb = await prisma.editora.create({ data: { nome: editora } });
    }

    const autoresConectados = [];
    for (const nomeAutor of autores) {
      let autorDb = await prisma.autor.findUnique({ where: { nome: nomeAutor } });
      if (!autorDb) {
        autorDb = await prisma.autor.create({ data: { nome: nomeAutor } });
      }
      autoresConectados.push({ autorId: autorDb.id });
    }

    await prisma.livroAutor.deleteMany({
      where: { livroId: parseInt(id) },
    });

    const livroAtualizado = await prisma.livro.update({
      where: { id: parseInt(id) },
      data: {
        titulo,
        preco: parseFloat(preco),
        tipo: tipo.toUpperCase(),
        frete: tipo.toUpperCase() === "IMPRESSO" ? parseFloat(frete) : null,
        estoque: tipo.toUpperCase() === "IMPRESSO" ? parseInt(estoque) : null,
        tamanhoArquivo: tipo.toUpperCase() === "ELETRONICO" ? parseFloat(tamanhoArquivo) : null,
        editoraId: editoraDb.id,
        autores: {
          create: autoresConectados.map(ac => ({
            autor: { connect: { id: ac.autorId } }
          }))
        }
      },
      include: {
        autores: { include: { autor: true } },
        editora: true
      }
    });

    res.status(200).json({
      mensagem: "Livro atualizado com sucesso!",
      livro: {
        id: livroAtualizado.id,
        titulo: livroAtualizado.titulo,
        preco: livroAtualizado.preco,
        tipo: livroAtualizado.tipo,
        frete: livroAtualizado.frete,
        estoque: livroAtualizado.estoque,
        tamanhoArquivo: livroAtualizado.tamanhoArquivo,
        editora: livroAtualizado.editora.nome,
        autores: livroAtualizado.autores.map(a => a.autor.nome),
      }
    });

  } catch (error) {
    console.error("Erro ao atualizar livro:", error);
    res.status(500).json({ erro: "Erro ao atualizar livro." });
  }
};
