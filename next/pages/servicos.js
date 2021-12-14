import { Image } from "@chakra-ui/image";
import { Box, Flex, HStack, Stack, VStack } from "@chakra-ui/layout";
import BigTitle from "../components/atoms/BigTitle";
import Link from "../components/atoms/Link";
import RoundedButton from "../components/atoms/RoundedButton";
import SectionText from "../components/atoms/SectionText";
import SectionTitle from "../components/atoms/SectionTitle";
import { KnowOurServices } from "../components/molecules/KnowOurServices";
import { NamedAvatar } from "../components/molecules/NamedAvatar";
import { MainPageTemplate } from "../components/templates/main";
import { withStrapiPages } from "../hooks/strapi.hook";

export async function getStaticProps(context) {
  return await withStrapiPages();
}

function FixedBottomBar() {
  return (
    <Stack
      position="fixed"
      bottom="0px"
      width="100%"
      padding="10px 20px"
      height="70px"
      backgroundColor="#2B8C4D"
      justify="center"
      align="center"
      spacing={10}
      boxShadow="0px 2px 10px 2px rgba(0, 0, 0, 0.15)"
      zIndex="100"
      direction={{ base: "row", lg: "column" }}
    >
      <SectionText fontWeight="400" fontFamily="Ubuntu" color="white">
        Gostaria de marcar uma reunião com nossa equipe?
      </SectionText>
      <Link
        position={{ base: "initial", lg: "fixed" }}
        bottom="14px"
        right="20%"
        href="/blog/1/"
      >
        <RoundedButton>Entre em contato</RoundedButton>
      </Link>
    </Stack>
  );
}

function Section({
  title,
  children,
  listTitle = "",
  imageUrl,
  listChildren = [],
  listBulletFunc = () => (
    <Image
      height="30px"
      width="30px"
      src="https://basedosdados-static.s3.us-east-2.amazonaws.com/images/Group+122.png"
    />
  ),
  ...props
}) {
  return (
    <Flex
      id={title}
      direction={{ base: "column-reverse", lg: "row" }}
      {...props}
    >
      <VStack align="flex-start" flex="3">
        <SectionTitle fontSize="24px" fontFamily="Ubuntu" marginBottom="20px">
          {title}
        </SectionTitle>
        <SectionText fontSize="15px" paddingBottom="20px">
          {children}
        </SectionText>
        <VStack align="flex-start">
          <SectionText fontSize="15px">{listTitle}</SectionText>
          {listChildren.map((children, index) => (
            <HStack>
              {listBulletFunc(index)}
              <SectionText fontSize="15px">{children}</SectionText>
            </HStack>
          ))}
        </VStack>
      </VStack>
      <Box
        paddingBottom={{ base: "30px", lg: "0px" }}
        marginLeft="5vw"
        flex="2"
      >
        <Image src={imageUrl} />
      </Box>
    </Flex>
  );
}

function BorderBox({ title, children }) {
  return (
    <VStack
      textAlign="center"
      borderRadius="18px"
      padding="25px"
      border="1.5px solid #DEDFE0"
      width="350px"
      height="280px"
      spacing={4}
    >
      <SectionTitle fontSize="20px">{title}</SectionTitle>
      <SectionText fontWeight="400" fontSize="16px" textAlign="center">
        {children}
      </SectionText>
    </VStack>
  );
}

