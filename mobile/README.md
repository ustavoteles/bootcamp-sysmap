# 📱 FitMeet

> ⚠️ **Importante:** Este app foi projetado com base nas dimensões da tela de um **iPhone SE 2**. Para melhor visualização e funcionamento da interface, recomendamos testá-lo em um **emulador do iPhone SE 2** ou em um **dispositivo com tela semelhante**.

Este é um aplicativo mobile desenvolvido em **React Native** com **Expo**, que fornece uma plataforma para **agendamento de encontros voltados à prática de atividades físicas ao ar livre**.

Os usuários podem criar eventos esportivos, nos quais outros usuários podem se inscrever. Os eventos podem ser:
- **Públicos**, permitindo a participação de qualquer usuário automaticamente;
- **Privados**, exigindo aprovação do organizador.

A presença no evento é validada com um **código de confirmação fornecido pelo organizador**.  
Ao participar das atividades, os usuários ganham **pontos (XP)**, que definem seu nível e desbloqueiam **conquistas representadas por medalhas**.


---

## ⚙️ Tecnologias utilizadas

- React Native  
- Expo  
- TypeScript  
- Axios  
- React Navigation  
- Context API  

---

## 🚀 Como executar o projeto

### 1. Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina:

- **Node.js** (recomendado: versão LTS) → [https://nodejs.org](https://nodejs.org)  
- **Expo CLI**

```bash
npm install -g expo-cli
```

- **Git** (para clonar o projeto)  
- **Docker** (para rodar o back-end via container)  
- **Expo Go** (app no celular, disponível na Play Store ou App Store)

---
### 2. Clonando o repositório

```bash
git clone https://github.com/bc-fullstack-06/Gustavo-Teles-da-Silva
```

---
### 3. Subindo o container Docker (back-end)

```bash
docker compose up -d
```

---

### 4. Entre na pasta do projeto

```bash
cd mobile
```
---


### 5.  🛠️ Variáveis de ambiente
- Crie um arquivo .env dentro da pasta mobile do projeto com o seguinte conteúdo:
```
URL=http://<SEU_IP_LOCAL>:3000
API_URL=${URL}:3000
```

> Substitua `<SEU_IP_LOCAL>` pelo IP da sua máquina na rede local (ex: 192.150.0.10)
---

### 6. Instalando as dependências
```bash
  npm install
  ```

### 7. Iniciando o projeto
```bash
  npx expo start
  ```

- O Expo abrirá uma aba no seu navegador com um QR Code.
- Escaneie esse QR Code com o app **Expo Go** no seu celular (certifique-se de que ambos estão na **mesma rede Wi-Fi**).
- Alternativamente, use um emulador Android/iOS (recomenda-se o iPhone SE 2).


