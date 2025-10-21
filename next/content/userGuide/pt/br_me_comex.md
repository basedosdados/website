---
title: Guia de uso da Comex Stat
description: >-
  Guia de uso das Estatísticas de Comércio Exterior em Dados Abertos (Comex Stat). Este material contém informações sobre as variáveis mais importantes, perguntas frequentes e exemplos de uso do conjunto da Comex Stat 
date:
  created: "2025-10-25T18:18:06.419Z"
thumbnail: 
categories: [guia-de-uso]
authors:
  - name: Thais Filipi
    role: Texto
---

# Introdução

> O guia contém informações detalhadas sobre os dados. Para dúvidas sobre acesso ou uso da plataforma, consulte nossa [página de Perguntas Frequentes](/faq).

Esse conjunto possui quatro tabelas de microdados:
- **Município Exportação:** Cada linha representa a agregação dos registros de exportação por ano, mês, categoria do produto (SH4), país de destino, unidade da federação e município da empresa exportadora.
- **Município Importação:** Cada linha representa a agregação dos registros de importação por ano, mês, categoria do produto (SH4), país de origem do bem importado, unidade da federação e município da empresa importadora.
- **NCM Exportação:** Cada linha representa a agregação dos registros de exportação por ano, mês, meio de transporte, alfândega, país, categoria do produto (NCM) e pela unidade da federação em que a mercadoria exportada foi produzida.
- **NCM Importação:** Cada linha representa a agregação dos registros de importação por ano, mês, meio de transporte, alfândega, país, categoria do produto (NCM) e pela unidade da federação de destino da importação realizada.

