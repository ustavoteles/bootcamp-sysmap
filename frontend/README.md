
# 📌 Activities Page

Este projeto é uma interface de listagem de atividades desenvolvida com **React**, que permite aos usuários visualizarem atividades populares, atividades agrupadas por tipo, além de filtrar atividades com base no tipo selecionado.

## Tecnologias Utilizadas

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- Context API para autenticação
- React Router DOM para gerenciamento de rotas
- API externa para consumo de atividades

---

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/bc-fullstack-06/Gustavo-Teles-da-Silva/tree/main

Dentro da pasta

cd frontend
```

2. Instale as dependências:

```bash
npm install
```
3. Suba o container Docker:

```bash
docker compose up -d

ou

docker compose up 
```
4. Rode o projeto:

```bash
npm run dev
```

---
##  Autenticação

O projeto utiliza o AuthContext para gerenciar a autenticação via token JWT. O token é necessário para acessar os endpoints /activities/all e /activities/types.
---

## 👨‍💻 Autor

Desenvolvido por [Gustavo Teles] 💻 