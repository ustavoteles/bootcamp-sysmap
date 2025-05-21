import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

export const login = async (url: string, dados: Object, setDados: Function) => {
  const res = await api.post(url, dados);
  setDados(res.data);
};

export const cadastrar = async (
  url: string,
  dados: Object,
  setDados: Function,
  header: Object
) => {
  const res = await api.post(url, dados, header);
  setDados(res.data);
};

export const listar = async (
  url: string,
  setDados: Function,
  header: Object
) => {
  const res = await api.get(url, header);
  setDados(res.data);
  return res.data;
};

export const atualizar = async (
  url: string,
  dados: Object,
  setDados: Function,
  header: Object
) => {
  const res = await api.put(url, dados, header);
  setDados(res.data);
};

export const deletar = async (url: string, header: Object) => {
  await api.delete(url, header);
};
