# whyc-game
_WHY.C_ é um webapp interativo que desafia 2 jogadores a competirem em uma corrida contra o tempo. A cada round, o jogo apresenta aos jogadores uma imagem gerada por uma IA generativa. Os jogadores têm um intervalo de tempo limitado para examinar a imagem e deduzir qual foi o prompt original que a IA recebeu. A vitória é concedida àquele que acertar primeiro a resposta exata ou melhor se aproximar dela.

## Backend
### Dependências necessárias para rodas o projeto
- Flask
- Flask SocketIO

[![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)


### Instalando dependências
```shell
# Dentro do diretório 'backend'
pip install -r requirements.txt
```

### Adicionando key do OpenAI
Para adicionar a key do OpenAI nesse projeto, é necessário que os seguintes passos sejam seguidos:

- Crie um arquivo .env **fora do diretório 'backend'**
- Copie a linha abaixo e cole no arquivo .env criado

  ```shell
  OPENAI_API_KEY=""
  ```
- No arquivo .env, entre as aspas em OPENAI_API_KEY="", bote a key do OpenAI

### Rodando o backend
```shell
# Dentro do diretório 'backend'
python3 server.py
```

## Frontend 
### Dependências necessárias para rodar o projeto
- React Scripts
- React Router Dom
- React Popup
- Crypto JS
- Axios

[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://react.dev/)

### Instalando dependências
```shell
# Dentro do diretório 'frontend'
npm install
```

### Rodando o frontend
```shell
# Dentro do diretório 'frontend'
npm start
```
