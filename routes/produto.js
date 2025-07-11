// Importa o Express e inicializa o roteador
const express = require('express');
const routes = express.Router();

// Conexão com o banco de dados
const db = require('../db/connect');

/**
 * GET / - Retorna todos os produtos cadastrados
 */
routes.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM produto');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar produtos' });
  }
});

/**
 * POST / - Cadastra um novo produto
 */
routes.post('/', async (req, res) => {
  const { nome, marca, preco, peso } = req.body;

  // Validação dos campos obrigatórios
  if (!nome || !marca || preco == null || peso == null) {
    return res.status(400).json({
      mensagem: 'Todos os campos são obrigatórios: nome, marca, preco, peso'
    });
  }

  try {
    const sql = `
      INSERT INTO produto (nome, marca, preco, peso)
      VALUES ($1, $2, $3, $4)
      RETURNING *`;
    const valores = [nome, marca, preco, peso];

    const result = await db.query(sql, valores);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar produto' });
  }
});

/**
 * PUT /:id - Atualiza os dados de um produto existente
 */
routes.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, marca, preco, peso } = req.body;

  if (!id) {
    return res.status(400).json({ mensagem: 'ID do produto não informado' });
  }

  if (!nome || !marca || preco == null || peso == null) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
  }

  try {
    const sql = `
      UPDATE produto
      SET nome = $1, marca = $2, preco = $3, peso = $4
      WHERE id = $5
      RETURNING *`;
    const valores = [nome, marca, preco, peso, id];

    const result = await db.query(sql, valores);

    if (result.rows.length === 0) {
      return res.status(404).json({ mensagem: 'Produto não encontrado' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar produto' });
  }
});

/**
 * DELETE /:id - Remove um produto pelo ID
 */
routes.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ mensagem: 'ID do produto não informado' });
  }

  try {
    const sql = `DELETE FROM produto WHERE id = $1 RETURNING *`;
    const result = await db.query(sql, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ mensagem: 'Produto não encontrado' });
    }

    res.status(200).json({ mensagem: `Produto com ID ${id} removido com sucesso` });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao excluir produto' });
  }
});

// Torna as rotas disponíveis para o restante da aplicação
module.exports = routes;
