---
title: Guia de uso do CAGED
description: >-
  Guia de uso do Cadastro Geral de Empregados e Desempregados (CAGED). Este material contém informações sobre as variáveis mais importantes, perguntas frequentes e exemplos de uso do conjunto.
date:
  created: "2024-11-28T18:18:06.419Z"
thumbnail: 
categories: [guia-de-uso]
authors:
  - name: Laura Amaral
    role: Texto
---

# Considerações para análises
## Saldo de movimentações
É fundamental observar a coluna `saldo_movimentacao`, que indica se a linha representa uma demissão ou uma admissão. O crescimento ou redução de empregos em um grupo pode ser determinado pela soma dessa coluna.

## Exclusões e movimentações fora do prazo
Além das movimentações regulares, é importante considerar as tabelas de "Microdados de Movimentações Excluídas" e "Microdados de Movimentações Fora do Prazo". A primeira contém cancelamentos de eventos, como admissões informadas erroneamente e excluídas posteriormente. Esses cancelamentos impactam o saldo do CAGED de forma inversa ao evento original. Já as "Movimentações Fora do Prazo" incluem eventos registrados após o período regular, mas também afetam os resultados.

# Limitações
* Os dados disponibilizados são limitados a trabalhadores com vínculo empregatício formal, não incluindo informações sobre trabalhadores informais ou autônomos.

# Inconsistências
## Coluna `salario_mensal`
Foram identificados valores fora do esperado na coluna salario_mensal, como salários na faixa de milhões de reais para cnaes e cbos que costumeiramente não recebem tanto assim. Acreditamos serem erros de registro ou valores atípicos não tratados

## Painel de empregos do CAGED
Foram identificadas inconsistências entre os dados disponíveis e o painel de empregos do CAGED. Uma possível origem do problema é a falta, em nossos dados, da coluna que especifica o mês de referência para movimentações fora do prazo e movimentações excluídas. No entanto, parte dos arquivos fornecidos pelo Ministério do Trabalho encontra-se corrompida, o que impede a atualização. Estamos aguardando a resolução dessa situação para realizar os ajustes necessários.  

# Observações ao longo tempo
Cada linha representa uma contratação ou demissão e os dados são desidentificados, assim, não é possível acompanhar um indivíduo ou uma empresa ao longo do tempo. O que é possível fazer é acompanhar o crescimento ou queda de funcionários com carteira em um determinado setor (CNAE), função (CBO) ou combinações de diferentes colunas que são disponibilizadas

# Linhas duplicadas
Ainda não foram encontrados indícios de linhas duplicadas nas tabelas desse conjunto

# Cruzamentos
Essas tabelas são desidentificadas, ou seja, não temos as informações dos CNPJs nem dos CPFs envolvidos. Isso significa que não é possível fazer um cruzamento  com bases de dados que possuam CNPJ. Assim, esse conjunto de dados é interessante de ser cruzado com outras bases através das colunas de CNAE e id_municipio.

# Download dos dados
A tabela de microdados atualizados disponibilizada pela BD contém mais de 20 GB. A maior parte dos computadores não tem capacidade de processamento para essa quantidade de dados, por isso é recomendado primeiro trabalhar com queries no bigquery (que tem processamento em nuvem) e fazer filtros e agregações antes de baixar os dados. Recomendamos fazer filtros utilizando as colunas de partições (ano, sigla_uf) e selecionar apenas as colunas que sejam do seu interesse e depois baixar os dados.

# Instituição responsável
Ministério do Trabalho e Emprego (MTE)

# Instrumento de coleta
O Novo Caged é um compilado de dados do emprego formal por meio de informações captadas de 3 diferentes sistemas: eSocial, Caged e Empregador Web. A SEPRT apura tecnicamente o recebimento dessas informações nos registros administrativos antes de disponibilizar para o público.

# Mudanças na coleta
Em 2020, os dados do CAGED passaram por uma reformulação que  trouxe maior automatização na coleta de informações. Como resultado, houve ampliação na cobertura e maior agilidade na disponibilização dos dados, mas os novos dados coletados são incompatíveis com as séries históricas. Por isso esse conjunto possui 2 grupos de tabelas de microdados um para o formato anterior a 2020 e outro para o novo formato. Para mais detalhes sobre essas modificações adicionamos alguns links nos materiais de apoio

# Atualizações
Os microdados do CAGED são atualizados com 1 mês de defasagem. Isto é, supondo que o mês corrente seja março, os dados de fevereiro serão atualizados no final de março. O MTE disponibiliza um [calendário de atualização](https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/estatisticas-trabalho/o-pdet/calendario-de-divulgacao-do-novo-caged) disponível para consulta

# Dados identificados
Para obter os dados identificados do CAGED, é preciso realizar uma solicitação por meio deste link ao Ministério do Trabalho. Contudo, vale destacar que o processo pode ser demorado e não há garantia de aprovação.

# Tratamentos feitos pela BD:
O tratamento das três tabelas mais atualizadas do conjunto é muito similar: 
* Renomeação das colunas para adequação ao manual de estilo da BD.
* Criação das colunas de ano e mes a partir dos arquivos
* Adequação das colunas que identificam Unidades Federativas ao padrão de Sigla UF.
* Remoção das colunas: valorsalariofixo, unidadesalariocodigo, competenciaexc, competenciadec

# Materiais de apoio
* [Reportagem sobre mudanças no CAGED](https://g1.globo.com/economia/noticia/2021/04/28/serie-historica-do-emprego-formal-nao-pode-ser-comparada-com-novo-caged-dizem-analistas.ghtml): Reportagem do G1 levantando considerações de especialistas sobre as mudanças do CAGED
* [Nota sobre o Novo CAGED](ftp//:ftp.mtps.gov.br/pdet/microdados/NOVO%20CAGED/Sobre%20o%20Novo%20Caged.pdf): Nota do MTE que explica principais mudanças ocorridas no Novo Caged