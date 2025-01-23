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
# Introdução
Este conjunto de dados possui cinco tabelas de microdados, divididas entre duas do antigo CAGED e três do novo CAGED. As metodologias do modelo antigo e do novo não são compatíveis, o que afeta análises temporais.
- **Microdados Antigos:** Cada linha representa um registro de admissão ou demissão até dezembro de 2019. As colunas qualificam as características do empregado, do tipo de vínculo e da empresa. 
- **Microdados Antigos de Ajustes:** Complementa a tabela Microdados Antigos com ajustes de admissões e demissões mensais, incluindo cancelamentos e movimentações fora do prazo.
- **Microdados Movimentações:** Cada linha representa um registro de admissão ou demissão a partir de janeiro de 2020. As colunas qualificam as características do empregado, do tipo de vínculo e da empresa.
- **Microdados Movimentações Excluídas:** Complementa a tabela Microdados Movimentações com cancelamentos de admissões ou demissões. Esses cancelamentos impactam o saldo do CAGED de forma inversa ao evento original.
- **Microdados Movimentações Fora do Prazo:** Complementa a tabela Microdados Movimentações registrando eventos fora do período regular.

# Considerações para análises
## Saldo de movimentações
O crescimento ou redução de empregos em um grupo pode ser determinado pela soma da coluna `saldo_movimentacao`. Verifique nessa coluna se a linha representa uma admissão ou demissão. 

## Exclusões e movimentações fora do prazo
Além das movimentações regulares, é importante considerar as tabelas Microdados Movimentações Excluídas e Microdados Movimentações Fora do Prazo para obter um saldo mais preciso. Cancelamentos impactam o saldo de forma inversa ao evento original, enquanto as movimentações fora do prazo incluem eventos registrados após o período regular.

# Limitações
Os dados são limitados a trabalhadores com vínculo empregatício formal, não incluindo informações sobre trabalhadores informais ou autônomos.

# Inconsistências
## Coluna `salario_mensal`
Foram identificados valores fora do esperado, como salários na faixa de milhões de reais para setores que geralmente não pagam quantias tão elevadas. Isso pode ser devido a erros de registro ou valores atípicos.

## Painel de empregos do CAGED
Foram identificadas inconsistências entre os dados disponíveis e o painel do CAGED. Isso pode ser causado pela ausência da coluna de mês de referência para movimentações fora do prazo e excluídas. No entanto, parte dos arquivos fornecidos pelo Ministério do Trabalho encontra-se corrompida, o que impede a atualização. Estamos aguardando a resolução dessa situação para realizar os ajustes necessários.

# Observações ao longo tempo
Cada linha representa uma contratação ou demissão. Como os dados são desidentificados, não é possível acompanhar indivíduos ou empresas ao longo do tempo. O que é possível fazer é acompanhar o crescimento ou queda de funcionários com carteira em um determinado setor (`cnae`), função (`cbo`) ou outras combinações das colunas disponíveis. Além disso é importante se atentar que a metodologia do CAGED mudou no início de 2020 e por isso análises temporais devem ser feitas até 2019 ou a partir de 2020.

# Linhas duplicadas
Não foram encontradas linhas duplicadas neste conjunto de dados.

# Cruzamentos
Os dados são anonimizadas, não contendo CNPJs nem CPFs. Isso limita os cruzamentos com outros conjuntos que possuem CNPJs, mas é possível usar colunas como `cnae` e `id_municipio` para fazer cruzamentos interessantes.

# Download dos dados
Os microdados somam mais de 20 GB. Para evitar sobrecarregar seu computador, recomendamos usar queries no BigQuery para processar os dados em nuvem antes de baixá-los. Filtre pelas colunas de partição (como ano e UF) e selecione apenas as colunas relevantes.

# Instrumento de coleta
O Novo CAGED compila dados do emprego formal a partir de sistemas como eSocial, CAGED e Empregador Web. Os registros administrativos passam por apuração antes de serem disponibilizados ao público.

# Mudanças na coleta
Em 2020, o CAGED passou por reformulação, automatizando a coleta de informações e ampliando a cobertura. No entanto, isso resultou em incompatibilidade com as séries históricas anteriores. Para mais informações sobre essas modificações, consultar os [materiais de apoio](https://basedosdados.org/dataset/562b56a3-0b01-4735-a049-eeac5681f056?tab=userGuide#tratamentos-feitos-pela-bd).

# Atualizações
Os microdados são atualizados com defasagem de um mês. O calendário de atualizações pode ser consultado no [site do MTE](https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/estatisticas-trabalho/o-pdet/calendario-de-divulgacao-do-novo-caged).

# Dados identificados
Os dados são anonimizados, não contendo CNPJs nem CPFs. Para obter dados identificados da RAIS, é necessário solicitar ao MTE. O processo pode ser demorado e não há garantia de aprovação.

# Tratamentos feitos pela BD:
Neste guia, os tratamentos são descritos em uma linguagem mais acessível. De maneira complementar, [os códigos de extração e tratamento](https://github.com/basedosdados/queries-basedosdados-dev/blob/main/models/br_me_caged/code/crawler_caged.py) e as [modificações feitas no BigQuery](https://github.com/basedosdados/queries-basedosdados/tree/main/models/br_me_caged) estão disponíveis no repositório do GitHub para consulta.
Os tratamentos realizados foram:
* Renomeação das colunas para adequação ao manual de estilo;
* Criação das colunas de `ano` e `mes`;
* Adequação das colunas de unidades federativas ao padrão de sigla UF;
* Remoção das colunas: `valorsalariofixo`, `unidadesalariocodigo`, `competenciaexc`, `competenciadec`

# Materiais de apoio
* [Reportagem do G1 sobre mudanças no CAGED](https://g1.globo.com/economia/noticia/2021/04/28/serie-historica-do-emprego-formal-nao-pode-ser-comparada-com-novo-caged-dizem-analistas.ghtml): Reportagem do G1 levantando considerações de especialistas sobre as mudanças do CAGED
* [Nota do MTE explicando as principais alterações no Novo CAGED](ftp//:ftp.mtps.gov.br/pdet/microdados/NOVO%20CAGED/Sobre%20o%20Novo%20Caged.pdf): Nota do MTE que explica principais mudanças ocorridas no Novo Caged