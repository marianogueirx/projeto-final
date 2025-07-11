/*
  Servidor back-end utilizando o módulo Express que cria uma API Rest e realiza
  as operações de CRUD, envolvendo os métodos HTTP (GET, POST, PUT e DELETE)
*/

// Importa o módulo Express para criação do servidor
const express = require('express');

// Inicializa a aplicação Express
const app = express();

// Carrega as variáveis de ambiente definidas no arquivo .env
require('dotenv').config();

// Define as configurações de host e porta a partir das variáveis de ambiente
const hostname = process.env.APP_HOST;
const port = process.env.APP_PORT;

// Importa o módulo de conexão com o banco de dados
const db = require('./db/connect');

// Habilita o middleware para tratar requisições com corpo em JSON
app.use(express.json());

// Importa os arquivos de rotas para as entidades cliente e produto
const clienteRotas = require('./routes/cliente');
const produtoRotas = require('./routes/produto');

// Define a rota raiz com uma mensagem explicando a funcionalidade da API
app.get('/', (req, res) => {
  res.status(200).send('Servidor API Rest que manipula as rotas /produto e /cliente/.');
});

// Registra as rotas específicas para clientes e produtos
app.use('/cliente', clienteRotas);
app.use('/produto', produtoRotas);

// Inicia o servidor e testa a conexão com o banco de dados
app.listen(port, hostname, async () => {
  try {
    await db.query('SELECT 1');
    console.log(`Servidor rodando em http://${hostname}:${port}/`);
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error.message);
  }
});
