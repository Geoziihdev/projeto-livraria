# Projeto Livraria

Projeto de API REST para gerenciamento de livros, criado para fins de aprendizado durante a mentoria **Programar com Você**.

---

## Tecnologias Utilizadas

- Node.js  
- Express  
- Jest (testes)  
- Supertest (testes de integração)  
- Prisma (ORM)  

---

## Estrutura do Projeto
├── coverage/ # Relatórios de cobertura de testes (ignorados pelo Git)

├── node_modules/ # Dependências instaladas

├── prisma/ # Configuração do Prisma

├── public/ # Arquivos estáticos (se houver)

├── src/


│ ├── controllers/ # Lógica dos controladores

│ ├── routes/ # Definição das rotas

│ ├── tests/ # Testes automatizados

│ ├── app.js # Configuração da aplicação Express

│ └── server.js # Ponto de entrada da aplicação

├── .env # Variáveis de ambiente

├── .gitignore # Arquivos e pastas ignorados pelo Git

├── package.json # Configurações e scripts do projeto

└── README.md # Esse arquivo

---

## ⚙️ Como Rodar o Projeto

```bash

1. Instale as dependências:

npm install

2. Rodar o servidor normalmente:

npm start

3. Rodar o servidor em modo desenvolvimento (com reinício automático ao salvar):

npm run dev

4. Rodar os testes automatizados:

npm test

O servidor irá rodar localmente em http://localhost:3000 (ou outra porta configurada).


