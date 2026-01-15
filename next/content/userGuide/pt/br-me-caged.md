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

> O guia contém informações detalhadas sobre os dados. Para dúvidas sobre acesso ou uso da plataforma, consulte nossa [página de Perguntas Frequentes](/faq).

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

## Exemplo de ajustes do saldo com as movimentações fora do prazo e movimentações excluídas

A título de exemplo de como realizar o procedimento de ajuste, esta _query_ pode ser utilizada:

```sql
with tabelas_unidas as (
select *, 0 as indicador_exclusao from `basedosdados.br_me_caged.microdados_movimentacao`
union all
select * except (ano,mes), 0 as indicador_exclusao from `basedosdados.br_me_caged.microdados_movimentacao_fora_prazo`
union all
select * except (ano,mes, ano_declaracao_movimentacao, mes_declaracao_movimentacao, indicador_exclusao), 1 as indicador_exclusao from `basedosdados.br_me_caged.microdados_movimentacao_excluida`),

tabela_ajustada as (
select *,
case
  when saldo_movimentacao = 1 then 'admissão'
  when saldo_movimentacao = -1 then 'desligamento'
end as admissao_desligamento,
case
  when indicador_exclusao = 0 then saldo_movimentacao
  when indicador_exclusao = 1 then -saldo_movimentacao
end as saldo_movimentacao_ajustado
from tabelas_unidas)

select
ano,
mes,
sum(if(admissao_desligamento = 'admissão', saldo_movimentacao_ajustado, 0)) as qte_admissoes,
sum(if(admissao_desligamento = 'desligamento', saldo_movimentacao_ajustado, 0))as qte_desligamentos,
sum(saldo_movimentacao_ajustado) as saldo,
from tabela_ajustada
where sigla_uf='SP'
group by 1, 2
order by ano, mes
```

# Limitações

Os dados são limitados a trabalhadores com vínculo empregatício formal, não incluindo informações sobre trabalhadores informais ou autônomos.

# Inconsistências

## Coluna `salario_mensal`

Foram identificados valores fora do esperado, como salários na faixa de milhões de reais para setores que geralmente não pagam quantias tão elevadas. Isso pode ser devido a erros de registro ou valores atípicos.

## Municípios e Unidades da Federação não identificados

Em todas as tabelas, existem casos onde o valor de preenchimento da coluna _uf_ (sigla*uf, na BD) possui valor 99 e o preenchimento da variável \_municipio* (id_muncipio, na BD) valores 99999.

## Painel de empregos do CAGED

O painel de empregos do [CAGED](https://app.powerbi.com/view?r=eyJrIjoiNWI5NWI0ODEtYmZiYy00Mjg3LTkzNWUtY2UyYjIwMDE1YWI2IiwidCI6IjNlYzkyOTY5LTVhNTEtNGYxOC04YWM5LWVmOThmYmFmYTk3OCJ9&pageName=ReportSectionb52b07ec3b5f3ac6c749) é a referência de validação dos ajustes que devem ser realizados com as tabelas microdados_movimentacao_fora_prazo e microdados_movimentacao_excluida.

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

Os dados são anonimizados, não contendo CNPJs nem CPFs. Para obter dados identificados é necessário solicitar ao MTE. O processo pode ser demorado e não há garantia de aprovação.

# Tratamentos feitos pela BD:

Neste guia, os tratamentos são descritos em uma linguagem mais acessível. De maneira complementar, [os códigos de extração e tratamento](https://github.com/basedosdados/queries-basedosdados-dev/blob/main/models/br_me_caged/code/crawler_caged.py) e as [modificações feitas no BigQuery](https://github.com/basedosdados/queries-basedosdados/tree/main/models/br_me_caged) estão disponíveis no repositório do GitHub para consulta.
Os tratamentos realizados foram:

- Renomeação das colunas para adequação ao manual de estilo;
- Criação das colunas de `ano` e `mes`;
- Criação das colunas ano_competencia_movimentacao e mes_competencia_movimentacao nas tabelas microdados_movimentacao_fora_prazo e microdados_movimentacao_excluida
- Criação das colunas ano_declaracao_movimentacao e mes_declaracao_movimentacao na tabela microdados_movimentacao_excluida
- Adequação das colunas de unidades federativas ao padrão de sigla UF;
- Remoção das colunas: `valorsalariofixo`, `unidadesalariocodigo`

# Materiais de apoio

- [Reportagem do G1 sobre mudanças no CAGED](https://g1.globo.com/economia/noticia/2021/04/28/serie-historica-do-emprego-formal-nao-pode-ser-comparada-com-novo-caged-dizem-analistas.ghtml): Reportagem do G1 levantando considerações de especialistas sobre as mudanças do CAGED
- [Nota do MTE explicando as principais alterações no Novo CAGED](https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/estatisticas-trabalho/o-pdet/o-que-e-o-novo-caged): Nota do MTE que explica principais mudanças ocorridas no Novo Caged
