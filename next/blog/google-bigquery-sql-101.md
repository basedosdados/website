---
title: Google BigQuery (SQL) 101
description: Acesse diversas bases de dados públicas com uma simples consulta SQL
date:
  created: "2021-04-26"
authors:
  - name: Paolo
    role: Autor
    social: https://dev.to/paolofullone
  - name: Fernanda
    role: Equipe Base dos Dados 💚
    social: https://medium.com/@fernandascovino
thumbnail: /blog/google-bigquery-sql-101/image_0.jpg
categories: [tutorial]
medium_slug: https://medium.com/@basedosdados/bigquery-101-8b39da1ce52b
---

<Image src="/blog/google-bigquery-sql-101/image_0.jpg"/>

## TL;DR

Neste artigo vamos demonstrar como consultar os conjuntos de dados disponíveis no nosso datalake público online através do Google BigQuery. Você irá aprender a avaliar os dados, cruzar tabelas de diferentes conjuntos de dados disponíveis e para isso iremos explicar algumas funções básicas de SQL e BigQuery — ao final do artigo temos inclusive uma super indicação de curso gratuito de SQL.

O texto tem como base o workshop feito por João Carabetta disponível em [nosso canal no Youtube](https://www.youtube.com/basedosdados).

### Introdução

As bases disponíveis para download e análise no nosso site possuem o ícone **BD+** e seus ícones de temas estão na cor azul. Isto significa que a base está disponível no nosso datalake público, ou seja, estes dados já foram tratados pela nossa equipe técnica e são atualizados frequentemente.

Ao longo do texto iremos explorar os dados da [RAIS (Relação Anual de Informações Sociais)](https://basedosdados.org/dataset/3e7c4d58-96ba-448e-b053-d385a829ef00?table=86b69f96-0bfe-45da-833b-6edc9a0af213), mas o processo é o mesmo para qualquer base que você desejar acessar. A RAIS é um relatório de informações socioeconômicas solicitado pela Secretaria de Trabalho do Ministério da Economia brasileiro às pessoas jurídicas e outros empregadores anualmente.

<Image src="/blog/google-bigquery-sql-101/image_1.png"/>

Através do site, após escolher o conjunto de dados de interesse, você pode visualizar **Tabelas já tratadas** neste conjunto. No caso da RAIS, temos disponíveis toda a série histórica de microdados de vínculos empregatícios no Brasil, e tabelas de agregações destes dados.

Para explorar uma tabela em específico, você deve clicar nela e a seção Consultar Dados irá te redirecionar ao Editor de consultas dentro do Google Cloud — essa é a ferramenta que iremos explorar hoje.

### Antes de começar:

> Se já tiver um projeto no Google Cloud, siga em frente. Caso contrário, após clicar no botão você verá a página abaixo — basta clicar em Criar um projeto (é gratuito) e já terá acesso às nossas bases.

<Image src="/blog/google-bigquery-sql-101/image_2.jpg"/>

## Navegando pelo BigQuery

Abaixo vamos entender melhor como funciona a interface do BigQuery. Após criar o projeto, ele vai aparecer para você no canto superior esquerdo **(1)**. Logo abaixo terá uma lista de Projeto fixos do BigQuery, dentre esses o `basedosdados` **(2)** - o ícone de pino azul indica que o projeto está fixado e poderá ser acessado sempre que você abrir o BigQuery. A seta à esquerda do nome `basedosdados` nos permite expandir a lista de todas as bases disponíveis na BD+ logo abaixo.

<Image src="/blog/google-bigquery-sql-101/image_3.png"/>

Neste exemplo acessamos a página dos dados da RAIS. Sempre que abrirmos uma tabela no BigQuery teremos alguns itens que ficarão à mostra: a aba referente à tabela que selecionamos **(3)** que contém informações sobre a estrutura e descrição das colunas em **Esquema (4)** e também metadados da tabela em **Detalhes (5)**.

Por fim, para visualizar os dados da tabela criamos uma nova **Consulta (6)**, que irá abrir um novo Editor com a estrutura em SQL já com as informações da nossa tabela.

## Explorando os metadados da RAIS

- Na RAIS podemos ver entre as colunas disponíveis a `sigla_uf`, `id_município` (código IBGE), tipo de vínculo empregatício, tipo de admissão, mês de admissão, mês de desligamento, motivo de desligamento etc.
- Todos os dados podem ser filtrados por região, período, nacionalidade, raça, salários etc.

## Utilizando o Editor de consultas em SQL

Após selecionarmos em Consulta na página anterior, o BigQuery irá nos fornecer uma nova interface para escrita das instruções em SQL. A estrutura básica criada segue abaixo:

```sql
SELECT FROM `basedosdados.br_me_rais.microdados_vinculos` LIMIT 1000
```

Essa estrutura mínima indica que iremos selecionar (`SELECT`) alguma(s) coluna(s) ou agregações (_temos que indicar aqui quais serão_) da tabela de microdados (`FROM basedosdados.br_me_rais.microdados_vinculos`) e queremos só visualizar as 1000 primeiras linhas (`LIMIT 1000`).

> Atenção: Esse limite é importante para não processarmos a tabela inteira, caso contrário, seriam 250GB de dados! Conforme tornamos a query mais refinada, adicionando filtros para anos e locais específicos, por exemplo, esse tamanho de processamento se reduz bastante.

<Image src="/blog/google-bigquery-sql-101/image_4.png"/>

Para selecionar todas as colunas da tabela podemos usar o “\*”, ao invés de escrever uma por uma após o `SELECT`. Ao clicar em **Executar (1)** obtemos logo abaixo a tabela de resultado da nossa consulta. Acima da tabela irá aparecer o tamanho do processamento realizado **(2)** e você pode também salvar a tabela gerada em CSV no Drive ou no seu computador no botão de **Salvar resultados (3)** ou **Explorar dados (4)** para criar gráficos com o Google Data Studio - veja o exemplo com os dados da RAIS abaixo.

<Image src="/blog/google-bigquery-sql-101/image_5.png"/>

Vamos usar como exemplo mais completo uma consulta de vínculos empregatícios do estado do Acre e cruzar com os dados de população do IBGE de 1985 até 2019. Essa é uma consulta mais complexa, mas basta sabermos quais são as colunas de pareamento (neste caso, `id_municipio` e ano que fazem o JOIN) entre as tabelas para realizar o cruzamento. Abaixo em vermelho segue a explicação de cada linha da query, você pode acessar o código em SQL também em [nosso Github](https://github.com/basedosdados/analises/blob/main/workshops/br_me_rais_microdados_vinculos_20210526.sql).

<Image src="/blog/google-bigquery-sql-101/image_6.png"/>

## Importante ressaltar:

> Nossas bases sempre terão todos os nomes de colunas chave de identificação padronizados, por exemplo `sigla_uf` é `sigla_uf` em todas as tabelas, o mesmo para ano e `id_municipio` - isso facilita bastante os cruzamentos!

**Esta consulta processou 571 MB de dados em apenas 4 segundos.** A tabela completa da RAIS tem mais de 250 GB. Já imaginou executar no Excel?

Para visualizar o resultado ao longo do tempo podemos criar um gráfico através do botão **Explorar dados** que irá nos redirecionar para uma aba do Google Data Studio, uma ferramenta gratuita de BI do Google. Para saber mais sobre o Data Studio [veja aqui](https://support.google.com/datastudio/answer/6283323?hl=pt-BR).

<Image src="/blog/google-bigquery-sql-101/image_7.png"/>

## Por que usar SQL?

**SQL é uma das linguagens de programação mais simples e poderosas para quem quer mexer com dados.** Saber criar consultas eficientes com filtros, agregações e cruzamentos em SQL salva bastante tempo que você gastaria no Python ou R, por exemplo — e acredite, nós também amamos essas linguagens.

Usar o SQL para pré-processamento de dados é uma ótima saída para quem trabalha com grandes volumes de dados, e construir estatísticas descritivas também é bastante simples. Uma vez com os dados prontos, você pode carregar os dados no Python ou R para rodar modelos e algoritmos mais robustos, [usando inclusive nosso pacote já disponível em ambas as linguagens](https://github.com/basedosdados/mais).

> Quer aprender mais sobre SQL? Temos uma sugestão de um [curso gratuito no Coursera](https://www.codecademy.com/learn/learn-sql) em que você pode aprender praticando, e tem duração média de 8 horas.

**Nosso projeto já te ajudou de alguma forma?** Veja como nos retribuir:

- [Apoie o projeto](https://apoia.se/basedosdados)
- [Seja um(a) colaborador(a) de dados na BD](https://basedosdados.github.io/mais/colab_data/)
- [Colabore com nossos pacotes](https://github.com/basedosdados/mais)
- Compartilhe nas redes sociais!
