---
title: Como entender as exportações e importações brasileiras?
description: >- 
  Entenda como usar os os dados públicos da ComexStat para analisar o comércio exterior brasileiro
date:
  created: "2025-07-01T21:02:04.375Z"
authors:
  - name: Marina Monteiro
    role: Análise e texto
  - name: Thais Filipi
    role: Análise e texto
  - name: Giovane Caruso e José Félix
    role: Edição de texto e arte
categories: [analise]
thumbnail: 
medum_slug: 
published: true
order: 0
---

Você, leitor de longa data da BDLetter, deve ter estranhado essa pergunta. Afinal, costumamos preferir perguntas mais específicas (uma boa pergunta costuma ser bem delimitada). Mas hoje queremos explorar essa questão extremamente abrangente e falar sobre sua resposta: a Comex Stat.

A Comex Stat é o sistema oficial do governo brasileiro para estatísticas de comércio exterior, mantido pelo Ministério do Desenvolvimento, Indústria, Comércio e Serviços (MDIC). Ela reúne informações detalhadas sobre importações e exportações do Brasil, com alto nível de desagregação por produto, país de origem/destino, estado, município e via de transporte. Na Base dos Dados, disponibilizamos as principais tabelas extraídas desse sistema, incluindo séries históricas mensais de exportações e importações, com detalhamento por NCM (Nomenclatura Comum do Mercosul), parceiros comerciais e unidades da federação. Esses conjuntos permitem análises tanto em nível agregado quanto em recortes específicos, como os principais produtos exportados por um município em determinado período.


Claro, não é apenas uma base no nosso datalake que vai dar todas as respostas para suas perguntas sobre comércio exterior. Contexto é importante. Mas queremos apresentar alguns exemplos do que este poderoso conjunto de dados pode te ajudar a responder.

## A baixa instrialização brasileira

Você já deve ter ouvido falar que não somos um país muito industrializado. Podemos utilizar a Comex Stat para olhar mais detalhadamente como se dá essa baixa industrialização nacional sob a perspectiva do comércio exterior. Ao olharmos nossas importações e exportações, é possível notar uma assimetria: importamos uma grande quantidade de bens manufaturados, que carregam alto valor agregado, e exportamos especialmente commodities e produtos com baixo nível de processamento industrial. Essa diferença pode ser vista quando agrupamos nossas exportações e importações considerando a posição no Sistema Harmonizado (SH). 

 

O SH é uma nomenclatura adotada globalmente que ordena e agrupa mercadorias de forma progressiva de acordo com o grau de elaboração, começando pelos animais vivos (baixíssima influência humana) e terminando com obras de arte (altíssima influência humana). O SH é revisado e atualizado a cada cinco anos e a versão atual é o SH 2022. 

 

