export const QuestionFAQ = [
  {
    question: "Preciso pagar para acessar os dados da BD?",
    answer: "Você não precisa pagar para utilizar nenhum serviço oferecido pela Base dos Dados. Porém, para acessar nossos dados tratados no BigQuery, você precisa criar um projeto no Google Cloud, que oferece até 1 Terabyte gratuito por mês para seus usuários. Caso você exceda esse limite, são cobrados 5 dólares por Terabyte de dados que sua consulta irá processar. Ressaltamos que esse limite costuma ser o suficiente, mesmo para análises com bases mais robustas, como a RAIS ou Censo Escolar. Para controlar os custos e otimizar sua consulta, confira nossas dicas de boas práticas na seção sobre BigQuery.",
    categories: ["Dados"]
  },
  {
    question: "Os dados da BD são públicos ou privados? ",
    answer: "Em sua grande maioria, as bases de dados encontradas em nossa plataforma são públicas, porém, também estão listadas algumas bases privadas. Nossa organização não possui fins lucrativos, portanto, não comercializamos a listagem de bases em nossa plataforma. Acreditamos ser útil listar conjuntos de dados privados, uma vez que as pessoas podem ter interesse em adquirí-las ao encontrá-las em nosso site.",
    categories: ["Dados"]
  },
  {
    question: "Quais tipos de dados encontro na BD?",
    answer: "Em nossa plataforma, você encontra três tipos de dados: tabelas tratadas BD+, fontes originais e pedidos LAI.",
    categories: ["Dados"]
  },
  {
    question: "O que é o datalake da BD no BigQuery?",
    answer: "É um banco de dados público hospedado no BigQuery, ferramenta potente de armazenamento e análise de dados do Google Cloud, com todas as tabelas tratadas BD+ para você consultar direto do seu navegador. As vantagens de utilizar nosso datalake no BigQuery estão relacionadas à velocidade do processamento, escalabilidade e economia. ",
    categories: ["BigQuery"]
  },
  {
    question: "O que acontece se eu exceder o limite mensal de 1 TB gratuito do Google Cloud?",
    answer: "Caso você exceda o limite, são cobrados 5 dólares por Terabyte de dados que sua consulta irá processar. Mas ressaltamos que o limite de 1 Terabyte do Google costuma ser suficiente, mesmo para análises com bases mais robustas, como a RAIS ou Censo Escolar. ",
    categories: ["BigQuery"]
  },
  {
    question: "Como criar um projeto no Google Cloud?",
    answer: "Para criar um projeto no Google Cloud, basta ter um email cadastrado no Google. É necessário ter um projeto seu, mesmo que vazio, para você fazer consultas em nosso datalake público. 1.Acesse o Google Cloud. Caso for a sua primeira vez, aceite os Termos de Serviços. 2.Clique em Create Project/Criar Projeto. Escolha um nome bacana para o projeto. 3.Clique em Create/Criar.",
    categories: ["BigQuery"]
  },
  {
    question: "Como a BD se financia?",
    answer: "Ao longo dos anos, a BD cresceu com o apoio financeiro de usuários e de pessoas que se identificam com nossa missão. Hoje, contamos também com nossa área de Serviços e Parcerias, criada para garantir a sustentabilidade da organização, de forma a manter e expandir nossos produtos de forma gratuita. A prestação de serviços de dados e a realização de projetos com parceiros vêm sendo chave não só na geração de receita, mas também no fortalecimento da nossa posição de referência na disponibilização de dados de qualidade. Confira mais sobre a contabilidade da organização em nossa página de Transparência.",
    categories: ["Institucional"]
  },
  {
    question: "Como citar a BD?",
    answer: "Você pode referenciar de duas maneiras: Apenas com o nome “Base dos Dados” (em português), “Data Basis” (em inglês) ou “Base de los Datos” (em espanhol); A partir do white paper Data Basis: Universalizing Access to High-Quality Data. Dahis et al. (2022) Data Basis: Universalizing Access to High-Quality Data. Disponível em: <osf.io/preprints/socarxiv/r76yg>",
    categories: ["Institucional"]
  },
]