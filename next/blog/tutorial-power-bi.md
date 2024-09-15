---
title: Tutorial Power BI
description:
date:
  created: ''
authors:
thumbnail: /blog/tutorial-power-bi/image_11.gif
categories: [tutorial]
medium_slug: ''
---

## TL;DR

O Power BI é uma das tecnologias mais populares para o desenvolvimento de dashboards com dados relacionais, e a [Base dos Dados](https://www.google.com/url?q=https://basedosdados.org/\&sa=D\&source=editors\&ust=1626396149894000\&usg=AOvVaw2fSCNOCKXtr8yiXoj-Hw3Z) é um dos maiores data lakes públicos do Brasil. Essa combinação é o ambiente perfeito para sua análise e a visualização de dados. Neste artigo, vou te mostrar como é fácil ter acesso às bases de dados da BD para uso no PBI, além de explicar o passo a passo.

<Image src="/blog/tutorial-power-bi/image_0.png"/>

## Conectar ao Google BigQuery

O [Google Bigquery](https://www.google.com/url?q=https://cloud.google.com/bigquery\&sa=D\&source=editors\&ust=1626396176093000\&usg=AOvVaw0Tv_wR9xWDsunWNof6mJbF) é um serviço de banco de dados em nuvem do Google, onde os conjuntos de dados da Base dos Dados estão armazenados dentro de um datalake público — chamado `basedosdados`. Para acessar os dados, necessário criar um projeto (gratuito) no BigQuery caso já tenha um projeto siga para o próximo passo, caso contrário, elaboramos dois tutoriais para te ajudar de forma simples e rápida:

1. [Artigo](https://dev.to/basedosdados/bigquery-101-45pk)
2. [Video](https://www.youtube.com/watch?v=nGM2OwTUY_M)

## Conectar dados no PowerBI (PBI)

Nesse projeto vamos mostrar como conectar os dados da evolução do PIB dos municípios (base fato) e as informações sobre os municípios (base dimensão) no [Power BI](https://powerbi.microsoft.com/pt-br/downloads/) para elaboração de análises. Essa base é usada de exemplo, mas o tutorial serve para qualquer outra base de interesse que esteja no *datalake*.

**Buscando os dados no site**

Para acessar os dados na interface do BigQuery utilizamos queries (consultas) em SQL, uma das linguagens de programação mais básicas e úteis para quem trabalha com dados. No site da Base dos Dados você pode procurar por qualquer base e copiar direto o código SQL, disponível na página da tabela selecionada em “Acesse os dados via BigQuery”, para usar no editor de SQL do Google BigQuery, como mostra no exemplo abaixo. Para aprender mais sobre como usar a linguagem, recomendo o curso gratuito da [Udacity](https://www.udacity.com/course/sql-for-data-analysis--ud198), ou o próprio tutorial do [BigQuery](https://cloud.google.com/bigquery/docs/tutorials).

**Selecionando os dados no BigQuery**

Ainda no site, você pode clicar no botão “Consultar no BigQuery” para ser redirecionado ao [*datalake*](https://console.cloud.google.com/bigquery?p=basedosdados\&page=project). A interface do BigQuery é diferente do site pois é um serviço mantido pelo próprio Google, explicamos mais sobre cada elemento dessa interface neste artigo.

Clicamos então em “Criar nova consulta” e no editor que aparece na tela basta colar o código copiado e rodar. Note que no código explicitamos `LIMIT 100` para puxar somente as 100 primeiras linhas do dado, mas você pode mudar esse parâmetro (ou removê-lo) para puxar mais linhas - pedimos somente que tome cuidado com bases muito grandes (RAIS, Censo Populacional), pois puxar todos os dados de uma vez não só é demorado como também gasta bastante processamento, o que pode acarretar em custos.

<Image src="/blog/tutorial-power-bi/image_1.png"/>

```sql
SELECT
  pib.id_municipio, --selecionar id do municipio
  pop.ano, -- população do muunicipio
  pib.PIB / pop.populacao AS pib_per_capita -- calculo do PIB per capita
FROM `basedosdados.br_ibge_pib.municipio` AS pib -- selecionar base de pib dos municipios
JOIN `basedosdados.br_ibge_populacao.municipio` AS pop -- join com a base de população
ON pib.id_municipio = pop.id_municipio AND pib.ano = pop.ano
LIMIT 100
```

<Image src="/blog/tutorial-power-bi/image_2.png"/>

**Salvando os dados num projeto privado**

Salve a tabela obtida clicando em “Salvar”. Você pode salvar a consulta ou a visualização

<Image src="/blog/tutorial-power-bi/image_3.png"/>

O BigQuery irá te pedir para criar um conjunto de dados onde você pode salvar essa tabela (caso não tenha um). Se já tem maior familiaridade com o PBI, é algo muito similar aos conjuntos de dados do PBI. Dê um nome intuitivo ao seu conjunto No caso da Base dos Dados, organizamos os nomes de conjuntos por abrangência geográfica, instituição e tema do dado, você pode ver mais sobre nossas regras de nomenclatura [aqui](https://basedosdados.github.io/mais/style_data/#nomea%C3%A7%C3%A3o-de-bases-e-tabelas). Esse conjunto é essencialmente uma “pasta”onde ficarão todas as tabelas do seu projeto. Neste exemplo, escolhemos o nome “tutorial” de forma mais genérica.

<Image src="/blog/tutorial-power-bi/image_4.png"/>

Em seguida, selecione o conjunto criado para salvar a base e escolha um nome para sua tabela e clique em Salvar. Simples assim 😊.

<Image src="/blog/tutorial-power-bi/image_5.png"/>

Agora seu projeto irá aparecer na barra lateral esquerda. Clique na setinha do lado do nome do seu projeto, lá vai aparecer seu conjunto de dados com a tabela que você salvou. Se não aparecer, atualize a página.

<Image src="/blog/tutorial-power-bi/image_6.png"/>

Para salvar outra tabela com as informações de municípios (nome, UF, etc), faça o mesmo processo com a query abaixo. Vamos chamar essa tabela de `dMunicipio`, que será salva no mesmo conjunto chamado `tutorial`.

```sql
SELECT
  id_municipio, 
  municipio,
  id_uf,
  uf,
  regiao
FROM `basedosdados.br_bd_diretorios_brasil.municipio`
```

**Importando os dados para o PBI**

* Abra o PBI
* Vá em Obter Dados -> Mais

<Image src="/blog/tutorial-power-bi/image_7.png"/>

* Procure pelo `Google BigQuery` -> Conectar

<Image src="/blog/tutorial-power-bi/image_8.png"/>

* Entre com sua conta do Google. A mesma que fez as consultas no BigQuery. Caso você entre com outra conta não será possível conectar.

<Image src="/blog/tutorial-power-bi/image_9.png"/>

* Permita o acesso ao seu PBI
* Volte ao PBI e clique em conectar
* Selecione a pasta com o nome do seu conjunto de dados
* Selecione as tabelas

<Image src="/blog/tutorial-power-bi/image_10.png"/>

* Clique em carregar
* Selecione Importar\
  Para maioria dos casos não é necessário estar conectado diretamente, além disso não você não fica dependente da conexão com o banco.

Pronto, agora você tem acesso às suas bases da BD para criar seu dashboard. :)

<Image src="/blog/tutorial-power-bi/image_11.gif"/>

Para qualquer sugestão ou dúvidas, fique a vontade para comentar, me procurar pelas redes ou na comunidade da Base dos Dados no [Discord](https://discord.com/invite/huKWpsVYx4).
