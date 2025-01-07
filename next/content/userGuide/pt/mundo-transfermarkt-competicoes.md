---
title: Guia de uso de dados de Campeonatos de Futebol
description: >-
  Guia de uso de dados de Campeonatos de Futebol. Este material contém informações sobre as variáveis mais importantes, perguntas frequentes e exemplos de uso do conjunto.
date:
  created: "2024-11-28T18:18:06.419Z"
thumbnail: 
categories: [guia-de-uso]
authors:
  - name: Laura Amaral
    role: Texto
---

# Considerações para análises
## Fontes e compilação dos dados
As tabelas apresentam informações compiladas pelo Transfermarkt. Para entender como essas estatísticas foram realizadas e estruturadas, é necessário revisar os métodos de compilação


# Limitações
* As tabelas contem as informações que estão disponíveis no site do transfermark e que foram selecionadas pela nossa equipe para aparecer. Caso considere que alguma informação seria muito útil para sua análise não está disponível nessa base, mas está disponível no site do transfermarkt, por favor entre em contato para que a gente fique sabendo! 

# Inconsistências
Ainda não foram reportadas inconsistências

# Observações ao longo tempo
Cada linha representa um jogo, assim é possível acompanhar a evolução de um time ao longo de uma temporada, ou ainda ao longo dos anos.

# Linhas duplicadas
Ainda não foram encontrados indícios de linhas duplicadas nas tabelas desse conjunto

# Cruzamentos
As tabelas de copa_brasil e brasileirao_serie_a podem ser cruzadas através das colunas de time_mandante e time_visitante. Além disso, essas tabelas não tem muitos cruzamentos com outras do datalake. É possível utilizar as informaçoes temporais (ano e data) para alguns casos.

# Download dos dados
Essas tabelas são pequenas, assim é possível fazer o download dos dados diretamente da plataforma


# Instituição responsável
Transfermarkt.com

# Instrumento de coleta
O Transfermarkt obtém informações detalhadas sobre jogos de futebol por meio de uma combinação de fontes:
* Equipe de Dados: Uma equipe dedicada de mais de 50 entusiastas do futebol de diversas partes do mundo realiza pesquisas detalhadas e atualiza constantemente as informações
* Contribuições da Comunidade: Usuários registrados podem propor correções e atualizações.
* Fontes Oficiais e Parceiros: O site também utiliza dados de fontes oficiais, como ligas, federações e clubes, além de parceiros especializados em estatísticas esportivas.
  
# Mudanças na coleta
Os dados coletados mudaram bastante ao longo do tempo. Entre 2003 e 2006, os dados preenchidos eram básicos, como datas, estádios, rodadas e placares. Informações sobre árbitros, público, técnicos e estatísticas de jogo estavam completamente ausentes.
A partir de 2007, o preenchimento começou a expandir, com a inclusão dos árbitros e, gradualmente, técnicos e colocações dos times. Dados de público começaram a aparecer consistentemente em 2012, enquanto estatísticas financeiras e demográficas, como valores de equipes e idades médias, passaram a ser mais detalhadas entre 2013 e 2016.
De 2017 em diante, a base atingiu alto nível de completude, cobrindo estatísticas detalhadas, como chutes, escanteios, defesas e impedimentos. No entanto, em 2024, observou-se um leve declínio em algumas colunas, como público máximo e estatísticas de jogo, embora a base continue significativamente mais completa do que nos primeiros anos. 

# Atualizações
Os dados são atualizados na fonte oficial de maneira constante, como os dados não são todos automatizados, não existe um padrão. Na BD atualizamos os dados os dados da última rodada semanalmente

# Tratamentos feitos pela BD:
A BD faz um processo de webscrapping no site da transfermarkt. Nosso padrão é não fazer alterações nos dados coletados. Se quiser avaliar como é feito nosso webscrapping o código está aqui: https://github.com/basedosdados/pipelines/blob/main/pipelines/datasets/mundo_transfermarkt_competicoes/utils.py#L371 . O código completo da pipeline (com outras coisas além da extração como checagem para atualizações, subida dos dados no bigquery, materialização via dbt e rodar testes de qualidade nos dados) está aqui: https://github.com/basedosdados/pipelines/blob/main/pipelines/datasets/mundo_transfermarkt_competicoes/flows.py

# Materiais de apoio
* [FAQ da transfermarkt](https://www.transfermarkt.com/intern/faq) 
* [Processo de inserção de dados da transfermarkt](https://www.transfermarkt.us/intern/datenpflegeGuide)
