---
title: Patch Notes - Dezembro 🎲
description: Fique por dentro das atualizações técnicas da BD neste mês
date:
  created: "2025-12-07T15:00:00"
authors:
thumbnail: /blog/patchnotes_dez/thumb_patchnotes.png
categories: [institucional]
medium_slug: >-
published: true
order: 0
---


Olá, databaser!

Estamos chegando ao final do ano com algumas atualizações interessantes — inclusive a estreia deste novo formato de Patch Notes, que publicaremos periodicamente para manter a transparência com nossa comunidade e informar sobre novidades técnicas no nosso datalake público, dados, serviços e mais. Vamos lá?

<Image src="/blog/patchnotes_dez/patchnotes_dez.png" />

## Correções em Pipelines

Corrigimos problemas que impediam a atualização automática de **7 conjuntos de dados**, totalizando **23 tabelas**. Alguns dos destaques entre as tabelas:

*   **Dados de Inflação ([IPCA](https://basedosdados.org/dataset/ea4d07ca-e779-4d77-bcfa-b0fd5ebea828?table=f1fd2eb7-467a-403b-8f1c-2de8eff354e6), [INPC](https://basedosdados.org/dataset/92945390-3b20-40e7-b71b-f6b58f3dc754), [IPCA-15](https://basedosdados.org/dataset/a7d9442f-a591-477e-82a1-bcf780ccd0dc))**
    *   Conjuntos de dados atualizados: `br_ibge_ipca`, `br_ibge_ipca_br_ibge_inpc` e `"br_ibge_ipca15`
    *   Tabelas atualizadas:
        * Mês Brasil;
        * Mês Categoria Brasil;
        * Mês Categoria Município;
        * Região Metropolitana .
    *   Atualizações:
        *   Preenchimento de metadados de última verificação, última atualização na fonte e última atualização na BD para todas as tabelas;
        * Ativação de schedules;
        * Acompanhamento da primeira execução da pipeline após o fechamento do PR.

*   **[Cadastro Nacional de Obras](https://basedosdados.org/dataset/062621e9-5aa0-4903-852d-619ae54393d2) (CNO)**
    *   Conjunto de dados: ``br_rf_cno``
    *   Atualizações:
        *   Testamos diferentes alocações de recursos no pod que executa o flow no kubernetes;
        * Acompanhamos a primeira execução da pipeline após o fechamento do PR.
*   **[Fundos de Investimentos](https://basedosdados.org/dataset/9c5a820f-09dd-4519-adfd-611819163ae0) (CVM)**
    *   Conjunto de dados: ``br_cvm_fi``
    *   Atualizações:
        *   Depuração do problema que impede o registro do Flow;
        * Acompanhamento da primeira execução da pipeline após o fechamento do PR.


**Por que isso importa?**
Quando uma pipeline encontra problemas, os dados podem ficar desatualizados. Essas correções fazem parte do nosso trabalho contínuo para manter o datalake o mais atualizado possível.


## Atualização da RAIS

Os dados parciais da RAIS Estabelecimentos [2024](https://basedosdados.org/dataset/3e7c4d58-96ba-448e-b053-d385a829ef00?table=86b69f96-0bfe-45da-833b-6edc9a0af213) já estão no ar! Isso significa que você tem acesso aos dados de estabelecimentos mais recentes do mercado de trabalho formal no Brasil — com informações sobre vínculos empregatícios, remunerações, setores e muito mais. Se já tinha uma análise com a RAIS anterior, é hora de atualizar os gráficos!

## Atualização dos dados de Indicadores Educacionais

Atualizamos o conjunto de dados de [Indicadores Educacionais](https://basedosdados.org/dataset/63f1218f-c446-4835-b746-f109a338e3a1?table=cd65b1d2-45e8-432b-afe8-c3a706addbe8) do INEP com o preenchimento de metadados de última verificação, última atualização na fonte e última atualização na BD para todas as tabelas. 

Tabelas atualizadas:

* Brasil (2024);
* UF (2024);
* Região (2024);
* Brasil Taxa Transição (2022);
* UF Taxa Transição (2022);
* Município Taxa Transição (2022);
* Região Taxa Transição (2022).


Os indicadores educacionais são essenciais para pesquisas, políticas públicas e análises regionais. Com os dados de 2024 agora disponíveis, você pode acompanhar a evolução recente da educação brasileira em nível nacional, estadual e regional — e com metadados claros para saber sempre a procedência e a data da última atualização.


## Refatoração de Logs do DBT

Refatoramos os logs de execução do DBT (ferramenta de transformação de dados) para que sejam mais limpos, estruturados e informativos. Agora, conseguimos identificar erros mais rápido, sem precisar vasculhar várias plataformas ou reproduzir falhas localmente.

**Por que isso importa?**
Para nossa equipe de engenharia, isso significa menos tempo depurando e mais tempo para desenvolver novas pipelines. Para você, databaser, significa pipelines ainda mais confiáveis e uma base de dados sempre consistente.

- - - 

Quer ficar sempre por dentro também das nossas análises, entrevistas, aulas e tutoriais? Assine a [BDletter](https://info.basedosdados.org/newsletter), ela chega gratuitamente na sua caixa de entrada! 