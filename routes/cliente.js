// Importa o Express e inicializa o roteador
const express = require('express');
const routes = express.Router();

// Conexão com o banco de dados
const db = require('../db/connect');

/**
 * GET / - Retorna todos os clientes cadastrados
 */
routes.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM cliente');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar clientes' });
  }
});

/**
 * POST / - Cadastra um novo cliente
 */
routes.post('/', async (req, res) => {
  const { nome, email, telefone, endereco, cidade, uf } = req.body;

  // Verifica se os dados obrigatórios foram preenchidos
  if (!nome || !email || !telefone || !endereco || !cidade || !uf) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
  }

  try {
    const sql = `
      INSERT INTO cliente (nome, email, telefone, endereco, cidade, uf)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`;
    const valores = [nome, email, telefone, endereco, cidade, uf];

    const result = await db.query(sql, valores);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar cliente' });
  }
});

/**
 * PUT /:id - Atualiza os dados de um cliente existente
 */
routes.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, email, telefone, endereco, cidade, uf } = req.body;

  if (!id) {
    return res.status(400).json({ mensagem: 'ID do cliente não informado' });
  }

  if (!nome || !email || !telefone || !endereco || !cidade || !uf) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
  }

  try {
    const sql = `
      UPDATE cliente
      SET nome = $1, email = $2, telefone = $3, endereco = $4, cidade = $5, uf = $6
      WHERE id = $7
      RETURNING *`;
    const valores = [nome, email, telefone, endereco, cidade, uf, id];

    const result = await db.query(sql, valores);

    if (result.rows.length === 0) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar cliente' });
  }
});

/**
 * DELETE /:id - Remove um cliente pelo ID
 */
routes.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ mensagem: 'ID do cliente não informado' });
  }

  try {
    const sql = `DELETE FROM cliente WHERE id = $1 RETURNING *`;
    const result = await db.query(sql, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado' });
    }

    res.status(200).json({ mensagem: `Cliente com ID ${id} removido com sucesso` });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao excluir cliente' });
  }
});

// Torna as rotas disponíveis para o restante da aplicação
module.exports = routes;
