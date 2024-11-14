const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'sorveteria'
});

app.get('/', (req, res) => {
    res.redirect('/api/sabores');
});


app.get('/api/sabores', (req, res) => {
    db.query('SELECT * FROM sabores', (error, results) => {
        if (error) return res.status(500).json({ error });
        res.json(results);
    });
});


app.post('/api/sabores/criar', (req, res) => {
    const { nome, descricao, imagemUrl } = req.body;

    if (!nome || !descricao || !imagemUrl) { 
        return res.status(400).json({ error: 'Nome, descrição e imagem são obrigatórios' });
    }
    const query = 'INSERT INTO sabores (nome, descricao, imagemUrl) VALUES (?, ?, ?)';
    db.query(query, [nome, descricao, imagemUrl], (error, results) => {
        if (error) {
            return res.status(500).json({ error: `${error.message}Erro ao criar sabor`, });
        }
        res.status(201).json({ message: 'Sabor criado com sucesso', saborId: results.insertId });
    });
});


app.get('/api/sabores/:id', (req, res) => {
    const { id } = req.params;

    const query = 'SELECT * FROM sabores WHERE id = ?';
    db.query(query, [id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Erro ao buscar sabor' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Sabor não encontrado' });
        }
        res.json(results[0]);
    });
});


app.put('/api/sabores/:id', (req, res) => {
    const { id } = req.params;
    const { nome, descricao, imagemUrl } = req.body;

    if (!nome || !descricao || !imagemUrl) { 
        return res.status(400).json({ error: 'Nome, descrição e imagem são obrigatórios' });
    }

    const query = 'UPDATE sabores SET nome = ?, descricao = ?, imagemUrl = ? WHERE id = ?';
    db.query(query, [nome, descricao, imagemUrl, id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Erro ao atualizar sabor' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Sabor não encontrado' });
        }
        res.json({ message: 'Sabor atualizado com sucesso' });
    });
});


app.delete('/api/sabores/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM sabores WHERE id = ?';
    db.query(query, [id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Erro ao deletar sabor' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Sabor não encontrado' });
        }
        res.json({ message: 'Sabor deletado com sucesso' });
    });
});

app.listen(port, () => {
    console.log(`O servidor está rodando na porta: ${port}`);
});