Na Base dos Dados, no conjunto de dados de Diretórios Mundiais, é possível encontrar a [tabela do Sistema Harmonizado](https://basedosdados.org/dataset/afc7c3a1-8691-4f3b-8566-bdce90f1100d?table=2399179d-0e74-4f1b-a940-7e418cafa02f&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz--9a4I7710KnANEHDFtnaxgrM3vUAcZUQ6qM8sSL20Ibcq388Bz4GEy8IQhm59xTZBd7PPD). Isso permite cruzamentos com as tabelas da Comex Stat: município exportação e município importação. Essas tabelas contém os dados (peso líquido e valor) por município da empresa exportadora e posição do SH.


No gráfico abaixo, podemos ver como se deu essa relação entre exportações e importações brasileiras em 2024. Note que as linhas representam a diferença entre o valor exportado e o valor importado para cada tipo de produto. 


<Image src="/blog/bdletter-44-como-entender-as-exportações-e-importações-brasileiras/grafico_1.png"/> 


É possível notar que, para o ano de 2024 (os dados de 2025 também já estão na BD), tivemos uma exportação extremamente mais significativa para produtos primários que para manufaturados. E esse é o comportamento histórico – você pode explorar os dados das mesmas [tabelas que utilizamos](https://github.com/basedosdados/analises/blob/main/redes_sociais/br_me_comex_stat_20251006.sql?utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz--9a4I7710KnANEHDFtnaxgrM3vUAcZUQ6qM8sSL20Ibcq388Bz4GEy8IQhm59xTZBd7PPD) aqui para ver como isso também acontece nos anos anteriores.

 Com os dados disponíveis, também é possível determinar quais os principais destinos de nossos produtos e bens. Ainda no ano de 2024, os principais parceiros comerciais do Brasil foram: China (importando cerca de 28% de todo valor exportado em bens), EUA (12%), Argentina (4%) e Países Baixos (3%).

 Considerando esse panorama, vamos aprofundar o olhar sobre o comércio com os EUA, nosso segundo maior parceiro comercial. 

## Brasil e EUA
 
É sabido que o Brasil mantém déficit comercial com os EUA: em 2024, para bens, este valor estava em torno de US$ 7 bilhões (e sim, você pode confirmar esse déficit consultando os dados da Comex Stat). Entre os principais produtos exportados para o mercado norte-americano, encontramos uma prevalência de produtos com baixa industrialização – exceto pelo terceiro lugar, veículos aéreos são bastante valiosos e, sem dúvida, produtos com grande industrialização.
 
<Image src="/blog/bdletter-44-como-entender-as-exportações-e-importações-brasileiras/imagem_1.png"/> 


Desta lista, destacamos um produto: o café. Em 2024 ele ocupou o quarto lugar entre os produtos mais exportados para os EUA, representando 4,7%  do total exportado para o país. Considerando a relevância recente após o anúncio das tarifas estadunidenses, podemos nos debruçar um pouco mais sobre este ponto. 


Pensando no café brasileiro como produto tarifado, uma consequência esperada seria uma diminuição na importação pelos americanos. Diante disso, surgiram especulações sobre o papel da China, nosso principal parceiro comercial, como possível destino alternativo para o café que deixa de ser escoado para os EUA. Mas será que isso é viável?
 

O Brasil é o principal produtor e exportador global de café e, segundo dados da Comex Stat, o café em grão, não torrado e não descafeinado foi exportado para os seguintes destinos no ano passado:

<Image src="/blog/bdletter-44-como-entender-as-exportações-e-importações-brasileiras/grafico_2.png"/> 

 Para determinar essa distribuição podemos utilizar a tabela NCM Exportação, que considera os dados de exportação por produto, através da nomenclatura comum do mercosul (NCM). Neste caso, utilizamos o NCM 09011110.

 

Com relação à China, podemos notar que não estamos lidando com a mesma ordem de grandeza nas importações de café. Em 12º lugar entre os importadores, a China importa apenas 1,23% do montante importado pelos EUA. No entanto, podemos considerar os dados históricos disponíveis e notar que essa porcentagem já foi ainda menor. Desde 2020 há um crescimento nas exportações brasileiras para a China do café verde.

<Image src="/blog/bdletter-44-como-entender-as-exportações-e-importações-brasileiras/grafico_3.png"/> 


É de se imaginar, então, que para que a China seja nova fonte de escoamento do café brasileiro (ao menos deste tipo de café), esse consumo precisa crescer, e muito. É fato que existe uma tendência de aumento perceptível nos últimos anos, mas a distância ainda é expressiva o suficiente para que precisemos encontrar outras formas de lidar com essa nova tarifa no mercado do café brasileiro. 


Este é um exemplo de como a Comex Stat nos permite investigar diversas relações do comércio exterior brasileiro, inclusive explorar o impacto de mudanças como o da política tarifária entre Brasil e EUA. Além disso, este conjunto de dados nos ajuda a fazer uma leitura crítica sobre o as limitações do nosso setor produtivo e desenvolvimento industrial. Afinal, a força dessa base de dados está na multiplicidade de perguntas que ela pode responder. 

---

Agora é a sua vez, databaser. Explore, conheça e analise os dados da Comex. Você pode, inclusive, utilizar os [códigos desta análise](https://github.com/basedosdados/analises/commit/a0061fd3b6cca7e4e7400981b0c5c985b5da456d?utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz--9a4I7710KnANEHDFtnaxgrM3vUAcZUQ6qM8sSL20Ibcq388Bz4GEy8IQhm59xTZBd7PPD) como inspiração. Depois nos conte quais insights você conseguiu encontrar. 

Acesse os dados da ComexStat por [aqui](https://basedosdados.org/dataset/74827951-3f2c-4f9f-b3d0-56e3aa7aeb39?table=f4b08023-5530-4dc9-bced-3321e8928fd7&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz--9a4I7710KnANEHDFtnaxgrM3vUAcZUQ6qM8sSL20Ibcq388Bz4GEy8IQhm59xTZBd7PPD).
