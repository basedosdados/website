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
Os dados de eleições brasileiras incluem muitas tabelas. Para facilitar o entendimento desse guia vamos separar elas em 4 grandes grupos 

## Candidatos e vagas
- candidatos
- bens_candidato
- partidos
- vagas

## Prestação de contas
- despesas_candidato
- receitas_candidato
- receitas_comite
- receitas_orgao_partidario

## Resultados
- resultados_candidato
- resultados_candidato_municipio
- resultados_candidato_municipio_zona
- resultados_candidato_secao
- resultados_partido_municipio
- resultados_partido_municipio_zona
- resultados_partido_secao
- detalhes_votacao_municipio
- detalhes_votacao_municipio_zona
- detalhes_votacao_secao

## Eleitorado
- perfil_eleitorado_local_votacao
- perfil_eleitorado_municipio_zona
- perfil_eleitorado_secao
- local_secao

# Considerações para análises
## Repasses entre candidatos na tabela de receitas
Na tabela de receitas, é importante considerar que, às vezes, candidatos repassam verbas entre si, o que faz com que uma receita apareça mais de uma vez.  

## Coluna id_candidato_bd
A coluna `id_candidato_bd` foi desenvolvida internamente pela BD com o objetivo de identificar candidatos entre eleições. Nossa metodologia conseguiu identificar todos os candidatos unicamente em 99,5% dos casos. No entanto, como as tabelas possuem alguns dados mais antigos sem CPF ou outros identificadores, em alguns casos raros, ao comparar um ano recente com um mais antigo, pode ocorrer de haver dois identificadores para o mesmo candidato.  

## Coluna id_municipio
Alguns id_municipio tem código nulo, isso acontece pois o tse também tem registro de municipios no exterior e não existe código IBGE para municipios externos, nseses casos apenas o id_municipio_tse está preenchido

# Limitações
* A estrutura e o detalhamento dos dados podem variar entre anos ou pleitos, o que dificulta análises temporais ou comparações históricas.
* Os dados podem conter inconsistências, valores ausentes ou problemas de duplicidade, principalmente em informações coletadas de forma descentralizada, como as relacionadas a prestação de contas.

# Inconsistências
Ainda não foram reportadas inconsistências nessa base

# Observações ao longo tempo
Para facilitar o acompanhamento dos candidatos ao longo dos anos, a BD desenvolveu o id_candidato_bd. Esse identificador único permite rastrear indivíduos de maneira consistente, superando a limitação de outros IDs associados, que frequentemente mudam de um pleito para outro.

# Linhas duplicadas
As linhas duplicadas desse conjunto são removidas antes de subirem ao datalake da BD

# Cruzamentos
Recomendamos utilizar o id_candidato combinado com o ano para realizar o cruzamento entre as bases de dados. Essa abordagem garante maior precisão na identificação e vinculação das informações.

# Download dos dados
Essas tabelas costumam ser muito grandes para o download direto, é muito importante fazer seleção de colunas e filtros temporais ou geográficos antes de fazer o download dos dados

# Instituição responsável
Tribunal Superior Eleitoral (TSE) 

# Instrumento de coleta
## Sistema de Candidaturas (CAND) 
Este é o sistema oficial utilizado para o registro das candidaturas. Por meio dele, partidos políticos e coligações inserem dados pessoais, informações sobre filiação partidária, certidões criminais e outras documentações necessárias para formalizar a candidatura.  

## Sistema de Prestação de Contas Eleitorais (SPCE)
Candidatos e partidos utilizam este sistema para registrar todas as movimentações financeiras da campanha, incluindo arrecadações (receitas) e gastos (despesas). O SPCE assegura que as informações sejam prestadas de forma padronizada e dentro dos prazos estabelecidos pela Justiça Eleitoral.  

## Resultados eleitorais
Após o encerramento da votação, cada urna eletrônica gera um Boletim de Urna, que contém os resultados apurados naquela seção eleitoral. Esses boletins são fundamentais para a totalização dos votos e servem como instrumento de transparência, permitindo que partidos e cidadãos acompanhem os resultados de cada urna. Os dados dos Boletins de Urna são transmitidos para os Tribunais Regionais Eleitorais (TREs) e, posteriormente, para o TSE, onde são totalizados para a divulgação dos resultados finais das eleições.  

## Perfil dos eleitores  
Durante o alistamento eleitoral e em processos de revisão cadastral, os eleitores fornecem informações pessoais, como nome, data de nascimento, gênero, grau de instrução e endereço. Esses dados são inseridos no Cadastro Nacional de Eleitores pelos cartórios eleitorais.  

# Mudanças na coleta
Diversas mudanças ocorreram ao longos dos anos no sistema eleitoral e isso refletiu nos dados coletados. Informação sobre de genero passaram a ser coletados em 1997, raça ou cor passaram a ser coletados apenas em 2014 e transgeneridade começarou a ser coletada em 2022. Além disso o cpf só começou a ser divulgado a partir de 1998. Um ponto importante de mudança foi com a proibição de doação de campanha de cnpjs a informação de cnpj nas tabelas de receitas pararam de ser preenchidas e apenas as informações de cpf ficaram sendo preenchidas. Na última eleição tivemos uma mudança e o cpf dos candidatos parou de ser divulgado.

# Atualizações
A maior parte dos dados só é atualizado de 2 em 2 anos a cada nova eleição. As informações de receitas e despesas são atualizadas todos os dias em época de campanha eleitoral.

# Tratamentos feitos pela BD:
**O Luiz vai preecher aqui de maneira resumida qual os tratamentos que fazemos, olhar os outros guias como referência**

# Materiais de apoio
* [Painel de estatítiscas eleitorais do TSE](https://sig.tse.jus.br/ords/dwapr/seai/r/sig-eleicao/home?session=17112009236550): Painel com uma grande diversidade de filtros e possibilidades de análise para quem não quer mexer com os dados brutos e completos.