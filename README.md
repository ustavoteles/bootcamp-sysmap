# Gustavo-Teles-da-Silva

# 🏃‍♂️ FitMeet

**FitMeet** é uma plataforma desenvolvida durante o **Bootcamp Fullstack da Sysmap** com o objetivo de facilitar o agendamento de encontros para **atividades físicas ao ar livre**. Além de promover a saúde e socialização, o sistema inclui um sistema de **gamificação**, onde os usuários ganham **XP** e sobem de **nível** conforme participam de atividades.

Este repositório reúne os três projetos que compõem a aplicação:

- **Back-end (Node.js)**
- **Front-end Web (React)**
- **Aplicativo Mobile (React Native)**

Cada projeto está localizado em sua respectiva pasta, com instruções de execução em seu próprio `README.md`.

---

## 📁 Estrutura do Repositório

```
Gustavo-Teles-da-Silva/
├── backend/         # Projeto back-end em Node.js
├── frontend/        # Projeto front-end web em React
├── mobile/          # Projeto mobile em React Native
└── README.md        # Este arquivo
```

> 📌 Cada pasta contém um `README.md` com os comandos para rodar localmente.

---

## ✨ Tecnologias Utilizadas

### 🔧 Back-end (Node.js)
- **Node.js + Express**
- **PostgreSQL** com ORM (TypeORM ou Sequelize)
- **JWT** para autenticação
- **Amazon S3** para upload e hospedagem de imagens de perfil
- **Swagger** para documentação da API
- **Docker** (opcional para ambiente isolado)
- **Validação com middleware customizado**

### 💻 Front-end Web (React)
- **React + Vite**
- **Axios** para consumo da API
- **Context API** para gerenciamento de estado
- **React Router**
- **Tailwind CSS** (ou framework CSS equivalente)

### 📱 Mobile (React Native)
- **React Native CLI** ou **Expo**
- **React Navigation**
- **Axios**
- **Integração com a API**
- **Estilização com componentes nativos**

---

## 🎮 Funcionalidades

- Cadastro e login de usuários
- Upload de avatar com **integração ao S3**
- Criação, aprovação e finalização de atividades físicas
- Participação em atividades por outros usuários
- Sistema de **nível e XP** com gamificação
- Visualização de perfil e histórico
- **Documentação da API** disponível via Swagger

---

## 🚀 Como Executar

Para rodar cada parte do projeto, acesse os links abaixo:

- [`backend/README.md`](./backend/README.md) – instruções para API
- [`frontend/README.md`](./frontend/README.md) – instruções para interface web
- [`mobile/README.md`](./mobile/README.md) – instruções para app mobile

---

## 📄 Documentação da API

A documentação da API está disponível via **Swagger** após iniciar o servidor do back-end.  
Acesse em:  
```
http://localhost:3000/swagger
```

---

## 📬 Contato

**Desenvolvedor:** [Seu Nome]  
**Email:** [telesgustavo.dev@gmail.com]  
**LinkedIn:** [https://www.linkedin.com/in/ustavoteles]