import {
  Box,
  Flex,
  HStack,
  Stack,
  VStack
} from "@chakra-ui/layout";
import Display from "../components/atoms/Display";
import BodyText from "../components/atoms/BodyText";
import { Image } from "@chakra-ui/image";
import Head from "next/head";
import BigTitle from "../components/atoms/BigTitle";
import Link from "../components/atoms/Link";
import RoundedButton from "../components/atoms/RoundedButton";
import SectionText from "../components/atoms/SectionText";
import SectionTitle from "../components/atoms/SectionTitle";
import { KnowOurServices } from "../components/molecules/KnowOurServices";
import { NamedAvatar } from "../components/molecules/NamedAvatar";
import { MainPageTemplate } from "../components/templates/main";
import { withPages } from "../hooks/pages.hook";
import { isMobileMod } from "../hooks/useCheckMobile.hook";
import BDLogoProImage from "../public/img/logos/bd_logo_pro"

export async function getStaticProps(context) {
  return await withPages();
}

function FixedBottomBar() {
  return (
    <Stack
      position="fixed"
      bottom="0px"
      width="100%"
      padding="10px 20px"
      height="70px"
      backgroundColor="#3AA1EB"
      justify="center"
      align="center"
      spacing={10}
      boxShadow="0px 2px 10px 2px rgba(0, 0, 0, 0.15)"
      zIndex="100"
      direction={{ base: "row", lg: "column" }}
    >
      <SectionText fontWeight="500" fontFamily="Ubuntu" color="white">
        Gostaria de marcar uma reunião com nossa equipe?
      </SectionText>
      <Link
        position={{ base: "initial", lg: "fixed" }}
        bottom="14px"
        right="20%"
        href="/blog/1/"
        textDecoration="none !important"
      >
        <RoundedButton
          _hover={{
            backgroundColor: "white",
            color: "#3AA1EB",
          }}
          color="#3AA1EB"
          backgroundColor="white"
        >
          Entre em contato
        </RoundedButton>
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
      alt=""
      height="30px"
      width="30px"
      src="https://storage.googleapis.com/basedosdados-website/images/group+122.png"
    />
  ),
  ...props
}) {
  return (
    <Flex
      id={title}
      direction={{ base: "column-reverse", lg: "row" }}
      paddingTop="80px"
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
        <Image alt={title} src={imageUrl} />
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
      height="230px"
      spacing={4}
    >
      <SectionTitle fontSize="16px">{title}</SectionTitle>
      <SectionText fontWeight="300" fontSize="14px" textAlign="center">
        {children}
      </SectionText>
    </VStack>
  );
}

function BDPro () {
  return (
    <Stack
      width={{ base: "90%", lg: "85%" }}
      maxWidth="1264px"
      margin={isMobileMod() ? "80px auto 54px" :"80px auto 180px"}
      alignItems="center"
    >
      <BDLogoProImage
        widthImage={isMobileMod() ? "120px" : "240px"}
        heightImage={isMobileMod() ? "30px" : "60px"}
        marginBottom={isMobileMod() ? "24px" : "40px"}
      />
      <Display
        fontSize={isMobileMod() ? "34px" : "90px"}
        letterSpacing={isMobileMod() ? "-0.4px" : "-2.25px"}
        lineHeight={isMobileMod() ? "44px" : "108px"}
        textAlign="center"
        margin="0 0 24px !important"
      > 
      A sua plataforma {!isMobileMod() &&<br/>} avançada de dados
      </Display>
      <BodyText
        fontWeight="400"
        fontSize={isMobileMod() ? "18px" : "28px"}
        lineHeight={isMobileMod() ? "24px" : "44px"}
        letterSpacing={isMobileMod() ? "0.1px" : "-0.1px"}
        textAlign="center"
        margin={isMobileMod() ? "0 0 24px !important" : "0 0 40px !important"}
      >
        Assine agora o nosso datalake privado para ter acesso aos {!isMobileMod() &&<br/>} dados mais valiosos para você e sua organização
      </BodyText>
      <RoundedButton
        fontSize={!isMobileMod() && "24px"}
        padding={!isMobileMod() && "32px"}
        margin="0 !important"
        backgroundColor="#8A7500"
      >
        <a href="https://info.basedosdados.org/bd-pro" target="_blank">
          Assine a BD Pro
        </a>
      </RoundedButton>
    </Stack>
  )
}

