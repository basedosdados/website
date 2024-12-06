<p align="center">
  <a href="https://basedosdados.org">
    <img src="./next/public/favicon_default.ico" width="180px">
  </a>
</p>
<p align="center" style="position: relative; top: -50px">
  <em>Universalizando o acesso a dados de qualidade.</em>
</p>

# Website

Repositório do website [basedosdados.org](https://basedosdados.org).

Este projeto é uma aplicação desenvolvida com Next.js.

Ele utiliza variáveis de ambiente para configuração e pode ser executado com `npm` ou com `Docker Compose`.

## Pré-requisitos

- Node.js versão **18.20.3** (recomendado)
- **npm** ou **Docker Compose**

## Instruções de configuração

### Variáveis de ambiente

Para configurar o ambiente, crie um arquivo `.env` na pasta raiz do projeto com o seguinte conteúdo:

```plaintext
NODE_ENV="development"
NEXT_PUBLIC_API_URL="http://localhost:8080"
NEXT_PUBLIC_SITE_NAME="Basedosdados"
NEXT_PORT=80
NEXT_PUBLIC_BASE_URL_FRONTEND="http://localhost:3000"
```

Essas variáveis de ambiente são utilizadas pela aplicação para definir o ambiente de desenvolvimento e configurar as URLs da API e do site.

## Executando a Aplicação

Escolha **um dos métodos de inicialização** abaixo para executar a aplicação.

## npm

Na pasta `next`, instale as dependências do projeto com o comando:

```bash
npm ci
```

Este comando garante que todas as dependências serão instaladas com as versões especificadas em `package-lock.json`.

Após instalar as dependências, carregue suas `.env`(elas estão armazenadas na raiz do projeto):

```bash
cd ./
source .env
```
e inicie o servidor de desenvolvimento com:

```bash
cd next
npm run dev
```

## Docker compose

Na raiz do projeto, certifique-se de que o arquivo `.env` está configurado.

Inicie a aplicação com Docker Compose:
```bash
docker-compose up
```

## 👥 Como contribuir

Leia nosso [guia de contribuição](./CONTRIBUTING.md)
