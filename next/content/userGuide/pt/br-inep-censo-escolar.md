---
title: Guia de uso de dados do Censo Escolar
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

# Introdução

> O guia contém informações detalhadas sobre os dados. Para dúvidas sobre acesso ou uso da plataforma, consulte nossa [página de Perguntas Frequentes](/faq).

Esse conjunto possui quatro tabelas de microdados:  
- **Escolas:** Única tabela disponibilizada pelo INEP a partir de 2021, cada linha representa uma escola. As colunas incluem características da escola, como infraestrutura física disponível, a equipe pedagógica, a infraestrutura pedagógica, marcas do período letivo, e informações agregadas sobre matrículas, docentes e turmas.
- **Turmas:** Tabela disponibilizada a partir de requisições via pedidos LAI. Cada linha representa uma turma ativa no ano escolar, as colunas contém informações de disciplinas feitas pela turma, o horário de começo das aulas, o número de alunos da turma e o nível de ensino.
- **Matrículas:** Mantida para consulta histórica, mas não atualizada desde 2021. Cada linha representa uma matricula, as colunas incluem variáveis sociodemográficas, atividades que o aluno realiza e a forma de transporte para acesso a escola. 
- **Docentes:** Mantida para consulta histórica, mas não atualizada desde 2021. Cada linha representa uma alocação de um docente em uma turma com uma escola durante um ano, as colunas possuem caracteristicas sociodemográficas, informações sobre a formação e detalhes da atividade do docente na escola. 

# Considerações para análises
## Seleção de variáveis
Não disponibilizamos todas as variáveis que aparecem no Censo. Selecionamos as variáveis que apareceram 8 ou mais vezes de 2009 a 2020, além de outras variáveis que julgamos serem cruciais por serem identificadoras importantes. Isso significa que, se a variável só aparece em 2 anos na fonte original, por exemplo, ela não foi incluída nas nossas tabelas.

## Informação de raça e cor
A informação de raça e cor no Censo Escolar é preenchida pela escola, mas muitos registros ficam em branco. Isso pode causar distorções nas análises feitas neste tema com esta base.

Sabemos disso porque a prova SAEB também coleta a raça dos alunos, mas de forma diferente: os próprios estudantes informam. Os dados do Censo Escolar e do SAEB acabam sendo bem diferentes por causa dessas diferentes metodologias.

# Limitações
* Os dados estão disponíveis a partir de 2009, pois foi quando a pesquisa passou a ter um formato mais uniforme. Isso facilita a comparação entre os anos e garante maior compatibilidade.

# Inconsistências
Ainda não foram reportadas inconsistências neste conjunto de dados.

# Observações ao longo tempo
Os alunos e docentes tem informações anonimizadas, por isso não é possível acompanhar essas entidades através dos anos na tabela de matriculas e docentes. As escolas por sua vez são identificáveis e podem ser acompanhadas ao longo dos anos.
Também é importante observar que as tabelas de matriculas e docentes pararam de ser disponibilizadas em 2020.

# Linhas duplicadas
Ainda não foram encontrados indícios de linhas duplicadas nas tabelas desse conjunto

# Cruzamentos
Dentro do próprio conjunto é possível cruzar as tabelas utilizando as chaves de id_escola, id_turma e ano. 
Além disso essas tabelas podem ser complementadas com informações de outros conjuntos do INEP:  
1. **Indicadores Escolares do INEP** :  Os Indicadores Escolares do INEP trazem uma série de medições sobre a qualidade do ensino em diferentes graus de agregação, permitindo análises mais detalhadas do contexto educacional em escolas, municípios e estados.  
2. **Sinopses Estatísticas da Educação Básica**  :   As Sinopses Estatísticas da Educação Básica apresentam informações do Censo Escolar de maneira agregada e simplificada, facilitando análises rápidas e comparações entre diferentes níveis de ensino e regiões.  
3. **Índice de Desenvolvimento da Educação Básica (Ideb)**:   O dataset br_inep_ideb disponibiliza tabelas que identificam as notas dos alunos em avaliações da qualidade do ensino, como as provas do SAEB, além de informações sobre taxas de rendimento, como aprovação, reprovação e abandono, e o desempenho das escolas no IDEB. Junto com as tabelas do Censo, pode-se avaliar, por exemplo, como escolas com mais professores com mestrado se saem nessas provas em relação a escolas com professores que não têm pós-graduação.

# Download dos dados
Essas tabelas são muito grandes para o download direto, é muito importante fazer seleção de colunas e filtros temporais ou geográficos antes de fazer o download dos dados

Os microdados somam mais de 300 GB. Para evitar sobrecarregar seu computador, recomendamos usar queries no BigQuery para processar os dados em nuvem antes de baixá-los. Filtre pelas colunas de partição (como ano e UF) e selecione apenas as colunas relevantes.

# Instrumento de coleta
Os dados do Censo Escolar são coletados em duas etapas. No primeiro semestre, as escolas preenchem cinco formulários (escolas, gestores, turmas, alunos e profissionais em sala de aula) com informações de todas as instituições de educação básica e profissional. No final do ano letivo, a segunda etapa registra a situação dos alunos, informando se foram aprovados, reprovados, transferidos, deixaram de frequentar ou faleceram.

# Mudanças na coleta
A principal mudança ao longo dos anos foi a substituição das tabelas de matrículas, docentes e gestores escolares por uma única tabela de escolas com dados agregados. A partir de 2021, essa nova tabela incluiu 123 novas variáveis, permitindo acesso a algumas informações sobre matrículas, docentes e gestores escolares de forma resumida.

# Atualizações
Os dados são atualizados anualmente no começo do ano seguinte a coleta de dados.

# Tratamentos feitos pela BD:


# Materiais de apoio
[Site do INEP sobre o Censo Escolar](https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/censo-escolar): Documentos e instruções sobre o Censo Escolar, útil para entender melhor o contexto e conseguir materiais complementares como os formulários que são preenchidos, datas de divulgação e coleta, entre outras informações. 
[Nota da BD sobre mudança na divulgação dos dados do Censo Escolar](https://basedosdados.org/blog/nota-sobre-divulgacao-dos-dados-do-inep): Nota posicionando a BD na mudança que ocorreu em 2021
