---
title: Guia de uso dos dados de Eleições Brasileiras
description: >-
  Guia de uso dos dados de Eleições Brasileiras. Este material contém informações sobre as variáveis mais importantes, perguntas frequentes e exemplos de uso do conjunto.
date:
  created: "2024-11-28T18:18:06.419Z"
thumbnail: 
categories: [guia-de-uso]
authors:
  - name: Laura Amaral
    role: Texto
---
# Introdução
Por ter mais de 20 tabelas, este conjunto pode parecer complexo à primeira vista. Para facilitar, organizamos as informações em grupos temáticos e detalhamos o conteúdo de cada tabela

## Candidatos
- **`candidato`**: Tabela de microdados. Cada linha representa uma candidatura em uma eleição. As colunas contêm informações sobre características da candidatura e características do candidato.  
- **`bens_candidato`**: Tabela de microdados. Cada linha representa um item declarado de um candidato em uma eleição. Isso significa que, se um candidato estiver se candidatando mais de uma vez, provavelmente terá itens repetidos entre eleições. As colunas descrevem o item e o seu valor
- **`despesas_candidato`**: Tabela de microdados. Cada linha representa uma nota fiscal de despesa de um candidato em uma eleição. As colunas descrevem a despesa.  
- **`receitas_candidato`**: Tabela de microdados. Cada linha representa uma entrada para a campanha em uma eleição para um candidato. As colunas disponibilizam características da receita, como informações sobre o doador e informações fiscais da doação.  
- **`resultados_candidato`, `resultados_candidato_municipio`, `resultados_candidato_municipio_zona`, `resultados_candidato_secao`**: Essas quatro tabelas são agregações e têm uma estrutura parecida. Em cada uma delas, cada linha representa o resultado que um candidato teve em uma eleição. A diferença entre as tabelas é o nível de agregação da informação: total da eleição, total por município, por zona ou por seção. As colunas indicam o total de votos que o candidato teve, as caracteristicas do cargo e se ele foi eleito ou não.  

## Partidos
- **`resultados_partido_municipio`, `resultados_partido_municipio_zona`, `resultados_partido_secao`**: Essas três tabelas são agregações têm uma estrutura parecida. Cada linha representa o resultado que um partido teve para um determinado cargo em uma eleição. A diferença entre as tabelas é o nível de agregação da informação: por município, por zona ou por seção. As colunas indicam o total de votos que o partido teve, separando entre votos nominais e votos na legenda.  
- **`partidos`**: Tabela de microdados. Cada linha representa um partido em um recorte eleitoral em uma eleição. As colunas indicam a situação da legenda e coligações ou federações feitas para cada cargo.  
- **`receitas_comite` e `receitas_orgao_partidario`**: Essas duas tabelas são de microdados têm uma estrutura parecida. Cada linha representa uma entrada para a campanha em uma eleição. A diferença entre essas tabelas é a entidade que recebe a receita: um comitê ou um órgão partidário. As colunas disponibilizam características da receita, como informações sobre o doador e informações fiscais da doação.

## Informações gerais sobre as eleições
- **`detalhes_votacao_municipio`, `detalhes_votacao_municipio_zona`, `detalhes_votacao_secao`**: Essas três tabelas são agregações e têm uma estrutura parecida. Cada linha representa os detalhes da votação de uma eleição. A diferença entre as tabelas é o nível de agregação da informação: por município, por zona ou por seção. As colunas indicam o total de abstenção e de votos por tipo.  
- **`perfil_eleitorado_local_votacao`, `perfil_eleitorado_municipio_zona`, `perfil_eleitorado_secao`**: Essas três tabelas são agregações e têm uma estrutura parecida. Cada linha representa um estrato do perfil sociodemográfico dos eleitores (descrito por gênero, idade, estado civil e instrução). A diferença entre as tabelas é o nível geográfico da agregação: por município, por zona ou por seção. As colunas indicam o perfil sociodemográfico, a situação em relação à biometria e o total de eleitores.  
- **`local_secao`**: Tabela de microdados. Cada linha representa uma seção eleitoral em um ano. Essa é a única tabela que não foi disponibilizada pelo TSE, mas elaborada por uma organização externa. As colunas representam diferentes estimativas para o ponto geográfico de cada seção eleitoral.  
- **`vagas`**: Tabela agregada em que cada linha representa um cargo em uma unidade eleitoral em uma eleição. As colunas indicam o total de vagas para aquele cargo.


# Considerações para análises
## Repasses entre candidatos na tabela de receitas
Na tabela de receitas, é importante considerar que, às vezes, candidatos repassam verbas entre si, o que faz com que uma receita apareça mais de uma vez.  

