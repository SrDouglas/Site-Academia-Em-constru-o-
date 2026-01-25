require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// =======================
// CONEXÃO COM MYSQL
// =======================
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('❌ Erro ao conectar no MySQL:', err);
    return;
  }
  console.log('✅ MySQL conectado com sucesso!');
});

// =======================
// ROTAS
// =======================

// Teste
app.get('/', (req, res) => {
  res.send('Backend da Academia rodando 🚀');
});

// Buscar alunos
app.get('/alunos', (req, res) => {
  db.query('SELECT * FROM alunos', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// =======================
// (AQUI ENTRA O PASSO 4)
// CADASTRO SEGURO (HASH)
// =======================
app.post('/auth/register', (req, res) => {
  const { nome, email, senha, tipo } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'nome, email e senha são obrigatórios' });
  }

  const tipoFinal = (tipo === 'admin') ? 'admin' : 'aluno';

  db.query('SELECT id FROM alunos WHERE email = ?', [email], async (err, rows) => {
    if (err) return res.status(500).json({ erro: 'Erro no servidor' });
    if (rows.length > 0) return res.status(409).json({ erro: 'Email já cadastrado' });

    const hash = await bcrypt.hash(senha, 10);

    db.query(
      'INSERT INTO alunos (nome, email, senha, tipo) VALUES (?, ?, ?, ?)',
      [nome, email, hash, tipoFinal],
      (err2, result) => {
        if (err2) return res.status(500).json({ erro: 'Erro ao cadastrar' });

        res.status(201).json({
          mensagem: 'Usuário cadastrado com sucesso',
          id: result.insertId,
          tipo: tipoFinal
        });
      }
    );
  });
});

// =======================
// LOGIN COM JWT (TOKEN)
// =======================
app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
  }

  db.query('SELECT * FROM alunos WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro no servidor' });
    if (results.length === 0) return res.status(401).json({ erro: 'Usuário não encontrado' });

    const usuario = results[0];

    const ok = await bcrypt.compare(senha, usuario.senha);
    if (!ok) return res.status(401).json({ erro: 'Senha inválida' });

    const token = jwt.sign(
      { id: usuario.id, tipo: usuario.tipo, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      mensagem: 'Login realizado com sucesso',
      token,
      usuario: { id: usuario.id, nome: usuario.nome, tipo: usuario.tipo }
    });
  });
});

function auth(req, res, next) {
  const header = req.headers.authorization; // "Bearer TOKEN"
  if (!header) return res.status(401).json({ erro: 'Token não enviado' });

  const [type, token] = header.split(' ');
  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ erro: 'Token inválido' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, tipo, email }
    next();
  } catch (e) {
    return res.status(401).json({ erro: 'Token expirado ou inválido' });
  }
}

function onlyAdmin(req, res, next) {
  if (req.user.tipo !== 'admin') {
    return res.status(403).json({ erro: 'Acesso negado: somente admin' });
  }
  next();
}


// BIOIMPEDÂNCIA - ADMIN (ainda sem proteção, a gente protege já já)
app.post('/admin/bioimpedancia', auth, onlyAdmin, (req, res) => {
  const {
    aluno_id,
    peso,
    altura,
    imc,
    percentual_gordura,
    massa_magra,
    massa_gorda,
    agua_corporal,
    taxa_metabolica_basal,
    data_medicao
  } = req.body;

  if (!aluno_id || !data_medicao) {
    return res.status(400).json({ erro: 'Aluno e data são obrigatórios' });
  }

  const sql = `
    INSERT INTO bioimpedancia (
      aluno_id, peso, altura, imc, percentual_gordura,
      massa_magra, massa_gorda, agua_corporal,
      taxa_metabolica_basal, data_medicao
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    aluno_id, peso, altura, imc, percentual_gordura,
    massa_magra, massa_gorda, agua_corporal,
    taxa_metabolica_basal, data_medicao
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao salvar bioimpedância' });
    }

    res.status(201).json({
      mensagem: 'Bioimpedância cadastrada com sucesso',
      id: result.insertId
    });
  });
});

// Teste bioimpedância
app.get('/admin/bioimpedancias', auth, onlyAdmin, (req, res) => {
  res.send('Rota de bioimpedância ativa 🚀');
});

// Listar bioimpedâncias
app.get('/admin/bioimpedancias', auth, onlyAdmin, (req, res) => {
  const { aluno_id } = req.query;

  let sql = `
    SELECT 
      b.id, b.aluno_id, b.peso, b.altura, b.imc,
      b.percentual_gordura, b.massa_magra, b.massa_gorda,
      b.agua_corporal, b.taxa_metabolica_basal, b.data_medicao,
      a.nome AS aluno_nome
    FROM bioimpedancia b
    JOIN alunos a ON a.id = b.aluno_id
  `;
  const params = [];

  if (aluno_id) {
    sql += ' WHERE b.aluno_id = ?';
    params.push(aluno_id);
  }

  sql += ' ORDER BY b.data_medicao DESC, b.id DESC';

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao buscar bioimpedâncias' });
    }
    res.json(results);
  });
});

// =======================
// SERVIDOR (SEMPRE NO FINAL)
// =======================
app.listen(process.env.PORT, () => {
  console.log(`🔥 Servidor rodando na porta ${process.env.PORT}`);
});
