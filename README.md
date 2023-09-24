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

## Instruções Para Poder Jogar Localmente
**Atenção:** Todos as máquinas da rede poderão se conectar ao jogo desde que 1 delas esteja rodando o projeto, as outras não precisam rodar nada.
- Copie o ip da máquina que irá rodar o projeto
- Abra o arquivo server.py que está dentro do diretório 'backend' na máquina que irá rodar
- Substituia o localhost na linha 36 (socketio.run(app, host="localhost", port=5001, debug=True)) pelo ip copiado
- Em seguida, vá para o arquivo urlServer.js que está dentro do diretório frontend/src/components/common
- Substituia o localhost na linha 2 (const serverUrlBase = "http://localhost:5001") pelo ip copiado
- OBS: Essa linha deve ficar da seguinte maneira const serverUrlBase = "http://ipCopiado:5001"
