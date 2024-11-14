import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

interface Sabor {
  id: number;
  nome: string;
  descricao: string;
  imagemUrl: string; 
}

function App() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');  
  const [sabores, setSabores] = useState<Sabor[]>([]);
  const [editSabor, setEditSabor] = useState<Sabor | null>(null);

  useEffect(() => {
    fetchSabores();
  }, [sabores]);

  const fetchSabores = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/sabores');
      setSabores(response.data);
    } catch (error) {
      console.error('Erro ao buscar sabores:', error);
    }
  };

  const handleCreate = async () => {
    if (!nome || !descricao || !imagemUrl) return;

    try {
      const response = await axios.post('http://localhost:3001/api/sabores/criar', {
        nome,
        descricao,
        imagemUrl, 
      });
      setSabores([...sabores, response.data]);
      resetForm();
    } catch (error) {
      console.error('Erro ao criar sabor:', error);
    }
  };

  const handleUpdate = async () => {
    if (!editSabor || !nome || !descricao || !imagemUrl) return;

    try {
      await axios.put(`http://localhost:3001/api/sabores/${editSabor.id}`, {
        nome,
        descricao,
        imagemUrl,
      });
      setSabores(
        sabores.map((sabor) =>
          sabor.id === editSabor.id ? { ...sabor, nome, descricao, imagemUrl } : sabor
        )
      );
      resetForm();
    } catch (error) {
      console.error('Erro ao atualizar sabor:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/api/sabores/${id}`);
      setSabores(sabores.filter((sabor) => sabor.id !== id));
    } catch (error) {
      console.error('Erro ao deletar sabor:', error);
    }
  };

  const handleEdit = (sabor: Sabor) => {
    setNome(sabor.nome);
    setDescricao(sabor.descricao);
    setImagemUrl(sabor.imagemUrl);
    setEditSabor(sabor);
  };

  const resetForm = () => {
    setNome('');
    setDescricao('');
    setImagemUrl('');
    setEditSabor(null);
  };

  return (
    <div className="container mt-4">
      <h1>Gerenciamento de Sabores da Sorveteria</h1>

      <div className="form-group mb-4 text-start">
        <label htmlFor="nome">Nome</label>
        <input
          type="text"
          className="form-control"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome do sabor"
        />
      </div>

      <div className="form-group mb-4 text-start">
        <label htmlFor="descricao">Descrição</label>
        <input
          type="text"
          className="form-control"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Descrição do sabor"
        />
      </div>

      <div className="form-group mb-4 text-start">
        <label htmlFor="imagemUrl">Imagem URL</label>
        <input
          type="text"
          className="form-control"
          value={imagemUrl}
          onChange={(e) => setImagemUrl(e.target.value)}
          placeholder="URL da imagem"
        />
      </div>

      <button 
        onClick={editSabor ? handleUpdate : handleCreate} 
        className="btn btn-primary"
      >
        {editSabor ? 'Salvar Alterações' : 'Adicionar Sabor'}
      </button>

      <div id="carouselSabores" className="carousel slide mt-5" data-bs-ride="carousel">
        <div className="carousel-inner">
          {sabores.map((sabor, index) => (
            <div key={sabor.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
              <img src={sabor.imagemUrl} className="d-block w-100"  />
              <div className="carousel-caption d-none d-md-block">
                <h5>{sabor.nome}</h5>
                <p>{sabor.descricao}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselSabores" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Antes</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselSabores" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Depois</span>
        </button>
      </div>

      <div className="mt-4">
        {sabores.length >= 1 && <h2>Lista de Sabores</h2>}
        {sabores.map((sabor) => (
          <div key={sabor.id} className="card mb-4 p-4 w-50 m-auto">
            <h5>{sabor.nome}</h5>
            <p>{sabor.descricao}</p>
            <button onClick={() => handleDelete(sabor.id)} className="btn btn-danger mt-1 mb-1">Remover</button>
            <button onClick={() => handleEdit(sabor)} className="btn btn-warning mt-1">Editar</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