# Considerações para análises
## Categorias de produto
- O Sistema Harmonizado (SH) é um sistema internacional de classificação e codificação de mercadorias, usualmente com códigos de 6 dígitos. Ele possui diversos níveis de detalhamento. Os dois primeiros dígitos se referem aos capítulos, os dois seguintes à posição e os dois últimos à subposição da mercadoria. Nas tabelas ```municipio_exportacao``` e ```municipio_importacao```, a coluna de classificação é SH4, o que significa que temos apenas a agregação de posição da mercadoria. A tradução desse código é feita através do [Diretórios Mundiais da BD](https://basedosdados.org/dataset/afc7c3a1-8691-4f3b-8566-bdce90f1100d?table=2399179d-0e74-4f1b-a940-7e418cafa02f) que tem 6 dígitos.
-  A Nomenclatura Comum do Mercosul (NCM) é um desdobramento do SH. Dos oito dígitos que compõem a NCM, os seis primeiros são formados pelo Sistema Harmonizado, enquanto os dois últimos correspondem a seções específicas no âmbito do MERCOSUL. Traduzir via [Diretórios Mundiais](https://basedosdados.org/dataset/afc7c3a1-8691-4f3b-8566-bdce90f1100d?table=3027c0d8-d17b-443f-a295-1de6ff65d5cc).
- Cada produto é associado a uma unidade de medida (```id_unidade```) que define como os valores devem ser interpretados (por exemplo, quilograma líquido, unidade ou tonelada métrica líquida). É possível fazer a tradução da coluna ```id_unidade``` das tabelas ```ncm_exportação``` e ```ncm_importacao``` via [Diretórios Mundiais](https://basedosdados.org/dataset/afc7c3a1-8691-4f3b-8566-bdce90f1100d?table=3027c0d8-d17b-443f-a295-1de6ff65d5cc).

## Dados de ```id_municipio``` e ```sigla_uf```
- Em ```municipio_exportacao``` e ```municipio_importacao```, a coluna de município se refere ao domicílio fiscal da empresa responsável pela exportação ou importação – não o local onde se produziu a mercadoria exportada ou o destino da importação. A ```sigla_uf``` nessas tabelas é correspondente ao valor de ```id_municipio```.
- Em ```ncm_exportacao``` e ```ncm_importacao```, a coluna de UF se refere ao local de produção da mercadoria (exportação) ou ao destino da importação, independentemente da localização da sede da empresa que realizou a exportação ou importação.

# Correção de valores nulos de UF e município
Valores nulos de ```id_municipio``` e ```sigla_uf``` são corrigidos/preenchidos corretamente somente após correção anual dos dados pela secretaria responsável.

## Dados de ```id_pais``` nas tabelas de importação
A importação considera a origem da mercadoria, e não o país da empresa
que fez a venda. Na maioria dos casos, o país-sede da empresa que vende a mercadoria é o mesmo país onde é fabricado a mercadoria. Contudo, há casos que isto não acontece.

## Valor FOB
O ```valor_fob_dolar``` se refere somente ao valor da mercadoria. Nos casos de custos com frete e seguro de importação, isto está detalhado em ```valor_frete``` e ```valor_seguro```.

## URFs e via
Não se deve confundir as Unidades da Receita Federal de Despacho (URFs) com uma via específica, como por exemplo, portos, pois alguns portos possuem mais de um recinto alfandegado.

# Limitações
Os registros não são identificados pelas empresas ou pessoas físicas que atuam na exportação ou importação de bens, o que limita as possibilidades de análise (como por CNAE ou porte de empresa, por exemplo).

# Inconsistências
Divergências aparecem na comparação de dados entre países. No intercâmbio bilateral do Brasil, é comum identificar discrepâncias entre os números divulgados por cada parceiro.

# Observações ao longo tempo
É possível acompanhar as tendências da balança comercial pelos diferentes níveis de observação das tabelas, tanto mês a mês quanto por ano. A agregação dos dados mensais consolidados permite obter os resultados anuais do comércio exterior.

# Linhas duplicadas
Sem informações no momento.

# Cruzamentos
Os dados são anonimizados, não contendo informações de CNPJ ou CPF dos agentes de importação e exportação. Isso limita os cruzamentos com outros conjuntos, mas é possível usar as colunas ```id_pais```, ```sigla_uf``` e ```id_municipio```.

# Download dos dados
O total de tabelas tem cerca de 9 GB, portanto, é recomendado seguir boas práticas de processamento de dados tanto quanto possível. Para evitar sobrecarregar seu computador, recomendamos usar queries no BigQuery para processar os dados na nuvem antes de baixá-los. Filtre pelas colunas de partição (como ```ano```, ```mes```, ```sigla_uf``` e ```sigla_pais_iso3```) e selecione apenas as colunas relevantes.

# Instrumento de coleta
As estatísticas de comércio exterior são produzidas a partir de dados de registros  administrativos, alimentados via declaração pelas partes envolvidas nas operações de exportação e importação – empresas, despachantes, instituições financeiras, transportadores, agentes de carga, pessoas físicas etc. – nos sistemas oficiais [Siscomex](https://www.gov.br/siscomex/pt-br) e [Portal Único do Siscomex](https://portalunico.siscomex.gov.br/portal/), que gerenciam o comércio exterior brasileiro.

# Mudanças na coleta
- **Mudanças no sistema de coleta em 2018**
	- A partir de 2018, houve mudança de ferramenta de entrada dos dados de exportação, do NOVOEX para o Portal Único. No novo sistema, casos de embarque antecipado sem Nota Fiscal podem ficar sem registro de UF (“UF Não Declarada”). Somente após a emissão da nota é possível corrigir as informações de UF, o que faz com que os valores nulos deste campo fiquem superdimensionados nos meses mais recentes. Ver o Manual de Uso da Comex para mais detalhes.
- **Mudança de metodologia sobre a data de referência de bens importados e exportados em 2018** 
	- A partir de 2018, a data de referência dos dados de exportação passou a ser a data em que a carga é considerada completamente exportada (Data de CCE) – de 1997 a 2017 era a data de Desembaraço Aduaneiro.

# Atualizações
Os dados da Comex são atualizados nos primeiros dias úteis de cada mês. Apesar da divulgação de boletins semanais pela secretaria competente, estes devem ser desconsiderados quando a versão mensal consolidada é publicada. Na Base dos Dados há uma pipeline programada para buscar e atualizar os dados diariamente. Se perceber que os dados estão desatualizados, entre em contato com nossa equipe.

# Dados identificados
Os dados são anonimizados, não contendo informações de CNPJ ou CPF. Os registros administrativos e aduaneiros que alimentam a Comex Stat têm finalidade comprobatória, fiscalizatória e de validade jurídica, responsabilidade dos órgãos competentes. 

# Tratamentos feitos pela BD
Neste guia, os tratamentos são descritos em uma linguagem mais acessível. De maneira complementar, os [códigos de tratamento](https://github.com/basedosdados/pipelines/tree/main/pipelines/datasets/br_me_comex_stat) e as [modificações feitas no BigQuery](https://github.com/basedosdados/pipelines/tree/main/models/br_me_comex_stat) estão disponíveis no repositório do GitHub para consulta.
Os tratamentos realizados foram: 
* Correção de códigos municipais específicos em estados com inconsistências históricas (SP, MS, GO e DF), garantindo alinhamento com o padrão IBGE (7 dígitos);
* Padronização de nomes das colunas segundo o [Manual de Estilo da BD](https://basedosdados.org/docs/style_data);
* Conversão da coluna ```mes``` para o tipo inteiro (int64)
* Substituição de códigos inválidos (como “ND” ou “9300000”) por valores nulos nas colunas de ```sigla_uf``` e ```id_municipio```;
* Padronização de códigos em coluna específicas:
	* ```id_ncm``` (8 dígitos, formato string);
	- ```id_sh4``` (4 dígitos, formato string);
	- ```id_pais``` convertido para o código ISO3 (```sigla_pais_iso3```) nas tabelas onde isto se aplica

# Materiais de apoio
- [Manual de utilização dos dados estatísticos do comércio exterior brasileiro](https://balanca.economia.gov.br/balanca/manual/Manual.pdf).
- [Manuais e Notas Metodológicas](https://www.gov.br/mdic/pt-br/assuntos/comercio-exterior/estatisticas/manuais-e-notas-metodologicas) no site do Ministério do Desenvolvimento, Indústria, Comércio e Serviços.
- [Totais para validação](https://www.gov.br/mdic/pt-br/assuntos/comercio-exterior/estatisticas/base-de-dados-bruta) dos dados em Estatísticas de Comércio Exterior em Dados Abertos
- Análises feitas pela BD com a Comex Stat ([soja](https://github.com/basedosdados/analises/blob/main/redes_sociais/br_comex_stat_municipio_exportacao_20230626.ipynb) e [café](https://github.com/basedosdados/analises/blob/main/redes_sociais/br_me_comex_stat_20251006.sql)).



