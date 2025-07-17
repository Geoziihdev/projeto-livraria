-- CreateEnum
CREATE TYPE "TipoLivro" AS ENUM ('IMPRESSO', 'ELETRONICO');

-- CreateTable
CREATE TABLE "Livro" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "tipo" "TipoLivro" NOT NULL,
    "frete" DOUBLE PRECISION,
    "estoque" INTEGER,
    "tamanhoArquivo" DOUBLE PRECISION,
    "editoraId" INTEGER NOT NULL,

    CONSTRAINT "Livro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Editora" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Editora_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Autor" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Autor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LivroAutor" (
    "id" SERIAL NOT NULL,
    "livroId" INTEGER NOT NULL,
    "autorId" INTEGER NOT NULL,

    CONSTRAINT "LivroAutor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Editora_nome_key" ON "Editora"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Autor_nome_key" ON "Autor"("nome");

-- AddForeignKey
ALTER TABLE "Livro" ADD CONSTRAINT "Livro_editoraId_fkey" FOREIGN KEY ("editoraId") REFERENCES "Editora"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LivroAutor" ADD CONSTRAINT "LivroAutor_livroId_fkey" FOREIGN KEY ("livroId") REFERENCES "Livro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LivroAutor" ADD CONSTRAINT "LivroAutor_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "Autor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