export default function Services({ pages }) {
  const services = {
    "Captura de dados":
      "https://storage.googleapis.com/basedosdados-website/images/cloud.png",
    "Análise de dados":
      "https://storage.googleapis.com/basedosdados-website/images/bar.png",
    "Consultoria de dados":
      "https://storage.googleapis.com/basedosdados-website/images/lightbulb.png",
  };

  return (
    <MainPageTemplate pages={pages}>
      <Head>
        <title>Serviços – Base dos Dados</title>
        <meta
          property="og:title"
          content="Serviços – Base dos Dados"
          key="ogtitle"
        />
      </Head>

      <BDPro/>

      <VStack
        paddingTop={{ base: "50px", lg: "0px" }}
        width="80%"
        margin="auto"
      >
        <BigTitle textAlign="center" maxWidth="100%" paddingBottom="20px">
          Nossos serviços
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
                <Image alt="" marginBottom="15px" height="100px" src={v} />
                <SectionText fontSize="18px" fontWeight="bold">
                  {k}
                </SectionText>
              </VStack>
            </Link>
          ))}
        </Stack>
        <Section
          title="Captura de dados"
          imageUrl="https://storage.googleapis.com/basedosdados-website/images/ilustracao-captura-dados-2.png"
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
        <BigTitle fontFamily="Lato" fontSize="18px" paddingBottom="20px">
          Nosso trabalho com engenharia de dados
        </BigTitle>
        <Stack
          justifyContent="space-between"
          width="100%"
          direction={{ base: "column", lg: "row" }}
          align="center"
          paddingBottom="50px"
        >
          <BorderBox title="Tecnologia de ponta">
            Utilizando da infraestrutura do <i>Google Cloud Platform</i>, uma
            das maiores plataformas de armazenamento e processamento de dados,
            garantimos a segurança e a confiabilidade do nosso trabalho.
          </BorderBox>
          <BorderBox title="Flexibilidade">
            Seja envios pontuais, atualizações recorrentes, acesso via{" "}
            <i>API</i>, ou conexão com plataformas de <i>BI</i>, entregamos a
            solução que você precisa de forma ágil e completa.
          </BorderBox>
          <BorderBox
            title={
              <>
                <i>Frameworks</i> reconhecidos
              </>
            }
          >
            Com <i>frameworks</i> e sistemas de gestão de dados tais como{" "}
            <i>CKAN</i>, garantimos a qualidade e a organização do seu sistema
            de dados sem gerar qualquer preocupação para sua equipe.
          </BorderBox>
        </Stack>
        <Section
          title="Análise de dados"
          imageUrl="https://storage.googleapis.com/basedosdados-website/images/ilustracao-analises.png"
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
          As informações e <i>insights</i> são geradas a partir de diversos
          conjuntos de dados já tratados no nosso <i>datalake</i> público
          atrelado à <i>expertise</i> da nossa equipe de Dados. E mais:
          utilizamos nossa metodologia padrão de tratamento para que você também
          possa cruzar esses dados com quaisquer outras bases disponíveis no{" "}
          <i>datalake</i>.
        </Section>
        <BigTitle fontSize="18px" fontFamily="Lato" paddingBottom="10px">
          Exemplos de análises
        </BigTitle>
        <Flex paddingBottom="50px" direction={{ base: "column", lg: "row" }}>
          <Box flex="1">
            <Image alt="grafico combustiveis inflacao" src="https://storage.googleapis.com/basedosdados-website/images/grafico-combustiveis-inflacao.png" />
          </Box>
          <Box flex="1">
            <Image alt="grafico desligamentos morte" src="https://storage.googleapis.com/basedosdados-website/images/grafico_desligamentos_morte.png" />
          </Box>
        </Flex>
        <Section
          title="Consultoria de dados"
          imageUrl="https://storage.googleapis.com/basedosdados-website/images/ilustracao-mentoria.png"
          listTitle="Principais vantagens:"
          paddingBottom="50px"
          listChildren={[
            <>
              Experiência em construir infraestruturas capazes de suportar
              milhares de acessos mensais;
            </>,
            <>Flexibilidade para projetos remotos em qualquer lugar do país;</>,
            <>
              Equipe diversa e com <i>expertise</i> em diferentes áreas do
              conhecimento e dados.
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
        <BigTitle fontSize="18px" fontFamily="Lato" paddingBottom="20px">
          Frentes de atuação
        </BigTitle>
        <Stack
          justifyContent="space-between"
          width="100%"
          direction={{ base: "column", lg: "row" }}
          align="center"
        >
          <BorderBox title="Infraestrutura">
            Mentoria para equipes de engenharia de dados que buscam estruturar
            processos de manutenção de dados, seus próprios <i>datalakes</i> ou
            ainda alavancarem-se utilizando a infraestrutura da Base dos Dados.
          </BorderBox>
          <BorderBox title="Análise">
            Workshops práticos, mostrando como funciona o <i>datalake</i> da
            Base dos Dados e ensinando como explorar dados públicos para
            matérias jornalísticas ou pesquisas científicas.
          </BorderBox>
          <BorderBox title="Programação">
            Programas personalizados de ensino para utilizar pacotes de Python e
            R da Base dos Dados, além de mentoria de SQL para construir análises
            rápidas e escaláveis direto na nuvem.
          </BorderBox>
        </Stack>
        <BigTitle paddingTop="80px" paddingBottom="10px" color="#2B8C4D">
          Nosso fluxo de trabalho
        </BigTitle>
        <SectionText paddingBottom="50px">
          Uma mesma metodologia de trabalho para todos os serviços, pautada na
          satisfação dos clientes e na primazia pela qualidade.
        </SectionText>
        <KnowOurServices paddingBottom="50px" />
      </VStack>
      <FixedBottomBar />
    </MainPageTemplate>
  );
}
