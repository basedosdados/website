---
title: Patch Notes - Janeiro/Fevereiro 🎲
description: Fique por dentro das atualizações técnicas da BD 
date:
  created: "2026-02-07T15:00:00"
authors:
thumbnail: /blog/patchnotes_dez/thumb_patchnotes.png
categories: [institucional]
medium_slug: >-
published: true
order: 0
---


Olá, *databaser*!

Começamos o ano com uma série de atualizações importantes para garantir a qualidade e a disponibilidade dos dados da BD. Fique por dentro das novidades técnicas que implementamos para você em Janeiro e Fevereiro!

<Image src="/blog/patchnotes_janeiro/patchnotes_janeiro.png" />

## Conjuntos e tabelas atualizados

### [Dados de População](https://basedosdados.org/dataset/d30222ad-7a5c-4778-a1ec-f0785371d1ca)

Os dados mais recentes do IBGE sobre a população brasileira já estão na BD. São dados a nível de município com as estimativas de população feitas pelo instituto. Você pode cruzar esses dados para criar comparações com diversos outros indicadores importantes.

### [Emissões de gases do efeito estufa no Brasil](https://basedosdados.org/dataset/9a22474f-a763-4431-8e3d-667908a1c7ab)

Os dados da versão mais recente do Sistema de Estimativa de Emissões e Remoções de Gases de Efeito Estufa (SEEG) já estão na BD. São dados a nível de município com informações sobre emissões por setor de emissão, atividade econômica e muito mais, agora com dados até 2024.

### [Microdados do SAEB](https://basedosdados.org/dataset/e083c9a2-1cee-4342-bedc-535cbad6f3cd)

A última atualização do Sistema de Avaliação da Educação Básica (Saeb) já está na BD, com dados tratados e prontos para sua análise. São os registros individuais e anonimizados das avaliações aplicadas pelo INEP a alunos, professores e diretores de escolas públicas e privadas do Brasil.

### [Dados de população do Ministério da Saúde](https://basedosdados.org/dataset/1e2b9a88-9dc7-4f0e-a3a5-e8d2a13869bf)

O Ministério da Saúde também disponibiliza estimativas anuais de população para os municípios, desagregadas por sexo e grupos de idade. Agora você também pode acessar os dados mais recentes, de 2025, pela BD.

### [Microdados da Avaliação da Alfabetização](https://basedosdados.org/dataset/073a39d4-89cf-4068-b1e8-34ed0d9c0b72)

O Inep definiu um padrão nacional de alfabetização com base na Pesquisa Alfabetiza Brasil (2023). Esse indicador é calculado com base nos resultados das avaliações realizadas pelos sistemas estaduais e municipais, em cooperação técnica com o Inep, e padronizados na escala do Saeb.

São dados de 2023 e 2024 com resultados e metas das UF’s e municípios, além da taxas de alfabetização da rede pública por município e rede.

### [Microdados de educação da Pnad-C](https://basedosdados.org/dataset/9fa532fb-5681-4903-b99d-01dc45fd527a?table=18fbf773-f43f-4876-8511-8b3b2f0d42a6)

Os dados de 2024 da Pesquisa Suplementar Anual referentes à educação já estão prontos para sua análise na BD. Coletados trimestralmente pelo IBGE, esses dados complementam o Censo Escolar com informações sobre frequência escolar, analfabetismo, escolaridade e acesso à educação, mesmo fora do sistema formal.

## Correção de Metadados e Métrica de Atualização

**O que mudou na prática?**

Eliminamos os "falsos positivos" no painel de monitoramento, assegurando que os alertas de tabelas desatualizadas agora refletem a realidade.

**Detalhes técnicos:**

*   **Antes:** A discrepância entre o metadado de "frequência de atualização" e a data da última carga no banco de dados gerava alertas incorretos para tabelas que estavam em perfeito estado.
*   **Depois:** Os metadados foram ajustados para corresponder precisamente ao comportamento real dos pipelines.
*   **Impacto Técnico:** A fórmula de cálculo (Frequência vs. Última Atualização) agora opera sobre parâmetros corretos, higienizando a métrica de monitoramento.

**Por que fizemos isso?**

Para restaurar a confiança nos dashboards de qualidade de dados, garantindo uma observabilidade precisa do status de atualização.

## Manutenções Periódicas de Pipelines

**O que mudou na prática?**

Restabelecemos pipelines que apresentaram falhas durante o recesso de fim de ano, incluindo correções de modelagem, ajustes de extração (especialmente devido à virada de ano) e resolução de erros em testes automatizados.

**Detalhes técnicos:**

*   **Antes:** Falhas de execução bloqueavam a atualização de diversos conjuntos de dados devido a erros de teste, problemas na construção de modelos e metadados incorretos.
*   **Depois:**
    *   **Correções Aplicadas (PRs #1355 e #1357):** Ajustes na modelagem de profissionais (CNES), correção na extração de microdados da Dengue (SINAN) e fix nos IDs de NCM (Comex Stat).
    *   **Investigação e Ajustes:** Resolução de erros de teste (Estban, Cafir), atualização de metadados (CVM) e análise de duplicidade/string matching (Denatran).
    *   **Mapeamento:** Identificação de novas quebras para inclusão no backlog (Bolsa Família, BDMEP, etc.).
*   **Impacto Técnico:** Retomada da integridade dos pipelines e normalização do fluxo de ingestão diária.

**Por que fizemos isso?**

Para priorizar e resolver as interrupções de serviço acumuladas durante a virada de ano, garantindo a disponibilidade dos dados mais acessados.

## Atualização e Conserto das Tabelas de Indicadores Educacionais

**O que mudou na prática?**

Atualização e conserto de dados, incluindo a remoção de dados duplicados nas tabelas de indicadores educacionais.

**Detalhes técnicos:**

*   **Antes:** Tabelas de indicadores educacionais com dados desatualizados e duplicados.
*   **Depois:** Dados atualizados e duplicidades removidas, garantindo a integridade das informações.

## Refatoração e Estabilização de Flows (Nova Arquitetura)

**O que mudou na prática?**

Migramos os fluxos de dados para a nova arquitetura com monitoramento assistido e correção imediata de falhas na primeira execução, aumentando a robustez do sistema.

**Detalhes técnicos:**

*   **Antes:** Flows adaptados preliminarmente ou ainda na arquitetura antiga, sujeitos a erros de implementação.
*   **Depois:** Flows refatorados, validados em produção e com correções de runtime aplicadas no mesmo PR.
*   **Impacto Técnico:** Garantia de aderência ao novo processo de arquitetura e estabilidade na execução dos pipelines.

**Por que fizemos isso?**

Para reduzir a incidência de dados incorretos em produção e assegurar a confiabilidade do datalake público.
