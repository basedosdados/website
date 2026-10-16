# Contribuindo

Obrigado por considerar contribuir com a Base dos Dados. Nesse guia vamos mostrar como contribuir com o website da Base dos Dados.

## Como contribuir

- Melhorias e correções no webiste. Verifique nossas [issues abertas](https://github.com/basedosdados/website/issues) para um ponto de início
- Sugestões de melhorias na interface, typos, design, etc.. Você pode dar feedback ou sugestões em nossas [issues](<(https://github.com/basedosdados/website/issues)>)
- Escrever postagens no nosso blog.

## Iniciando

- Faça o [fork](https://docs.github.com/pt/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo) desse repositório (pessoas da equipe podem clonar o repositório direto)
- Clone o repositório
- Entre no repositório clonado
  - `cd website`
- Crie uma branch a partir de `main`
  - `git checkout main && git pull && git checkout -b docs/post-nome-do-post`

Para rodar o site localmente e ver seu post, siga o [README](./README.md).

## Adicionando posts

Esse seção cobre o processo de contruição no blog da Base dos Dados.

Algumas informações:

- As postagens ficam em `next/blog/<idioma>/`, com uma pasta por idioma: `pt` ([basedosdados.org](https://basedosdados.org)), `en` ([data-basis.org](https://data-basis.org)) e `es` ([basedelosdatos.org](https://basedelosdatos.org)). Um post só aparece no blog dos idiomas em que tem arquivo.
- Cada post é um arquivo markdown (`.md`). Em `pt`, o nome do arquivo é a URL do post: `basedosdados.org/blog/<nome-do-arquivo>`.
- As traduções de um post usam **o mesmo nome de arquivo** nas pastas `en` e `es` — é isso que liga as versões entre si. Para ter uma URL traduzida, defina o campo `slug` nos metadados (veja abaixo).
- As imagens ficam em `next/public/blog/<nome-do-arquivo>/` e são compartilhadas entre os idiomas.

Exemplo: o arquivo [`next/blog/pt/analisando-precos-de-combustiveis.md`](./next/blog/pt/analisando-precos-de-combustiveis.md) tem uma pasta em [`next/public/blog/analisando-precos-de-combustiveis/`](./next/public/blog/analisando-precos-de-combustiveis/) onde ficam todas as imagens usadas no post.

Crie um arquivo markdown em `next/blog/pt/` (e, se houver tradução, em `next/blog/en/` e `next/blog/es/` com o mesmo nome):

> [!IMPORTANT]
> O nome do arquivo será o caminho do post. Se você criar um arquivo `analisando-precos-de-combustiveis.md` ele será publicado em `basedosdados.org/blog/analisando-precos-de-combustiveis`. Evite caracteres como `ç` e acentos, utilize hífen (`-`) para separar as palavras.

O post é escrito em Markdown com algumas diferenças que serão abordadas logo abaixo. Veja a sintaxe básica em [Markdown Guide](https://www.markdownguide.org/basic-syntax/) e em [Markdown Cheat Sheet](https://www.markdownguide.org/cheat-sheet/)

### Metadados

Os metadados do post são em [YAML](https://yaml.org/) em um bloco no topo do arquivo delimitado por `---` e `---`. Preencha os metadadaos do seu post, título, descrição, etc.

- `title`: Título do post
- `description`: Descrição do post
- `date`
  - `created`: Data de criação do post, deve ser uma string `"2024-02-29"` no formato [ISO 8601](https://pt.wikipedia.org/wiki/ISO_8601).
  - `updated` (opcional): Data que o post foi atualizado. Mesmo formato de `created`
- `thumbnail` (opcional): Caminho para uma imagem.
- `categories` (opcional): uma lista com as categorias. Exemplo: `analise`, `tutorial`
- `authors` (recomendado): Uma lista de autores. Cada autor tem o seguintes campos:
  - `name` (obrigatório): Nome do autor
  - `role` (opcional): Qual foi o papel dessa pessoa no post
  - `social` (opcional): Uma URL para alguma rede social da pessoa (github, website, linkedin)
  - `avatar` (opcional): URL para uma imagem
- `slug` (opcional, usado nas traduções): URL do post naquele idioma. Exemplo: [`next/blog/es/analisando-o-brasil-nas-olimpiadas-2016.md`](./next/blog/es/analisando-o-brasil-nas-olimpiadas-2016.md?plain=1) usa `slug: brasil-en-los-juegos-olimpicos` e é publicado em `basedelosdatos.org/blog/brasil-en-los-juegos-olimpicos`.
- `order` (opcional): Número para fixar o post no topo da listagem (menor aparece primeiro). Posts sem `order` são ordenados pela data de criação.
- `published`: Um boolean, `true` ou `false`. Deve sempre ser `true`. Ele é `false` quando por algum motivo queremos remover o post do blog da Base dos Dados.

[Exemplo para `analisando-disparidade-salarial-por-genero-e-raca.md`](./next/blog/pt/analisando-disparidade-salarial-por-genero-e-raca.md?plain=1):

```md
---
title: Como a disparidade salarial por gênero e raça evoluiu ao longo dos anos?
description: >-
  Analisando a disparidade salarial por gênero e raça com dados do CAGED e o
  datalake público da BD
date:
  created: "2024-02-29"
thumbnail: /blog/analisando-disparidade-salarial-por-genero-e-raca/image_0.png
categories: [analise]
authors:
  - name: Thais Filipi
    role: Análise e texto
    social: https://www.linkedin.com/in/thaismdr/
    avatar: https://media.licdn.com/dms/image/v2/C4E03AQFstxqWabAyUA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1584489568236?e=2147483647&v=beta&t=mol7Kc8PgxgJatgvNYRkyffL8opuIgFgRdiY7vXB1HA
  - name: Giovane Caruso
    role: Edição de texto
    social: https://www.linkedin.com/in/giovanecaruso/
published: true
---

Não é novidade que a desigualdade de gênero e raça reflete na empregabilidade e na remuneração dentro do mercado de trabalho no Brasil. Apesar da legislação que proíbe a disparidade salarial entre indivíduos desempenhando a mesma função, a realidade é que tais disparidades persistem. Recentemente, o Governo Federal tomou medidas para enfrentar esse desafio ao publicar uma portaria que regulamenta a Lei nº 14.611/2023. Essa lei cria mecanismos para equalizar salários entre homens e mulheres ocupando o mesmo cargo em empresas com pelo menos 100 funcionários.

## Análise

### Disparidade salarial entre 2020 e 2023

Ao analisarmos o salário médio por grupos, ficou evidente a vantagem que homens brancos mantêm em relação aos demais. Em 2023, o salário médio dos homens brancos foi de R$2.087, 25,6% maior do que o salário médio das mulheres negras, que foi de R$1.662. Uma forma de visualizar as diferenças é ver o salário médio de homens negros, mulheres negras e brancas enquanto porcentagem do salário médio de homens brancos, como você pode conferir no gráfico abaixo.
```

### Seções

Utilize seções (cabeçalhos) para estruturar seu post. Um bom exemplo é o post [O Soberano mítico: Processo de limpeza dos dados do Siconfi](./next/blog/pt/atualizar-processo-de-limpeza-dos-dados-do-siconfi.md?plain=1)

```md
## TL;DR

## Finbra x Siconfi

## Considerações sobre os conjuntos de dados

### A forma estrutural em que os dados são disponibilizados.

#### Alguns detalhes da arquitetura

##### 1989-2012

##### 2013-2020

#### Terminado o processo de compatibilização, chamamos a base inteira de Siconfi

## O processo de limpeza e compatibilização

### Adição de ID Município para os anos de 1989-2012

### Compatibilização das portarias e estágios

### Passo 1: Empilhar todas as tabelas de 1989–2020 com as colunas originais

### Passo 2: Padronizar nome das contas entre anos

### Passo 3: Criar IDs que identificassem contas de forma consistente entre/intra anos

### Passo 4: Criar a coluna de estágios para os anos que não o tinham (1989–2012)

### Passo 5: Padronização de moeda

## Considerações finais
```

> [!IMPORTANT]
> Os cabeçalhos iniciam no nível dois `##` ao invés de um `#`

### Negrito

Texto em negrito é delimitado por `**` ao seu redor.

```md
Texto em **negrito**
```

Resultado:

Texto em **negrito**

### Itálico

Texto em itálico é delimitado por `_` ao seu redor.

```md
Texto em _itálico_
```

Resultado:

Texto em _itálico_

### Lista

Lista pode ser enumerada ou não enumerada.

#### Lista enumerada

```md
1. Primeiro item
2. Segundo item
3. Primeiro item do segundo item
4. Segundo item do segundo item
```

Resultado:

1. Primeiro item
2. Segundo item
3. Primeiro item do segundo item
4. Segundo item do segundo item

#### Lista não enumerada

```md
- Primeiro item
- Segundo item
  - Primeiro item do segundo item
  - Segundo item do segundo item
```

Resultado:

- Primeiro item
- Segundo item
  - Primeiro item do segundo item
  - Segundo item do segundo item

### Bloco de códigos

Adicione blocos de códigos entre os tripos backtick (crase) <code>`</code>. Adicione o nome da linguagem na abertura, depois dos três backticks.

#### Python:

<pre>
```python
print("Hello World!!")
```
</pre>

Resultado:

```python
print("Hello World!!")
```

#### R

<pre>
```r
library(basedosdados)
data <- basedosdados::read_sql("
SELECT
  *
FROM
  `basedosdados.br_bcb_sicor.microdados_operacao`
LIMIT 100
")
```
</pre>

Resultado:

```r
library(basedosdados)
data <- basedosdados::read_sql("
SELECT
  *
FROM
  `basedosdados.br_bcb_sicor.microdados_operacao`
LIMIT 100
")
```

#### SQL

<pre>
```sql
SELECT
  *
FROM
  `basedosdados.br_bcb_sicor.microdados_operacao`
LIMIT 100
```
</pre>

Resultado:

```sql
SELECT
  *
FROM
  `basedosdados.br_bcb_sicor.microdados_operacao`
LIMIT 100
```

### Inline code

Inline code é util para citar parte de um código, nome de uma coluna, tabela, variável.

Inlice code é delimitado por crase ao seu redor, \`texto-a\`

Exemplo:

```md
A tabela `escola` tem a granularidade de cada escola por cada ano. A identificação básica de cada unidade é feita pelas variáveis `id_escola` e `ano`.
```

Resultado:

A tabela `escola` tem a granularidade de cada escola por cada ano. A identificação básica de cada unidade é feita pelas variáveis `id_escola` e `ano`.

### Links

Links são adicionandos usando a seguinte sintaxe: `[texto](URL)`

```md
[Acesse o Google](https://www.google.com)
```

Resultado:

[Acesse o Google](https://www.google.com)

> [!WARNING]
> Não coloque a URL no texto, exemplo: `[https://www.google.com](https://www.google.com)`. Sempre adicione um texto informativo

Para adicionar links para outro post ou para um dataset ou tabela use links relativos e não absolutos.

✅ Correto

```md
Veja a análise [Qual a relação das chuvas extremas no RS com as mudanças climáticas?](/blog/qual-a-relacao-chuvas-extremas-no-rs-com-as-mudancas-climaticas)

Acesse os dados no INMET por [aqui](/dataset/782c5607-9f69-4e12-b0d5-aa0f1a7a94e2).
```

❌ Errado

```md
Veja a análise [Qual a relação das chuvas extremas no RS com as mudanças climáticas?](https://basedosdados.org/blog/qual-a-relacao-chuvas-extremas-no-rs-com-as-mudancas-climaticas)

Acesse os dados no INMET por [aqui](https://basedosdados.org/dataset/782c5607-9f69-4e12-b0d5-aa0f1a7a94e2).
```

Utilize links absolutos quando o link aponta para fora da Base dos Dados.

### Imagens

Imagens são adicionadas com o elemento `Image`, ele tem dois campos, `src` e `caption`. `src` é o caminho para imagem que está na pasta `next/public/blog/<slug>/`.

Exemplo:

```md
<Image src="/blog/analisando-frota-brasileira/image_1.webp" caption="Fonte: Rawpixel"/>
```

`caption` é opcional e pode ter link

```md
<Image src="/blog/analisando-frota-brasileira/image_1.webp" caption="Fonte: [Rawpixel](https://www.rawpixel.com/)"/>
```

### Tabelas

```md
| Tables        |      Are      |  Cool |
| ------------- | :-----------: | ----: |
| col 3 is      | right-aligned | $1600 |
| col 2 is      |   centered    |   $12 |
| zebra stripes |   are neat    |    $1 |
```

Resultado:

| Tables        |      Are      |  Cool |
| ------------- | :-----------: | ----: |
| col 3 is      | right-aligned | $1600 |
| col 2 is      |   centered    |   $12 |
| zebra stripes |   are neat    |    $1 |

### Citação

Citação é feita usando o elemento `Blockquote`. O atributo `caption` é opcional e pode ter link, assim como elemento `Image`

```md
<Blockquote caption="Natália Leão, Diretora de pesquisa e projetos na Gênero e Número.">
Atualmente estamos vivendo um momento importante de mudanças culturais no que se refere ao modo de pensar do brasileiro, aos seus aspectos morais e de valores. Com isso temos conquistado muitos avanços no que tange às desigualdades de gênero e raça, e devemos sempre nos perguntar se essas desigualdades são permanentes ou se tivemos mudanças ao longo dos anos.
</Blockquote>
```

### Embed (Incoporar)

Para incoporar _iframes_, como vídeos do youtube, twitter ou qualquer outro recurso de terceiros utilize o elemento `Emdeb`. Ao contrário do elemento `Image` o código de incorporação é colocado _dentro_ do elemento `Embed`.

O atributo `caption` é opcional e pode ter link, assim como `Image`

```md
<Embed caption="Legenda é opcional">
Código do incoporação aqui
</Embed>
```

Exemplo para um vídeo do YouTube:

```md
<Embed caption="Alguma descrição para o vídeo, esse campo é opcional">
<iframe width="560" height="315" src="https://www.youtube.com/embed/LlZ0ADyswdQ?si=uTAHzxVjVRNfjtD6" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</Embed>
```

### Enviando para revisão

Ao finalizar o post, confira se você está na sua branch (e não em `main`):

```sh
git branch --show-current
```

Adicione os arquivos do seu post (o markdown e a pasta de imagens)

```sh
git add next/blog next/public/blog
```

Crie um commit

```sh
git commit -m "blogpost: sua mensagem"
```

Envie a branch

```sh
git push -u origin docs/post-nome-do-post
```

Por último abra um [pull request](https://docs.github.com/pt/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request) para a branch `main` no [repositório do website da Base dos Dados](https://github.com/basedosdados/website). Iremos revisar seu post.

> [!NOTE]
> Pessoas da equipe seguem o [fluxo de trabalho com Git Flow](https://github.com/basedosdados/website/wiki/Fluxo-de-trabalho): a mesma branch é aberta em três PRs (`development`, `staging` e `main`) e nunca é mesclada com squash.
