import axios from "axios";

const BASE_URL = "https://curriculo-api-aos-2026.vercel.app/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export async function getUsuarios() {
  const response = await api.get("/usuarios");
  return response.data;
}

export async function getUsuario(id) {
  const response = await api.get(`/usuarios/${id}`);
  return response.data;
}

export async function criarUsuario(dados) {
  const response = await api.post("/usuarios", dados);
  return response.data;
}

export async function atualizarUsuario(id, dados) {
  const response = await api.put(`/usuarios/${id}`, dados);
  return response.data;
}

export async function deletarUsuario(id) {
  const response = await api.delete(`/usuarios/${id}`);
  return response.data;
}

export async function getAcademicas(usuarioId) {
  const response = await api.get(`/usuarios/${usuarioId}/academicas`);
  return response.data;
}

export async function getAcademica(usuarioId, academicaId) {
  const response = await api.get(`/usuarios/${usuarioId}/academicas/${academicaId}`);
  return response.data;
}

export async function criarAcademica(usuarioId, dados) {
  const response = await api.post(`/usuarios/${usuarioId}/academicas`, dados);
  return response.data;
}

export async function atualizarAcademica(usuarioId, academicaId, dados) {
  const response = await api.put(`/usuarios/${usuarioId}/academicas/${academicaId}`, dados);
  return response.data;
}

export async function deletarAcademica(usuarioId, academicaId) {
  const response = await api.delete(`/usuarios/${usuarioId}/academicas/${academicaId}`);
  return response.data;
}

export async function getProfissionais(usuarioId) {
  const response = await api.get(`/usuarios/${usuarioId}/profissionais`);
  return response.data;
}

export async function getProfissional(usuarioId, profissionalId) {
  const response = await api.get(`/usuarios/${usuarioId}/profissionais/${profissionalId}`);
  return response.data;
}

export async function criarProfissional(usuarioId, dados) {
  const response = await api.post(`/usuarios/${usuarioId}/profissionais`, dados);
  return response.data;
}

export async function atualizarProfissional(usuarioId, profissionalId, dados) {
  const response = await api.put(`/usuarios/${usuarioId}/profissionais/${profissionalId}`, dados);
  return response.data;
}

export async function deletarProfissional(usuarioId, profissionalId) {
  const response = await api.delete(`/usuarios/${usuarioId}/profissionais/${profissionalId}`);
  return response.data;
}

export async function getProjetos(usuarioId) {
  const response = await api.get(`/usuarios/${usuarioId}/projetos`);
  return response.data;
}

export async function getProjeto(usuarioId, projetoId) {
  const response = await api.get(`/usuarios/${usuarioId}/projetos/${projetoId}`);
  return response.data;
}

export async function criarProjeto(usuarioId, dados) {
  const response = await api.post(`/usuarios/${usuarioId}/projetos`, dados);
  return response.data;
}

export async function atualizarProjeto(usuarioId, projetoId, dados) {
  const response = await api.put(`/usuarios/${usuarioId}/projetos/${projetoId}`, dados);
  return response.data;
}

export async function deletarProjeto(usuarioId, projetoId) {
  const response = await api.delete(`/usuarios/${usuarioId}/projetos/${projetoId}`);
  return response.data;
}