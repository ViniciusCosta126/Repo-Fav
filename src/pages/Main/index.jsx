import React, { useState, useCallback,useEffect } from "react";
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import api from "../../services/api";
import * as C from "./styles";

const Home = () => {
  const [newRepo, setNewRepo] = useState("");
  const [repositorios, setRepositorios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert,setAlert] = useState(null)


  useEffect(()=>{
    const repoStorage = localStorage.getItem('repos')
    if(repoStorage){
      console.log(JSON.parse(repoStorage))
      setRepositorios(JSON.parse(repoStorage))
    }
  },[])

  useEffect(()=>{
    localStorage.setItem('repos', JSON.stringify(repositorios))
  },[repositorios])

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      async function submit() {
        setLoading(true);
        setAlert(null)
        try {
          if (newRepo === "") {
            throw new Error("Voce precisa indicar um novo repositorio");
          }
          const response = await api.get(`repos/${newRepo}`);
          const data = {
            name: response.data.full_name,
          };
          const hasRepo = repositorios.find((repo) => repo.name === newRepo);
          if (hasRepo) {
            throw new Error("Repositorio duplicado");
          }
          setRepositorios([...repositorios, data]);
          setNewRepo("");
        } catch (error) {
          setAlert(true)
          console.log(error);
        } finally {
          setLoading(false);
        }
      }
      submit();
    },
    [newRepo, repositorios]
  );

  const handleDelete = useCallback(
    (repo) => {
      const find = repositorios.filter((r) => r.name !== repo);
      setRepositorios(find);
    },
    [repositorios]
  );

  return (
    <C.Container>
      <h1>
        <FaGithub size={25} />
        Meus Repositorios
      </h1>
      <C.Form onSubmit={handleSubmit} error={alert}>
        <input
          type="text"
          placeholder="Adicionar Repositorios"
          value={newRepo}
          onChange={(e) => setNewRepo(e.target.value)}
        />
        <C.SubmitButton loading={loading ? 1 : 0}>
          {loading ? (
            <FaSpinner color="#fff" size={14} />
          ) : (
            <FaPlus color="#fff" size={14} />
          )}
        </C.SubmitButton>
      </C.Form>
      <C.List>
        {repositorios.map((repo) => (
          <li key={repo.name}>
            <span>
              <C.DeleteButton onClick={() => handleDelete(repo.name)}>
                <FaTrash size={14} />
              </C.DeleteButton>
              {repo.name}
            </span>
            <Link to={`repositorio/${encodeURIComponent(repo.name)}`}>
              <FaBars size={20} />
            </Link>
          </li>
        ))}
      </C.List>
    </C.Container>
  );
};

export default Home;
