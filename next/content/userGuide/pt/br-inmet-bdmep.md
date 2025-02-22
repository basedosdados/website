---
title: Guia de uso do BDMEP
description: >-
  Guia de uso dos Dados Metereoógicos BDMEP. Este material contém informações sobre as variáveis mais importantes, perguntas frequentes e exemplos de uso do conjunto
date:
  created: "2024-11-28T18:18:06.419Z"
thumbnail: 
categories: [guia-de-uso]
authors:
  - name: Laura Amaral
    role: Texto
---

# Introdução

> O guia contém informações detalhadas sobre os dados. Para dúvidas sobre acesso ou uso da plataforma, consulte nossa [página de Perguntas Frequentes](/faq).

Esse conjunto possui duas tabelas de microdados:  
- **Microdados:** Cada linha representa uma coleção de medições de uma estação em um horário. As colunas trazem informações sobre a precipitação, a pressão, a radiação, a temperatura, a umidade e o vento.  
- **Estação:** Cada linha representa uma estação metereológica. As colunas trazem informações geográficas dessa estação

# Considerações para análises

## Forma de cálculo
Antes de realizar operações com os dados da BDMEP, é crucial entender como cada medida foi calculada. Algumas colunas apresentam valores médios, enquanto outras contêm valores máximos ou mínimos. A escolha da variável adequada dependerá das necessidades específicas da análise.

## Linhas vazias, falhas e dados inexistentes
Os dados do INMET-BDMEP possuem falhas, como linhas vazias devido a problemas nos sensores e na comunicação das estações meteorológicas. Essas falhas podem ser identificadas por todas as colunas de valores estarem nulas. É importante considerar essas falhas ao realizar análises.

## Conversão de horário
Todas as informações de horário estão em UTC. Para convertê-las para o horário oficial de Brasília, é necessário subtrair 3 horas. Por exemplo, 12:00 UTC é equivalente a 9:00 pelo horário de Brasília.

## Dados brutos e não validados
Os dados das estações automáticas são brutos e não passam por um processo de validação de consistência.

# Limitações
* A tabela de microdados disponibilizada pela BD inclui exclusivamente dados de estações automáticas.
* As medições dizem respeito a um único ponto no espaço. A extrapolação dos dados para áreas maiores deve ser realizada com ponderações.

# Inconsistências
Ainda não foram reportadas inconsistências neste conjunto de dados.

# Observações ao longo tempo
Cada linha representa uma compilação de medidas realizada por uma estação meteorológica em um intervalo de uma hora. As colunas disponibilizadas são agregações desse período, permitindo acompanhar a evolução das condições climáticas ao longo do tempo nas estações.

# Linhas Duplicadas
Ainda não foram reportadas linhas duplicadas nas tabelas desse conjunto. 

# Cruzamentos
A tabela de microdados pode ser associada à tabela de estações por meio da coluna `id_estação`, permitindo a geolocalização dos dados. Isso viabiliza cruzamentos externos com tabelas georreferenciadas ou que possuam elementos de geolocalização, como a coluna de CEP. Além disso, a tabela de estações oferece a identificação do município, ampliando as possibilidades de cruzamentos.

# Download dos dados
A tabela de microdados possui mais de 10GB. Dependendo da capacidade do computador, o processamento dos dados pode sobrecarregar a máquina. Assim, recomendamos usar queries no BigQuery para processar os dados em nuvem antes de baixá-los. Filtre pela coluna de partição (ano) e selecione apenas as colunas relevantes.

# Instrumento de coleta
Os dados são coletados por estações metereológica automática (EMA). A coleta de dados é feita través de sensores para medição dos parâmetros meteorológicos a serem observados. As medidas são tomadas em intervalos de minuto a minuto e integralizadas no período de uma hora. Os dados coletados pelas EMAs são enviados automaticamente para a sede do INMET em Brasília, de hora em hora.

# Mudanças na coleta
Essas tabelas são consistentes desde 2000, não temos registro de alterações na forma de coleta.

# Atualizações
A atualização dos dados na fonte original é a cada hora. Na Base dos Dados atualizamos essas informações mensalmente

# Tratamentos feitos pela BD:
Neste guia, os tratamentos são descritos em uma linguagem mais acessível. De maneira complementar, [os códigos de extração e tratamento](https://github.com/basedosdados/pipelines/blob/main/pipelines/datasets/br_inmet_bdmep/flows.py) e as [modificações feitas no BigQuery](https://github.com/basedosdados/queries-basedosdados/blob/main/models/br_inmet_bdmep/br_inmet_bdmep__microdados.sql) estão disponíveis no repositório do GitHub para consulta.
Os tratamentos realizados na tabela de microdados foram:
* Renomeação das colunas para adequação ao manual de estilo da BD.
* Substituição de códigos inválidos (“-9999”) por valores nulos.
* Inclusão do identificador da estação (id_estação) na tabela de microdados.
* Ajuste do formato das colunas de data e hora para compatibilidade com o BigQuery.

# Materiais de apoio
* [Nota técnica do funcionamento da rede de estações metereológicas do INMET](http://www.cemtec.ms.gov.br/wp-content/uploads/2019/02/Nota_Tecnica-Rede_estacoes_INMET.pdf) 
* [Nota do INMET - saiba como acessar os dados meteorológicos](https://portal.inmet.gov.br/noticias/saiba-como-acessar-os-dados-meteorol%C3%B3gicos-dispon%C3%ADveis-no-site-do-inmet?utm_source=chatgpt.com)
