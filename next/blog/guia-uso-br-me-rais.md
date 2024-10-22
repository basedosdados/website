# RAIS
## Como esses dados são coletados?
### Que instituição é responsável?
Ministério do Trabalho e Emprego (MTE)
### Qual o instrumento de coleta?
O instrumento de coleta atual é um formulário que deve ser preenchido pelos empregadores do país sobre seus empregados. 
### Quais links podem ajudar a entender melhor o contexto dessa base?
* [Manual de Orientação](http://www.rais.gov.br/sitio/rais_ftp/ManualRAIS2023.pdf): Tem todas as instruções de como os empregadores devem preencher os campos. Ajuda a compreender o que cada campo representa com mais detalhe
* [Site do MTE](http://www.rais.gov.br/sitio/sobre.jsf): Várias informações detalhadas sobre a RAIS 
## Particularidades do Conjunto:
### Tabelas
Essa base possui 2 tabelas: 
* Microdados Estabelecimentos: cada linha representa um estabelecimento e suas características para cada ano de declaração
* Microdados Vínculos: cada linha representa um vínculo e suas características para cada ano de declaração
Essas tabelas são desidentificadas, ou seja, não temos as informações dos CNPJs nem dos CPFs envolvidos. Isso significa que não é possível fazer um cruzamento entre elas, nem com outras bases de dados que possuam cnpj 
### Linhas Duplicadas
Ainda não foram encontrados indícios de linhas duplicadas nessa base. Mas é importante ressaltar que a base de Vínculos inclui todos os vínculos que uma empresa teve durante o ano. Assim, se algum empregado foi demitido e outro contratado dentro do mesmo ano, terão 2 linhas para a mesma posição naquela empresa. Caso o objetivo seja de avaliar o tamanho do setor ou região é importante utilizar o campo de vinculo_ativo_3112 para filtrar apenas os vínculos que estão ativos ao mesmo tempo.
### Inconsistências
Um usuário percebeu que as variáveis quantidade_vinculos_ativos e tamanho_estabelecimento  da tabela de estabelecimentos tem informações discrepantes entre si. A primeira tem um valor inteiro representando o total de vínculos daquele estabelecimento, a segunda é uma categoria definida pelo total de vínculos, mas mesmo assim encontramos vários casos que a quantidade de vínculos não está dentro da faixa definida pelo tamanho do estabelecimento. Ainda não se sabe por que essa inconsistência. 

A base da RAIS deveria registrar todos os vínculos de trabalho uma vez ao ano, enquanto o CAGED seria responsável por todas as movimentações desses vínculos. Teoricamente, ao somar ou subtrair todas as movimentações registradas no CAGED a partir de um total de vínculos em um determinado ano dado pela RAIS, seria possível chegar ao total do ano seguinte. No entanto, isso não ocorre na prática. Ainda não sabemos porque isso ocorre, mas como os dois sistemas operam de forma independente, é provável que cada um acumule diferentes tipos de erros, o que resulta em divergências nos números.
### Essa base envolve observações repetidas ao longo do tempo?
A cada ano temos uma atualização da base, assim um estabelecimento aparece em todos os anos que seu cnpj estava ativo, assim como um mesmo vínculo aparece em mais de um ano se continuar ativo. Por conta da base ser desidentificada não é possível acompanhar a evolução dos vínculos ou empresas ao longo do tempo.
### É uma base muito grande que justifica pré tratamentos no BigQuery?
Essa base contém todos os vínculos empregatícios do país desde 1984 e isso representa mais de 350 GB armazenados. Um computador normal não é capaz de trabalhar isso tudo de dados, por isso é necessário trabalhar no bigquery e fazer filtros e agregações antes de baixar os dados. Recomendamos fazer filtros utilizando as colunas de partições (ano, sigla_uf) e selecionar apenas as colunas que sejam do seu interesse.
### É um dado amostral? Existe alguma coluna de peso que deve ser usada para calcular estatísticas?
Não esses são dados que incluem todos os vínculos empregatícios do Brasil, não é necessário utilizar nenhum tipo de peso.
### Existe alguma mudança na forma como os dados foram coletados ao longo do tempo?
Sim, algumas variáveis pararam de ser coletadas e outras foram incluídas ao longo do tempo. Para obter os detalhes de quais colunas entraram e saíram ver a coluna de cobertura temporal da coluna no site
### Conexões externas:
Esse conjunto de dados é interessante de ser cruzado com outras bases que possuem a informação de CNAE e de CEP, já que não é possível cruzar CNPJs. 
## Tratamentos que foram feitos:
O tratamento das duas tabelas do conjunto é muito similar: 
- Alterou as colunas que identificam municípios para o padrão de ID Município IBGE - 7 Dígitos
- Alterou colunas que identificam Unidades Federativas para o padrão de sigla
- Alterou códigos de bairros, cbo, cnae e ano que são considerados inválidos (estilo ‘9999’ ou ‘000’) para vazio
- Ajustou o conteúdo da coluna  tipo_estabelecimento  para que os códigos ficassem padronizado entre anos

## Dúvidas
### Precisava dos dados completos e identificados da RAIS, onde eu consigo?
É necessário fazer uma solicitação nesse link ao Ministério do Trabalho, mas já adiantamos que não é um processo rápido e nem garantido que vai ocorrer. 
### Estou avaliando os dados obtidos e eles estão diferentes do painel oficial da RAIS. Vocês sabem por quê?
Já aconteceu de os dados da RAIS as vezes serem atualizados e nós não ficarmos sabendo. Se você está confiante que está fazendo as queries certas, entra em contato conosco enviando a querie e a diferença com o site oficial para que a gente possa avaliar a situação e se necessário corrigir. 
### Quando os dados da RAIS são atualizados?
Normalmente a base é atualizada no início do ano seguinte da coleta, isso significa que os dados referentes ao ano de 2022 só saí no início de 2024. 
### Os dados de endereço se referem a empresa ou a moradia do trabalhador?
Segundo o manual de preenchimento da RAIS o empregado não preenche informações de endereço do trabalhador. O campo id_municipio se refere ao município da empresa contratante e id_municipio_trabalho é utilizado caso trabalhador preste seus serviços fora do município do contratante. 
### Dúvidas em aberto
Aqui temos uma lista das dúvidas que já chegaram para nós e não encontramos a solução, se souber a resposta ou tiver outras dúvidas que não foram sanadas por esse guia, pode entrar em contato conosco ou editar esse artigo:
* Por que valores pela variavel id_municipio_trabalho nos dados vínculos são só disponiveis nos anos 2005-2011 e 2017-2021? Nos anos que esta variável não está disponível podemos considerar como se o município de trabalho é igual ao id_município?
* Como explicar as diferenças entre as admissões e demissões do CAGED com os resultados da RAIS?
* Porque existe a inconsistência entre quantidade_vinculos_ativos e tamanho_estabelecimento?

## Exemplos de perguntas e consultas:
Qual a diferença de salário entre os trabalhadores brancos e não brancos ao longo dos anos?
```sql
SELECT A.ano as ano, 
rem_media_nbrancos, 
rem_media_brancos,
(rem_media_nbrancos/rem_media_brancos) AS wage_gap
FROM
	(SELECT ano, AVG(valor_remuneracao_media) as rem_media_nbrancos
	FROM `basedosdados.br_me_rais.microdados_vinculos`
	WHERE raca_cor='4' OR raca_cor='8' OR raca_cor='1'
	AND ano>=2006
	GROUP BY ano) AS rem_nbrancos
	LEFT JOIN
	(SELECT ano, AVG(valor_remuneracao_media) as rem_media_brancos
	FROM `basedosdados.br_me_rais.microdados_vinculos`
	WHERE raca_cor='2'
	AND ano>=2006
	GROUP BY ano) AS rem_brancos
	ON rem_nbrancos.ano=rem_brancos.ano
ORDER by ano
```