## Coluna id_candidato_bd
A coluna `id_candidato_bd` foi desenvolvida internamente pela BD com o objetivo de identificar candidatos entre eleições. Nossa metodologia conseguiu identificar todos os candidatos unicamente em 99,5% dos casos. No entanto, como as tabelas possuem alguns dados mais antigos sem CPF ou outros identificadores, em alguns casos raros, ao comparar um ano recente com um mais antigo, pode ocorrer de haver dois identificadores para o mesmo candidato.  

## Coluna id_municipio
Alguns id_municipio tem código nulo, isso acontece pois o tse também tem registro de municipios no exterior e não existe código IBGE para municipios externos, nseses casos apenas o id_municipio_tse está preenchido

## Situação do candidato
Para analisar apenas os candidatos que concorreram em uma eleição incluir um filtro que verifique a coluna `situacao = 'deferida'

# Limitações
* A estrutura e o detalhamento das tabelas podem variar entre anos ou pleitos, o que dificulta análises temporais ou comparações históricas.
* As tabelas podem conter inconsistências, valores ausentes ou problemas de duplicidade, principalmente em informações coletadas de forma descentralizada, como as relacionadas a prestação de contas.
* As tabelas não incluem informações de eleições para o conselho tutelar

# Inconsistências
* Alguns candidatos tem a coluna de título eleitoral com valor nulo
* Até 2008 o sequencial candidato não é único para cada candidato dentro da mesma eleição

# Observações ao longo tempo
Para facilitar o acompanhamento dos candidatos ao longo dos anos, a BD desenvolveu o id_candidato_bd. Esse identificador único permite rastrear indivíduos de maneira consistente, superando a limitação de outros IDs associados, que frequentemente mudam de um pleito para outro.

Para acompanhar os partidos ao longo dos anos é necessário se atentar a mudanças de nome e fusões entre partidos.

# Linhas duplicadas
As linhas duplicadas desse conjunto são removidas antes de subirem ao datalake da BD

# Cruzamentos
Para cruzar informações é importante se atentar quais colunas identificam unicamente cada entidade e cada tabela
## Candidaturas
  * Para cruzar informações dentro de uma mesma eleição as colunas ano, tipo_eleição e sequencial_candidato formam uma chave robusta para informações a partir de 2010
  * Para períodos anteriores a 2008 é possível construir uma chave com titulo_eleitor, ano e tipo_eleição, porém essa combinação não é perfeita por conta de algumas candidaturas terem o titulo_eleitor vazio
## Zonas 
Para formar uma chave única de zona é necessário usar as colunas ano, id_municipio_tse e zona. As zonas podem mudar entre anos e tem identificadores que são únicos apenas dentro do seu município
## Seção 
Para formar uma chave única de seção é necessário usar as colunas ano, id_municipio_tse, zona e seção. As seções podem mudar entre anos e tem identificadores que são únicos apenas dentro de um municipio e uma zona
## Partido
Os partidos são identificados unicamente pela sigla_partido e  pelo número_partido.

# Download dos dados
Essas tabelas costumam ser muito grandes para o download direto, é muito importante fazer seleção de colunas e filtros temporais ou geográficos antes de fazer o download dos dados

# Instituição responsável
Tribunal Superior Eleitoral (TSE) 

# Instrumento de coleta
Como esse conjunto possui muitas tabelas elas tem instrumentos de coleta diferentes entre si. Aqui descrevemos os principais. 

## Sistema de Candidaturas (CAND) 
Este é o sistema oficial utilizado para o registro das candidaturas. Por meio dele, partidos políticos e coligações inserem dados pessoais, informações sobre filiação partidária, certidões criminais e outras documentações necessárias para formalizar a candidatura.  

## Sistema de Prestação de Contas Eleitorais (SPCE)
Candidatos e partidos utilizam este sistema para registrar todas as movimentações financeiras da campanha, incluindo arrecadações (receitas) e gastos (despesas). O SPCE assegura que as informações sejam prestadas de forma padronizada e dentro dos prazos estabelecidos pela Justiça Eleitoral.  

## Resultados eleitorais
Após o encerramento da votação, cada urna eletrônica gera um Boletim de Urna, que contém os resultados apurados naquela seção eleitoral. Esses boletins são fundamentais para a totalização dos votos e servem como instrumento de transparência, permitindo que partidos e cidadãos acompanhem os resultados de cada urna. Os dados dos Boletins de Urna são transmitidos para os Tribunais Regionais Eleitorais (TREs) e, posteriormente, para o TSE, onde são totalizados para a divulgação dos resultados finais das eleições.  

## Perfil dos eleitores  
Durante o alistamento eleitoral e em processos de revisão cadastral, os eleitores fornecem informações pessoais, como nome, data de nascimento, gênero, grau de instrução e endereço. Esses dados são inseridos no Cadastro Nacional de Eleitores pelos cartórios eleitorais.  

# Mudanças na coleta
Ao longo dos anos, o sistema eleitoral passou por diversas mudanças, refletidas nos dados coletados. Segue uma lista das principais mudanças para se atentar:
    * 1997: Inclusão de informações sobre gênero.
    * 1998: Divulgação de CPF dos candidatos.
    * 2014: Inclusão de informações sobre raça ou cor.
    * 2016: Proibição de doações por CNPJs, as tabelas de receitas passaram a conter apenas CPFs doadores
    * 2022: Coleta de dados sobre transgeneridade.
    * 2024: CPF dos candidatos não é mais divulgado

# Atualizações
A maior parte dos dados só é atualizado de 2 em 2 anos a cada nova eleição regular. As informações de receitas e despesas são atualizadas todos os dias em época de campanha eleitoral.

# Tratamentos feitos pela BD:

#### Coluna: `data_nascimento` 
Anulamos qualquer data que o candidado tenha uma idade maior de 120 anos ou menor de 18 anos

#### Coluna: `tipo_eleicao`

`eleicoes municipais` são colocadas como `eleicao ordinaria`

#### Colunas: `tipo_eleicao`, `cargo`, `situacao`, `ocupacao`, `genero`, `instrucao`, `estado_civil`, `nacionalidade`, `raca`..

São retirados acentos, espaços excessivos e colocado tudo em minusculo para uma padronização dos dados.

#### Tratamentos Pontuais
- Troca de `brasileira nata` para `brasileira` na coluna `nacionalidade`
- "#NULO", "#NULO#", "#NE", "NÃO DIVULGÁVEL", "Não Divulgável", "-1", "-4", "-3". São todos substitudos por valores nulos.
- Linhas de dados que são completamente identicas são removidas em todas as tabelas.
- Alguamas tabelas apresentam zeros a esquerda em colunas com [IDs IBGE][ids-ibge] de municípios. Para conectar com o nosso [diretorio][diretorio-municipios] esses zeros a esquerda foram removidos.
- Dados originalmente estão com um `encoding` de [`ISO-8859-1`][iso]. Depois do tratamento eles são salvo como `utf-8`

#### Codigos de Tratamento:
- [Pipeline][code-pipeline]
- [Notebook][code-notebook]
- [Stata][code-stata]

# Materiais de apoio
* [Site de dados abertos do TSE](https://dadosabertos.tse.jus.br/dataset/): Arquivos disponíveis apra downaload quebrados por ano e unidade da federação. Possui também dicionários de dados com especificações mais detalhadas de cada coluna
* [Painel de estatítiscas eleitorais do TSE](https://sig.tse.jus.br/ords/dwapr/seai/r/sig-eleicao/home?session=17112009236550): Painel com uma grande diversidade de filtros e possibilidades de análise para quem não quer mexer com os dados brutos e completos.
* [Divulgação de Candidaturas e Contas Eleitorais](https://divulgacandcontas.tse.jus.br/divulga/#/home): Painel para consulta de informações sobre cada candidatura. Muito prático para entender a situação de um canditado por vez. Não muito útil para fazer comparações entre diversos candidatos de uma única vez.
* [Siga o dinheiro](https://www.sigaodinheiro.org/): Painel desenvolvido pela BD para entender de onde vem e onde está sendo gasto o dinheiro de campanha.   
* [Curso de Análise de Dados Eleitorais](https://info.basedosdados.org/bd-edu-eleicoes): Criamos um curso personalizado para você aprender desde o contexto e as regras eleitorais, até como criar análises, visualizações e mapas com dados de eleições brasileiras


<!-- variaveis -->

[ids-ibge]: https://www.ibge.gov.br/explica/codigos-dos-municipios.php
[diretorio-municipios]: https://basedosdados.org/dataset/33b49786-fb5f-496f-bb7c-9811c985af8e?table=dffb65ac-9df9-4151-94bf-88c45bfcb056
[iso]: https://pt.wikipedia.org/wiki/ISO/IEC_8859-1
[code-stata]: https://github.com/basedosdados/sdk/tree/master/bases/br_tse_eleicoes/code
[code-pipeline]: https://github.com/basedosdados/pipelines/tree/main/pipelines/utils/crawler_tse_eleicoes
[code-notebook]: https://github.com/basedosdados/queries-basedosdados/blob/main/models/br_tse_eleicoes/code/%5Bdbt%5Dbr_tse_eleicoes.ipynb