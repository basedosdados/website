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
Esse conjunto possui quatro tabelas 
:  
- **Escolas:** Única tabela disponibilizada pelo INEP a partir de 2021, cada linha representa uma escola. As colunas incluem características da escola, como infraestrutura física disponível, a equipe pedagógica, a infraestrutura pedagógica, marcas do período letivo, e informações agregadas sobre matrículas, docentes e turmas.
- **Turmas:** Tabela disponibilizada a partir de requisições via pedidos LAI. Cada linha representa uma turma ativa no ano escolar, as colunas contém informações de disciplinas feitas pela turma, o horário de começo das aulas, o número de alunos da turma e o nível de ensino.
- **Matrículas:** Mantida para consulta histórica, mas não atualizada desde 2021. Cada linha representa uma matricula, as colunas incluem variáveis sociodemográficas, atividades que o aluno realiza e a forma de transporte para acesso a escola. 
- **Docentes:** Mantida para consulta histórica, mas não atualizada desde 2021. Cada linha representa uma alocação de um docente em uma turma com uma escola durante um ano, as colunas possuem caracteristicas sociodemográficas, de formação e de atividade do docente. 

# Considerações para análises
## Seleção de variáveis
Não disponibilizamos todas as variáveis que aparecem no Censo. Selecionamos a maioria das variáveis, as que aparecem mais vezes. Pegamos as variáveis que aparecem 8 ou mais vezes ao longo dos 12 anos, além de outras variáveis que julgamos serem cruciais por serem identificadoras importantes. Isso significa que, se a variável só aparece em 2 anos, por exemplo, ela não foi incluída nas nossas tabelas.

## Informação de raça** 
A coluna de raça é conhecidamente pouco preenchida. A forma de preenchimento dessa informação é feita pela administração da escola e não pelo proprio aluno o que pode gerar problemas. Outra fonte de dados de raça é a prova SAEB que coleta essa informação. As informações de raça do censo escolar e do SAEB diferem bastante por conta de metodologias diferentes e também pela falta de preenchimento dessa informação no censo escolar. 

# Limitações
* Optamos por disponibilizar os dados a partir de 2009. O período é o mais uniforme da pesquisa e foi quando ela manteve o mesmo formato, o que facilita e corrobora com a compatibilização entre diferentes anos.

# Inconsistências
Ainda não foram reportadas inconsistências

# Observações ao longo tempo
Os alunos e docentes tem informações anonimizadas, por isso não é possível acompanhar essas enteidades através dos anos na tabela de matriculas e docentes. As escolas por sua vez são identificáveis e podem ser acompanhadas ao longo dos anos.
Também é importante observar que as tabelas de matriculas e docentes pararam de ser disponibilizadas em 2020, por isso análises ao longo do tempo que usam essas tabelas devem parar nesse ano.

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

# Instituição responsável
Instituto Nacional de Estudos e Pesquisas Educacionais Anísio Teixeira (INEP)

# Instrumento de coleta
Os dados do censo escolar são coletados em duas etapas. A primeira é feita no primeiro semestre do ano através da coleta de dados utilizando 5 tipos de formulários (escolas, gestores, turmas, alunos e profissionais escolares em sala de aula) que devem ser preenchidos por todos os estabelecimentos públicos e privados de educação básica e educação profissional e tecnológica. A segunda etapa do Censo Escolar coleta as informações de rendimento e movimento escolar ao final do ano letivo. Para fornecer informações sobre rendimento do aluno no Sistema Educacenso, a escola declara a condição de aprovado, reprovado, transferido, deixou de frequentar ou falecido.
  
# Mudanças na coleta
A mais importante mudança ao longo dos anos foi pararem de disponibilizar as tabelas de matriculas, docentes e de gestor escolar para passar a disponibilizar apenas a tabela escola com informações agregadas.   A partir da mudança em 2021, foram adicionadas 123 variáveis na tabela de escola que garantiram o acesso as algumas informações referentes a matrículas e docentes de maneira agregada 

# Atualizações
Os dados são atualizados anualmente no começo do ano seguinte a coleta de dados.

# Tratamentos feitos pela BD:


# Materiais de apoio
[Site do INEP sobre o Censo Escolar](https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/censo-escolar): Documentos e instruções sobre o Censo Escolar, útil para entender melhor o contexto e conseguir materiais complementares como os formulários que são preenchidos, datas de divulgação e coleta, entre outras informações. 
[Nota da BD sobre mudança na divulgação dos dados do Censo Escolar](https://basedosdados.org/blog/nota-sobre-divulgacao-dos-dados-do-inep): Nota posicionando a BD na mudança que ocorreu em 2021
