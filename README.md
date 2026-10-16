<p align="center">
  <a href="https://basedosdados.org">
    <img src="./next/public/favicon_default.ico" width="180px">
  </a>
</p>
<p align="center" style="position: relative; top: -50px">
  <em>Universalizando o acesso a dados de qualidade.</em>
</p>

# Website

Repositório do website da Base dos Dados, servido em três domínios:

| Domínio | Idioma padrão |
|---|---|
| [basedosdados.org](https://basedosdados.org) | `pt` |
| [data-basis.org](https://data-basis.org) | `en` |
| [basedelosdatos.org](https://basedelosdatos.org) | `es` |

É uma aplicação Next.js 12 (pages router) que consome a API GraphQL do [backend](https://github.com/basedosdados/backend). Mais detalhes de arquitetura, deploy e fluxo de trabalho estão na [wiki](https://github.com/basedosdados/website/wiki).

## Pré-requisitos

- Node.js **20.18.1** (versão em [`next/.nvmrc`](./next/.nvmrc) e no [`Dockerfile`](./next/Dockerfile); com nvm, rode `nvm use` dentro de `next/`)
- **npm** ou **Docker Compose**

## Variáveis de ambiente

Copie o exemplo para a raiz do projeto e ajuste os valores:

```bash
cp .env.example .env
```

| Variável | Obrigatória | Descrição |
|---|---|---|
| `NODE_ENV` | sim | `development` localmente |
| `NEXT_PUBLIC_API_URL` | sim | URL do backend, sem `/api/v1/graphql` (ex.: `http://localhost:8080` ou `https://staging.backend.basedosdados.org`) |
| `NEXT_PUBLIC_SITE_NAME` | sim | Nome do site |
| `NEXT_PUBLIC_BASE_URL_FRONTEND` | sim | URL onde o front-end está rodando |
| `NEXT_PORT` | Docker | Porta do host para o serviço `basedosdados.org` no Docker Compose |
| `NEXT_PUBLIC_DOMAIN` | não | Domínio servido pelo build. Sem ela, o site usa o hostname do navegador (`localhost`), e conteúdos exclusivos de `basedosdados.org` ficam ocultos |
| `NEXT_PUBLIC_KEY_STRIPE` | pagamentos | Chave publicável do Stripe (use a de teste) |
| `CHATBOT_URL` | chatbot | URL da API do chatbot |
| `BACKEND_AUTH_EMAIL` / `BACKEND_AUTH_PASSWORD` | não | Usuário de serviço usado por `/api/team/*` e `/api/user/getIdUser` |
| `URL_DOWNLOAD_OPEN` / `URL_DOWNLOAD_CLOSED` | download | Buckets (`gs://...`) usados por `/api/tables/downloadTable` |
| `CRYPRESS_AUTH_EMAIL` / `CRYPRESS_AUTH_PASSWORD` | testes | Credenciais usadas pelos testes Cypress |

> [!NOTE]
> Variáveis `NEXT_PUBLIC_*` são embutidas no bundle durante o build. Ao alterá-las, reinicie o `npm run dev` ou reconstrua a imagem Docker.

## Executando a aplicação

Escolha **um dos métodos** abaixo.

### npm

Na raiz do projeto, carregue as variáveis e instale as dependências:

```bash
source .env
cd next
npm ci
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O site fica em `http://localhost:3000`. Como o domínio é `localhost`, o idioma padrão é `pt`; acesse `/en` e `/es` para os outros idiomas.

### Docker Compose

Com o `.env` configurado na raiz:

```bash
docker compose up
```

São criados três serviços, um por domínio, todos a partir da mesma imagem com `NEXT_PUBLIC_DOMAIN` diferente:

| Serviço | Domínio | Porta no host |
|---|---|---|
| `next-basedosdados` | `basedosdados.org` | `${NEXT_PORT}` |
| `next-databasis` | `data-basis.org` | `3001` |
| `next-basedelosdatos` | `basedelosdatos.org` | `3002` |

Para subir só um deles: `docker compose up next-basedosdados`.

### Testes

Os testes end-to-end usam Cypress. Com o servidor rodando, dentro de `next/`:

```bash
npm run cypress        # interface gráfica
npm run cypress:run    # headless (Chrome)
```

## 👥 Como contribuir

Leia nosso [guia de contribuição](./CONTRIBUTING.md) e o [fluxo de trabalho com Git Flow](https://github.com/basedosdados/website/wiki/Fluxo-de-trabalho).
