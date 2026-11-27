---
title: Patch Notes - Novembro 🎲
description: Fique por dentro das atualizações de dados da BD em novembro
date:
  created: "2026-11-27T15:00:00"
authors:
thumbnail: /blog/patchnotes_dez/thumb_patchnotes.png
categories: [institucional]
medium_slug: >-
published: true
order: 0
---


Olá, *databaser*!

Novembro foi um mês cheio por aqui: chegaram dados novos, mais conjuntos passaram a se atualizar sozinhos, tabelas que tinham parado voltaram a ficar em dia e corrigimos uma informação importante nos Nascidos Vivos. Vamos às novidades?

<Image src="/blog/patchnotes_novembro/patchnotes_novembro.png" />

## Novos dados

### [Stanford Open Policing Project: abordagens policiais nos EUA](https://basedosdados.org/dataset/ae0c5565-1403-4f46-824b-814af29edd07)

O Stanford Open Policing Project, do Stanford Computational Policy Lab, é uma das principais referências em pesquisas sobre policiamento nos Estados Unidos. Agora ele está tratado na BD: são **230 milhões de abordagens policiais** registradas por **33 polícias estaduais e 55 municipais**, de **1971 a 2020**.

Os dados ficam em duas tabelas: uma com as abordagens, no formato padronizado pelo projeto, e outra com as jurisdições (as polícias que publicaram os dados). O acesso é gratuito.

**Bom saber:** cada polícia registra um conjunto diferente de informações, então nem todas as colunas estão preenchidas para todas as jurisdições. A fonte original está congelada desde 2023, por isso este conjunto não terá novas atualizações.

### [Capacidade de Pagamento (CAPAG) de Estados e Municípios](https://basedosdados.org/dataset/d239b68c-7c12-4ba6-b4c5-bfa92c5133b9)

A CAPAG é a avaliação do Tesouro Nacional sobre a situação fiscal de estados e municípios, usada, por exemplo, para decidir se um ente pode contratar empréstimos com garantia da União. Agora você encontra na BD, de **2018 a 2026**:

*   Os três indicadores (endividamento, poupança corrente e liquidez), a nota de cada um e a nota final, para estados e municípios;
*   A **base de cálculo dos municípios**, com os valores dos demonstrativos fiscais (DCA, RGF e RREO) usados nos indicadores.

**Bom saber:** em 2022, o Tesouro publicou uma revisão das notas dos municípios. A tabela guarda a nota original e a revisada, para você escolher qual usar.

## Atualização automática

Estes conjuntos de dados agora são atualizados por pipelines, sem depender de carga manual:

*   **[CAPAG](https://basedosdados.org/dataset/d239b68c-7c12-4ba6-b4c5-bfa92c5133b9):** quando o Tesouro publica uma nova avaliação, ela entra na BD.
*   **[Cadastro do IPTU na cidade de São Paulo](https://basedosdados.org/dataset/05f1b96d-883b-4202-a4bd-40379c5d326a) (BD Pro):** toda semana conferimos se a prefeitura publicou um ano novo no GeoSampa. O histórico, de 1995 a 2026, foi reprocessado, e o tratamento agora para automaticamente se o arquivo da fonte vier com problemas (linhas incompletas ou contagem diferente da original).
*   **[Filiação Partidária](https://basedosdados.org/dataset/e68b1cfd-ca29-4bdc-b687-424d9c59760e):** os microdados de filiados do TSE passam a ser atualizados todo mês, organizados por data de extração e estado.

**Por que isso importa?**
Pipelines automáticos reduzem o tempo entre a publicação na fonte e a disponibilidade na BD, e diminuem o risco de os dados ficarem desatualizados.

## De volta: tabelas reativadas

Reativamos **14 tabelas** que tinham parado de atualizar. Entre elas:

*   Servidores Federais;
*   [Comex Stat](https://basedosdados.org/dataset/74827951-3f2c-4f9f-b3d0-56e3aa7aeb39);
*   [Banda Larga Fixa da Anatel](https://basedosdados.org/dataset/4ba41417-ba19-4022-bc24-6837db973009);
*   Equipes do [CNES](https://basedosdados.org/dataset/354d6d98-bc09-4e22-a58a-e4eac3a5283c);
*   [IPCA](https://basedosdados.org/dataset/ea4d07ca-e779-4d77-bcfa-b0fd5ebea828).

O diretório de empresas dos [Diretórios Brasileiros](https://basedosdados.org/dataset/33b49786-fb5f-496f-bb7c-9811c985af8e) também foi atualizado e agora reúne **74,4 milhões de CNPJs**.

**Por que isso importa?**
Muita gente usa essas tabelas em análises recorrentes e painéis. Quando uma pipeline para, os dados ficam defasados; com essas correções, elas voltam a acompanhar as publicações das fontes.

## Correção: naturalidade da mãe nos Nascidos Vivos (SINASC)

**O que mudou na prática?**

Agora dá para saber com segurança onde a mãe nasceu: em qual país e, se no Brasil, em qual estado, na tabela de microdados dos [Nascidos Vivos (SINASC)](https://basedosdados.org/dataset/48ccef51-8207-40ee-af5b-134c8ac3fb8c).

**Detalhes técnicos:**

*   **Antes:** a coluna `id_pais_mae` misturava país e estado de nascimento (brasileiras apareciam com códigos `8xx`, um por UF), e `id_uf_mae` vinha vazia ou inválida em parte da série.
*   **Depois:** `id_pais_mae` passa a ser o país de nascimento da mãe (brasileiras recebem `800`, Brasil). Quando `id_uf_mae` estava vazia ou inválida, ela é completada pela UF de nascimento informada na fonte; um valor válido nunca é sobrescrito.
*   **Impacto:** mais de **40 milhões de registros** tiveram o país de nascimento padronizado, e **4,3 milhões de registros de 2011 e 2012** ganharam a UF da mãe.
*   **Conferência:** o resultado foi comparado com os arquivos originais do DATASUS.

**Por que fizemos isso?**
Para que análises sobre mães nascidas em outros estados ou países, como estudos de migração e saúde materna, partam de uma informação correta e consistente ao longo de toda a série.

## Como acessar

Todos esses dados estão em [basedosdados.org](https://basedosdados.org). Não sabe SQL? [Pergunte ao chatbot da BD](https://basedosdados.org/chatbot-lp): ele monta a consulta e a análise para você, e mostra o SQL para conferir.

Usou algum desses dados? Conta pra gente o que você descobriu nas nossas redes ou na comunidade da BD!