export default function Services({ strapiPages }) {
  const services = {
    "Captura de dados":
      "https://basedosdados-static.s3.us-east-2.amazonaws.com/images/cloud.png",
    "Análise de dados":
      "https://basedosdados-static.s3.us-east-2.amazonaws.com/images/bar.png",
    "Consultoria de dados":
      "https://basedosdados-static.s3.us-east-2.amazonaws.com/images/lightbulb.png",
  };

  return (
    <MainPageTemplate strapiPages={strapiPages}>
      <VStack
        paddingTop={{ base: "50px", lg: "0px" }}
        width="80%"
        margin="auto"
      >
        <BigTitle textAlign="center" maxWidth="100%" paddingBottom="20px">
          Conheça nossos serviços
        </BigTitle>
        <SectionText fontFamily="Ubuntu" paddingBottom="40px">
          A Base dos Dados é a especialista que ajuda você ou sua equipe a
          trabalhar e extrair o máximo de valor dos dados.
        </SectionText>
        <Stack
          justify="space-between"
          width="80%"
          paddingBottom="50px"
          direction={{ base: "column", lg: "row" }}
        >
          {Object.entries(services).map(([k, v]) => (
            <Link href={`#${k}`}>
              <VStack justify="flex-end">
                <Image marginBottom="15px" height="100px" src={v} />
                <SectionText fontSize="12px" fontWeight="bold">
                  {k}
                </SectionText>
              </VStack>
            </Link>
          ))}
        </Stack>
        <Section
          title="Captura de dados"
          imageUrl="https://basedosdados-static.s3.us-east-2.amazonaws.com/images/ilustracao_captura_dados-2.png"
          listTitle="Principais vantagens"
          paddingBottom="50px"
          listChildren={[
            <>
              <b>Rapidez:</b> Mesmo <i>queries</i> muito complexas demoram
              apenas minutos para serem processadas;
            </>,
            <>
              <b>Escala</b>: Nosso <i>datalake</i> escala magicamente para
              hexabytes se necessário;
            </>,
            <>
              <b>Baixo custo</b>: Todo usuário possui 1TB gratuito por mês para
              consulta aos dados.
            </>,
          ]}
        >
          <b>
            Capturamos e disponibilizamos dados sob demanda com rapidez, escala
            e baixo custo.
          </b>{" "}
          Você não precisa se preocupar em criar e manter uma infraestrutura
          própria ou escrever códigos - nós cuidamos disso. Tudo é feito
          seguindo a metodologia de tratamento e padronização da Base dos Dados,
          e conforme as melhores práticas de engenharia de dados do mercado. As
          tabelas tratadas podem ser disponibilizadas com exclusividade ou serem
          públicas.
        </Section>
        <SectionText paddingBottom="20px">
          Nosso trabalho com engenharia de dados
        </SectionText>
        <Stack
          justifyContent="space-between"
          width="100%"
          direction={{ base: "column", lg: "row" }}
          align="center"
          paddingBottom="50px"
        >
          <BorderBox title="Tecnologia de ponta">
            Utilizando da infraestrutura do Google Cloud Platform, uma das
            maiores plataformas de armazenamento e processamento de dados,
            garantimos a segurança e a confiabilidade do nosso trabalho.
          </BorderBox>
          <BorderBox title="Flexibilidade">
            Seja envios pontuais, atualizações recorrentes, acesso via API, ou
            conexão com plataformas de BI, entregamos a solução que você precisa
            de forma ágil e completa.
          </BorderBox>
          <BorderBox title="Frameworks reconhecidos">
            Com frameworks e sistemas de gestão de dados tais como CKAN,
            garantimos a qualidade e a organização do seu sistema de dados sem
            gerar qualquer preocupação para sua equipe.
          </BorderBox>
        </Stack>
        <Section
          title="Análise de dados"
          imageUrl="https://basedosdados-static.s3.us-east-2.amazonaws.com/images/ilustracao_analises.png"
          listTitle="Exemplos de perguntas que podemos responder:"
          paddingBottom="50px"
          listChildren={[
            <>
              Como vem evoluindo a economia brasileira, com indicadores
              detalhados mensais por setor?
            </>,
            <>
              Quais escolas terão <i>performance</i> acima da média do estado em
              matemática no ano que vem?
            </>,
            <>
              Quantas vezes o Diário Oficial da União publica sobre certo tema a
              cada dia?
            </>,
          ]}
        >
          <b>
            Construímos análises, relatórios e indicadores essenciais para sua
            pesquisa ou tomada de decisão.
          </b>{" "}
          As informações e insights são geradas a partir de diversos conjuntos
          de dados já tratados no nosso datalake público atrelado à expertise da
          nossa equipe de Dados. E mais: utilizamos nossa metodologia padrão de
          tratamento para que você também possa cruzar esses dados com quaisquer
          outras bases disponíveis no datalake.
        </Section>
        <Flex paddingBottom="50px" direction={{ base: "column", lg: "row" }}>
          <Box flex="1">
            <Image src="https://basedosdados-static.s3.us-east-2.amazonaws.com/images/grafico_combustiveis_inflacao.png" />
          </Box>
          <Box flex="1">
            <Image src="https://basedosdados-static.s3.us-east-2.amazonaws.com/images/grafico_desligamentos_morte.png" />
          </Box>
        </Flex>
        <Section
          title="Consultoria de dados"
          imageUrl="https://basedosdados-static.s3.us-east-2.amazonaws.com/images/ilustracao_mentoria.png"
          listTitle="Principais vantagens:"
          paddingBottom="50px"
          listChildren={[
            <>
              Experiência em construir infraestruturas capazes de suportar
              milhares de acessos mensais;
            </>,
            <>Flexibilidade para projetos remotos em qualquer lugar do país;</>,
            <>
              Equipe diversa e com expertise em diferentes áreas do conhecimento
              e dados.
            </>,
          ]}
        >
          <b>
            Orientamos como aplicar a nossa metodologia de limpeza, estruturação
            e padronização de dados
          </b>{" "}
          no seu projeto ou organização através de workshops e materiais
          exclusivos. Reproduzir nosso processo de tratamento em seu próprio
          banco de dados pode poupar horas de trabalho de sua equipe ao
          consultar, manipular ou atualizar as informações.
        </Section>
        <SectionText paddingBottom="20px">Frentes de atuação</SectionText>
        <Stack
          justifyContent="space-between"
          width="100%"
          direction={{ base: "column", lg: "row" }}
          align="center"
        >
          <BorderBox title="Infraestrutura">
            Mentoria para equipes de engenharia de dados que buscam estruturar
            processos de manutenção de dados, seus próprios datalakes ou ainda
            alavancarem-se utilizando a infraestrutura da Base dos Dados.
          </BorderBox>
          <BorderBox title="Análise">
            Workshops práticos, mostrando como funciona o datalake da Base dos
            Dados e ensinando como explorar dados públicos para matérias
            jornalísticas ou pesquisas científicas.
          </BorderBox>
          <BorderBox title="Programação">
            Programas personalizados de ensino para utilizar pacotes de Python e
            R da Base dos Dados, além de mentoria de SQL para construir análises
            rápidas e escaláveis direto na nuvem.
          </BorderBox>
        </Stack>
        <SectionTitle paddingTop="80px" paddingBottom="20px" color="#2B8C4D">
          Nosso fluxo de trabalho
        </SectionTitle>
        <SectionText paddingBottom="20px">
          Uma mesma metodologia de trabalho para todos os serviços, pautada na
          satisfação dos clientes e na primazia pela qualidade.
        </SectionText>
        <KnowOurServices paddingBottom="50px" />
      </VStack>
      <FixedBottomBar />
    </MainPageTemplate>
  );
}
