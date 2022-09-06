import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as C from "./styles";
import api from "../../services/api";
import { FaArrowLeft } from "react-icons/fa";

const Repositorios = () => {
  const { repositorio } = useParams();
  const [repo, setRepo] = useState({});
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState([
    { state: "all", label: "Todas", active: true },
    { state: "open", label: "Abertas", active: false },
    { state: "closed", label: "Fechadas", active: false },
  ]);
  const [filterIndex, setFilterIndex] = useState(0);

  useEffect(() => {
    async function load() {
      const [repositorioData, issuesData] = await Promise.all([
        api.get(`/repos/${repositorio}`),
        api.get(`/repos/${repositorio}/issues`, {
          params: {
            state: filters.find((f) => f.active).state,
            per_page: 5,
          },
        }),
      ]);
      setRepo(repositorioData.data);
      setIssues(issuesData.data);
      setLoading(false);
    }
    load();
  }, [repositorio]);

  useEffect(() => {
    async function loadIssue() {
      const response = await api.get(`repos/${repositorio}/issues`, {
        params: {
          state: filters[filterIndex].state,
          page,
          per_page: 5,
        },
      });
      setIssues(response.data);
    }
    loadIssue();
  }, [page,filterIndex,filters,repositorio]);

  function handlePage(action) {
    setPage(action === "back" ? page - 1 : page + 1);
  }

  function handleFilter(index, estado) {
    setFilterIndex(index);
  }

  if (loading) {
    return (
      <C.Loading>
        <h1>Carregando...</h1>
      </C.Loading>
    );
  }
  return (
    <C.Container>
      <C.BackButton to={"/"}>
        <FaArrowLeft color="#000" size={35} />
      </C.BackButton>
      <C.Owner>
        <img src={repo.owner.avatar_url} alt={repo.owner.login} />
        <h1>{repo.name}</h1>
        <p>{repo.description}</p>
      </C.Owner>

      <C.FilterList active={filterIndex}>
        {filters.map((filter, index) => (
          <button
            type="button"
            key={filter.label}
            onClick={() => handleFilter(index, filter.state)}
          >
            {filter.label}
          </button>
        ))}
      </C.FilterList>

      <C.IssuesList>
        {issues.map((issue) => (
          <li key={issue.id}>
            <img src={issue.user.avatar_url} alt={issue.user.login} />
            <div>
              <strong>
                <a href={issue.html_url}>{issue.title}</a>
                {issue.labels.map((label) => (
                  <span key={label.id}>{label.name}</span>
                ))}
              </strong>
              <p>{issue.user.login}</p>
            </div>
          </li>
        ))}
      </C.IssuesList>

      <C.PageActions>
        <button
          type="button"
          onClick={() => handlePage("back")}
          disabled={page < 2}
        >
          Voltar
        </button>
        <button type="button" onClick={() => handlePage("next")}>
          Proxima
        </button>
      </C.PageActions>
    </C.Container>
  );
};

export default Repositorios;
