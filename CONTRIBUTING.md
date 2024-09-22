# Contribuindo

Obrigado por considerar contribuir com a Base dos Dados. Nesse guia vamos mostrar como contribuir com o website da Base dos Dados.

## Como contribuir

- Melhorias e correções no webiste. Verifique nossas [issues abertas](https://github.com/basedosdados/website/issues) para um ponto de início
- Sugestões de melhorias na interface, typos, design, etc.. Você pode dar feedback ou sugestões em nossas [issues](<(https://github.com/basedosdados/website/issues)>)
- Escrever postagens no nosso blog.

## Iniciando

1. Faça fork desse repositório
   - Desmarque a opção `Copy the main branch only`
2. Clone seu fork
3. Entre no diretório `cd website`

## Adicionando posts

Esse seção cobre o processo de contruição no blog da Base dos Dados. Todas as postagens estão em `next/blog/`, cada post é um arquivo markdown (`.md`) com o caminho da postagem (slug) no nome do arquivo. As imagens de cada postagem está em `public/blog/<slug>` dentro da pasta com o nome do arquivo markdown.

> Exemplo: O arquivo `next/blog/analisando-precos-de-combustiveis-com-a-bd.md` tem uma pasta em `next/public/analisando-precos-de-combustiveis-com-a-bd/` onde todas as imagens de `analisando-precos-de-combustiveis-com-a-bd.md` estão.

Depois de clonar o repo alterne para a branch `blog`

```sh
git switch blog
```

Crie o ramo para escrever seu post

```sh
git switch -c blog/descricao-curta
```

Crie um arquivo markdown em `next/blog/`:

> [!NOTE]
> O nome do arquivo será o caminho do post. Se você criar um arquivo `analisando-precos-de-combustiveis-com-a-bd.md` ele será publicado em `basedosdados.org/blog/analisando-precos-de-combustiveis-com-a-bd`. Por isso evite caracteres como `ç` e acentos, utilize traços `-` para separar as palavras.

O post é escrito em Markdown com algumas diferenças que serão abordadas logo abaixo. Veja a sintaxe básica em [Markdown Guide](https://www.markdownguide.org/basic-syntax/) e em [Markdown Cheat Sheet](https://www.markdownguide.org/cheat-sheet/)

### Metadados

Os metadados dos posts estão em [YAML](https://yaml.org/) em um bloco no topo do arquivo delimitado por `---` e `---`. Preencha os metadadaos do seu post, título, descrição, etc.

- `title`: Título do post
- `description`: Descrição do post
- `date`
  - `created`: Data de criação do post, deve ser uma string `"2024-02-29"` no formato [ISO 8601](https://pt.wikipedia.org/wiki/ISO_8601).
  - `updated` (opcional): Data que o post foi atualizado. Mesmo formato de `created`
- `thumbnail` (opcional): Caminho para uma imagem.
- `categories` (opcional): uma lista com as categorias.
  - As postagens com categoria estarão em `/blog/category/categoryName`
  - Não está definido se um post pode ter mais de uma categoria
- `authors` (recomendado): Uma lista de autores. Cada autor tem o seguintes campos:
  - `name` (obrigatório): Nome do autor
  - `role` (opcional): Qual foi o papel dessa pessoa no post
  - `social` (opcional): Uma URL para alguma rede social da pessoa (github, website, linkedin)
  - `avatar` (opcional): URL para uma imagem

[Exemplo](./next/blog/como-a-disparidade-salarial-por-genero-e-raca-evoluiu-ao-longo-dos-anos.md?plain=1):

```md
---
title: Como a disparidade salarial por gênero e raça evoluiu ao longo dos anos?
description: >-
  Analisando a disparidade salarial por gênero e raça com dados do CAGED e o
  datalake público da BD
date:
  created: "2024-02-29"
thumbnail: /blog/como-a-disparidade-salarial-por-genero-e-raca-evoluiu-ao-longo-dos-anos/image_0.png
categories: [analise]
authors:
  - name: Thais Filipi
    role: Análise e texto
    social: https://www.linkedin.com/in/thaismdr/
    avatar: https://media.licdn.com/dms/image/v2/C4E03AQFstxqWabAyUA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1584489568236?e=2147483647&v=beta&t=mol7Kc8PgxgJatgvNYRkyffL8opuIgFgRdiY7vXB1HA
  - name: Giovane Caruso
    role: Edição de texto
    social: https://www.linkedin.com/in/giovanecaruso/
---

Não é novidade que a desigualdade de gênero e raça reflete na empregabilidade e na remuneração dentro do mercado de trabalho no Brasil. Apesar da legislação que proíbe a disparidade salarial entre indivíduos desempenhando a mesma função, a realidade é que tais disparidades persistem. Recentemente, o Governo Federal tomou medidas para enfrentar esse desafio ao publicar uma portaria que regulamenta a Lei nº 14.611/2023. Essa lei cria mecanismos para equalizar salários entre homens e mulheres ocupando o mesmo cargo em empresas com pelo menos 100 funcionários.

## Análise

### Disparidade salarial entre 2020 e 2023

Ao analisarmos o salário médio por grupos, ficou evidente a vantagem que homens brancos mantêm em relação aos demais. Em 2023, o salário médio dos homens brancos foi de R$2.087, 25,6% maior do que o salário médio das mulheres negras, que foi de R$1.662. Uma forma de visualizar as diferenças é ver o salário médio de homens negros, mulheres negras e brancas enquanto porcentagem do salário médio de homens brancos, como você pode conferir no gráfico abaixo.
```

> [!IMPORTANT]
> Os cabeçalhos iniciam no nível dois `##` ao ínves de um `#`

### Imagens

Imagens são adicionadas com o elemento `Image`, ele tem dois campos, `src` e `caption`. `src` é o caminho para imagem que está na pasta `next/public/blog/<slug>/`.

### Bloco de códigos

Adicione blocos de códigos entre os tripos backtick. Adicione o nome da linguagem na abertura

Exemplo para Python:

<pre>
```python
print("Hello World!!")
```
</pre>

### Tabelas

```md
| Coluna 1  | Coluna 2 |
| --------- | -------- |
| Header    | Title    |
| Paragraph | Text     |
```

### Embed (Incoporar)

Para incoporar _iframes_, como vídeos do youtube, twitter ou qualquer outro _iframe_ utilize o elemento `Emdeb`. Ao contrário do elemento `Image` o código do iframe é colocado _dentro_ do elemento `Embed`.

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

Por último, faça o commit e push das alterações e abra um [pull request](https://docs.github.com/pt/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request). Faremos o review do seu post, fornecer feedback ou alterações.
Assim que estiver pronto iremos mesclar e publicar.
