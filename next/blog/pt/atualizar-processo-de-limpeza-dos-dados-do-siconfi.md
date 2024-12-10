---
title: "O Soberano mítico: Processo de limpeza dos dados do Siconfi"
description: Entenda o processo de limpeza e tratamento dessa robusta base com dados de finanças públicas
date:
  created: "2021-11-05T15:00:00"
authors:
  - name: Crislane Alves
    role: Autora
    social: https://medium.com/@s.alvescrislane
thumbnail: /blog/processo-de-limpeza-dos-dados-do-siconfi/image_0.webp
categories: [analise]
medium_slug: >-
  https://medium.com/basedosdados/o-soberano-m%C3%ADtico-processo-de-limpeza-dos-dados-do-siconfi-a730007e2852
published: false
---

<Image src="/blog/o-soberano-mitico-processo-de-limpeza-dos-dados-do-siconfi/image_0.webp" caption="Photo by [Slejven Djurakovic](https://unsplash.com/@slavudin) on [Unsplash](https://unsplash.com/)"/>

## TL;DR

Os dados de Finanças Municipais do Governo Federal, disponibilizados pelo Sistema de Informações Contábeis e Fiscais do Setor Público Brasileiro ([Siconfi](https://siconfi.tesouro.gov.br/siconfi/index.jsf)), já estão tratados e padronizados no [datalake público](https://console.cloud.google.com/bigquery?p=basedosdados&d=br_me_siconfi&t=municipio_receitas_orcamentarias&page=table) da [Base dos Dados](/), por onde você pode acessá-los e cruzá-los com diversas outras bases de dados públicas. Preparamos esse artigo para detalhar a saga épica que foi o processo de limpeza e tratamento desses dados.

O Siconfi foi desenvolvido como um instrumento para, dentre outros objetivos, facilitar a produção e análise de informações contábeis e fiscais, padronizar os mecanismos de consolidação e aumentar a qualidade e confiabilidade das informações contábeis, financeiras e de estatísticas fiscais recebidas dos municípios, estados, Distrito Federal e União. A base contempla tabelas de despesas e receitas orçamentárias, com colunas por ano, sigla UF, município, estágio e portaria.

## Finbra x Siconfi

O [Finbra](https://www.gov.br/tesouronacional/pt-br/estados-e-municipios/dados-consolidados/finbra-financas-municipais) é um banco de dados abertos do Governo Federal que disponibiliza as informações enviadas pelos entes da Federação com respeito à execução orçamentária e financeira dos municípios, publicadas anualmente pelo Tesouro Nacional. É possível extrair, a nível municipal, informações como: Receitas e Despesas Orçamentárias, gasto com Educação, Tecnologia, Saúde, etc.

Posteriormente, em 2014, foi criado o Siconfi e os dados do Finbra passaram a ser disponibilizados através dele. Antes de entrar nos detalhes do processo de limpeza, precisamos explicar alguns pontos a respeito desses dois conjuntos de dados.

## Considerações sobre os conjuntos de dados

### A forma estrutural em que os dados são disponibilizados.

A série, como já informado, está dividida em dois grupos: i) Finbra, que compreende os dados de 1989 até 2012; e, ii) Siconfi, que possui os dados de 2013–2020. Apesar de se tratar da mesma base, o padrão de arquitetura delas é bem distinto.

#### Alguns detalhes da arquitetura

##### 1989-2012

Esses dados são encontrados no site do [Tesouro Nacional](https://www.tesourotransparente.gov.br/publicacoes/finbra-dados-contabeis-dos-municipios-1989-a-2012/2012/26?page_p=1), disponibilizados em Access, no formato wide e em tabelas individuais. Para alguns anos, a mesma conta é dividida em vários datasets, como é possível ver na Figura 1. Por exemplo, a tabela de Receita Orçamentária para 1989 é separada no Quadro1–89, Quadro2–89, Quadro3–89.

<Image src="/blog/o-soberano-mitico-processo-de-limpeza-dos-dados-do-siconfi/image_1.webp" caption="Figura 1"/>

Essa tabelas são apresentadas assim:

<Image src="/blog/o-soberano-mitico-processo-de-limpeza-dos-dados-do-siconfi/image_2.webp" caption="Figura 2"/>

##### 2013-2020

Esses dados podem ser encontrados no endereço eletrônico do [Siconfi](https://siconfi.tesouro.gov.br/siconfi/index.jsf), no formato _long_ e em `.csv`. Esta estrutura é mais organizada que as tabelas 1989–2012, no entanto, apresenta algumas inconsistências entre anos.

Essas tabelas são apresentadas assim:

<Image src="/blog/o-soberano-mitico-processo-de-limpeza-dos-dados-do-siconfi/image_3.webp" caption="Figura 3"/>

#### Terminado o processo de compatibilização, chamamos a base inteira de Siconfi

Isso se deve, principalmente, porque a série hoje é continuada pelo Siconfi e porque todo o processo de compatibilização levou em consideração o padrão da BD, além do já estabelecido pela arquitetura do Siconfi.

## O processo de limpeza e compatibilização

O maior desafio no processo de limpeza foi criar uma série temporal única entre 1989 até 2020 e, para isso, tivemos que compatibilizar as arquiteturas. Mas, como aqui já exposto, essas são muito distintas. Dessa forma, o processo de compatibilização exigiu muitos passos, que serão abordados nesta seção.

### Adição de ID Município para os anos de 1989-2012

Como as tabelas vinham apenas com o nome dos municípios, tanto para entrar no padrão da BD, quanto para compatibilizar com 2013–2020, precisaríamos adicionar ID Munícipio — 7 dígitos do IBGE. No entanto, não foi uma tarefa fácil, já que o nome dos municípios mudam **intra e entre** anos. Como já descrito, para alguns anos a mesma conta era dividida em vários datasets e, em alguns casos, o nome dos municípios eram diferentes para cada uma delas.

Por exemplo:

- Tabela de Receita para um ano X.

  - quadro1 = RIO DE JANEIRO

  - quadro2 = RIO DE JANEIRO-RJ

  - quadro3 = RIO DE JANEIRO/RJ

- Tabela de Receita para um ano Xn.

  - quadro1 = Rio deJaneiro

  - quadro2 = RÍO DE JANEIRO — RJ

Por vezes, as siglas dos municípios estavam erradas e/ou o nome dos municípios desatualizados.

Então, iniciamos um processo muito longo de limpeza de tipos (acentos, pontos, espaços), atualização de nomes, siglas etc. No entanto, boa parte desta etapa foi manual para mais de 100 arquivos. Posteriormente, foi possível fazer a compatibilização por meio de joins com a tabela de [Diretórios Brasileiros](/dataset/b5878df7-e259-44bc-8903-4feb8d56945a) construída pela BD.

### Compatibilização das portarias e estágios

A partir de 2002, as contas passaram a ser veiculadas pela Portaria 163 e seguem assim até 2020. A portaria fornece IDs que, além de identificarem cada conta unicamente, também são importantes para compreender a árvore da natureza contábil das contas.

Nesta etapa tivemos alguns desafios, porque as tabelas apresentam problemas como: (1) os dados de 1989–2012 são disponibilizados de forma individual, ou seja, os IDs não vêm anexados às tabelas, (2) como a portaria começa a vigorar em 2002, os anos de 1989–2001 — evidentemente — não são cobertos por ela, (3) não há consistência entre e, às vezes, intra anos e (4) os nomes das contas também não eram consistentes entre anos.

Os passos para solucionar esses desafios foram:

1. Empilhar todas as tabelas de 1989–2020 com as colunas originais: ano, conta, estágio e portaria.
2. Padronizar o nome de todas as contas entre anos.
3. Criar IDs que identificassem contas de forma consistente entre/intra anos.
4. Criar a coluna de estágios para os anos que não o tinham (1989–2012).
5. Padronização de moeda.

Todos esses passos precisaram ser feitos separadamente para todas as tabelas (Receita Orçamentária, Despesa Orçamentária, Despesa por função).

### Passo 1: Empilhar todas as tabelas de 1989–2020 com as colunas originais

Criamos uma planilha auxiliar e empilhamos, de forma manual, todos os dados em seu formato original. Essa planilha auxiliar serviria mais tarde para realizar os _merges_ necessários à padronização.

### Passo 2: Padronizar nome das contas entre anos

Posteriormente, tanto para retroagir os IDs para os anos de 1989–2001, quanto para compatibilizá-los entre anos, precisávamos padronizar o nome de todas as contas.

Então, criamos na planilha auxiliar a coluna `conta_bd` (Conta — Base dos Dados), que compatibilizou todos os nomes de modo que uma conta terá o mesmo nome para todos os anos. Segue um exemplo na figura abaixo:

<Image src="/blog/o-soberano-mitico-processo-de-limpeza-dos-dados-do-siconfi/image_4.webp" caption="Figura 4"/>

Toda esta padronização foi feita de **forma manual**, para todas as contas, anos e estágios. Ou seja, mais de 1000 contas foram compatibilizadas **linha a linha** ao longo do processo.

### Passo 3: Criar IDs que identificassem contas de forma consistente entre/intra anos

Feito isso, começamos a criar os IDs que identificassem contas de forma consistente intra e entre anos. Como já dito, além de identificar cada conta unicamente, estes IDs também garantem a estrutura de soma entre as contas. No entanto, não existe consistência nestes IDs, inclusive intra anos.

As inconsistências na base original não permitiam que todos os IDs originais fossem mapeados. Então, optamos por pegar as contas mais altas das tabelas, e que se repetem entre os anos e criar, **baseado na portaria original mais recente**, o `id_conta_bd` (ID Conta — Base dos Dados). O ID da Base dos Dados permite a identificação e estrutura de soma de todas as contas, **até o terceiro nível**, intra e entre anos, além de ter sempre 8 dígitos para todas as tabelas e contas. Vejam um exemplo:

<Image src="/blog/o-soberano-mitico-processo-de-limpeza-dos-dados-do-siconfi/image_5.webp" caption="Figura 5"/>

Aqui temos todas as Receitas Correntes, com o `id_conta_bd` identificando todas as contas e anos. Vejam que existem muitas inconsistências nas portarias, ausências, mudança de nível e número de dígitos, por exemplo. Por outro lado, o `id_conta_bd` padroniza toda a série mantendo a consistência de IDs e nomes.

### Passo 4: Criar a coluna de estágios para os anos que não o tinham (1989–2012)

Os dados disponibilizados pelo Siconfi vinham com o estágio de cada conta, por exemplo, Despesas Empenhadas e Despesas Pagas para a tabela de Despesas Orçamentárias. No entanto, os dados do Finbra não vinham com essa categorização. Então, com base nas informações disponíveis na [Cartilha do Finbra](https://siconfi.tesouro.gov.br/siconfi/pages/public/conteudo/conteudo.jsf?id=21904), retroagimos os estágios das contas para todas as tabelas, de forma que houvesse estágio de 1989 até 2020.

### Passo 5: Padronização de moeda

Por fim, entre 1989 e 1994 o Brasil teve 4 moedas vigentes, são elas: Cruzado, Cruzado Novo, Cruzeiro e Cruzeiro Real, além da medida provisória à implementação do Real, a Unidade Real de Valor (URV).

Assim, tivemos que fazer a conversão das moedas que antecederam ao Real, uniformizando o padrão monetário de toda a série. Vale destacar que não deflacionamos os valores, apenas convertemos o que não era Real para Real.

## Considerações finais

Depois de todos esses processos, pesquisas e, principalmente, de uma ampla cooperação, sem a qual seria muito mais difícil finalizá-la, finalmente conseguimos disponibilizar essa base ao público. É válido salientar que esses foram apenas os procedimentos passíveis de serem descritos, muito mais foi realizado para que a entrega pudesse ser feita. Esta base foi, de algum modo, desafiadora para todos os que trabalharam nela.

Alguns momentos foram muito similares a trecho do filme “Em Busca do Cálice Sagrado”, do Monty Python, em que o rei Artur se encontra com Cavaleiro Negro e trava uma quase-épica batalha. No entanto, a confusão era tanta que não sabíamos se éramos Artur ou Cavaleiro Negro.

No mais, as dificuldades aqui apresentadas reforçam não só o padrão de qualidade da [Base dos Dados](/), mas também o comprometimento e senso de responsabilidade da Instituição com o propósito de democratizar o acesso a dados no Brasil.

Você pode encontrar o dataset do Siconfi pronto para uso neste [link](/dataset/5a3dec52-8740-460e-b31d-0e0347979da0?table=ee51f2d3-c5fb-4ff3-a6e2-fe4bbdcc46c8).
