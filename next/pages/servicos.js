import {
  Stack,
  VStack,
  Image,
} from "@chakra-ui/react";
import Display from "../components/atoms/Display";
import BodyText from "../components/atoms/BodyText";
import Head from "next/head";
import BigTitle from "../components/atoms/BigTitle";
import Link from "../components/atoms/Link";
import RoundedButton from "../components/atoms/RoundedButton";
import SectionText from "../components/atoms/SectionText";
import SectionTitle from "../components/atoms/SectionTitle";
import { KnowOurServices } from "../components/molecules/KnowOurServices";
import { MainPageTemplate } from "../components/templates/main";
import { withPages } from "../hooks/pages.hook";
import { isMobileMod } from "../hooks/useCheckMobile.hook";
import BDLogoProImage from "../public/img/logos/bd_logo_pro"

import CheckIcon from "../public/img/icons/checkIcon";

export async function getStaticProps(context) {
  return await withPages()
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

function BorderBox({ title, children }) {
  return (
    <VStack
      textAlign="center"
      borderRadius="18px"
      padding="25px"
      boxShadow="0 2px 16px 0 rgba(100, 96, 103, 0.16)"
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

function Slogan () {
  return (
    <Stack
      width="100%"
      maxWidth="950px"
      paddingTop="80px"
      spacing={0}
      margin={isMobileMod() ? "0 auto 60px" :"0 auto 100px"}
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
        Nossos serviços
      </Display>
      <BodyText
        fontWeight="400"
        fontSize={isMobileMod() ? "18px" : "28px"}
        lineHeight={isMobileMod() ? "24px" : "44px"}
        letterSpacing={isMobileMod() ? "0.1px" : "-0.1px"}
        textAlign="center"
      >
        A Base dos Dados é a especialista que ajuda você ou sua equipe a trabalhar e extrair o máximo de valor dos dados.
      </BodyText>
    </Stack>
  )
}

function BoxBenefits ({ benefits, children }) {
  return (
    <Stack flexDirection="row" spacing={0} gap="10px">
      <CheckIcon 
        width="28px"
        height="28px"
        fill="#2B8C4D"
      />
      {benefits && <BodyText fontWeight="500">{benefits}:</BodyText>}
      <BodyText>{children}</BodyText>
    </Stack>
  )
}

export default function Services() {
  const services = {
    "Captura de dados":
      "https://storage.googleapis.com/basedosdados-website/images/cloud.png",
    "Análise de dados":
      "https://storage.googleapis.com/basedosdados-website/images/bar.png",
    "Consultoria de dados":
      "https://storage.googleapis.com/basedosdados-website/images/lightbulb.png",
  }

  return (
    <MainPageTemplate paddingX="24px">
      <Head>
        <title>Serviços – Base dos Dados</title>
        <meta
          property="og:title"
          content="Serviços – Base dos Dados"
          key="ogtitle"
        />
      </Head>

      <Slogan/>

      <Stack
        justifyContent="center"
        width="100%"
        maxWidth="1264px"
        margin="0 auto 140px"
        direction={{ base: "column", lg: "row" }}
        gap="120px"
      >
        {Object.entries(services).map(([k, v]) => (
          <Link href={`#${k}`}>
            <VStack justify="flex-end">
              <Image alt="" marginBottom="15px" height="100px" src={v} />
              <SectionText fontSize="20px" fontWeight="bold">
                {k}
              </SectionText>
            </VStack>
          </Link>
        ))}
      </Stack>
      
      <VStack
        id="Captura de dados"
        width="100%"
        maxWidth="1264px"
        padding="100px 0 40px"
        margin="auto"
        textAlign="center"
        spacing={0}
      >
        <Display paddingBottom="24px" >
          Captura de dados
        </Display>

        <BodyText maxWidth="800px" paddingBottom="8px" fontWeight="500" marginTop="0">
          Capturamos e disponibilizamos dados sob demanda com rapidez, escala e baixo custo.
        </BodyText>
        <BodyText maxWidth="800px">
          Você não precisa se preocupar em criar e manter uma infraestrutura
          própria ou escrever códigos - nós cuidamos disso. Tudo é feito
          seguindo a metodologia de tratamento e padronização da Base dos Dados,
          e conforme as melhores práticas de engenharia de dados do mercado. As
          tabelas tratadas podem ser disponibilizadas com exclusividade ou serem
          públicas.
        </BodyText>

        <Stack paddingTop="40px">
          <BodyText fontWeight="700">Principais vantagens</BodyText>
          <BoxBenefits benefits="Rapidez">
            Mesmo <i>queries</i> muito complexas demoram apenas minutos para serem processadas.
          </BoxBenefits>
          <BoxBenefits benefits="Escala">
            Nosso <i>datalake</i> escala magicamente para hexabytes se necessário.
          </BoxBenefits>
          <BoxBenefits benefits="Baixo custo">
            Todo usuário possui 1TB gratuito por mês para consulta aos dados.
          </BoxBenefits>
        </Stack>

        <Stack paddingTop="40px" spacing="40px">
          <BodyText fontWeight="700">Nosso trabalho com engenharia de dados</BodyText>

          <Stack
            justifyContent="space-between"
            width="100%"
            direction={{ base: "column", lg: "row" }}
            align="center"
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
        </Stack>
      </VStack>

      <VStack
        id="Análise de dados"
        width="100%"
        maxWidth="1264px"
        padding="100px 0 40px"
        margin="auto"
        textAlign="center"
        spacing={0}
      >
        <Display paddingBottom="24px" >
          Análise de dados
        </Display>

        <BodyText maxWidth="900px" paddingBottom="8px" fontWeight="500" marginTop="0">
          Construímos análises, relatórios e indicadores essenciais para sua pesquisa ou tomada de decisão.
        </BodyText>
        <BodyText maxWidth="800px">
          As informações e <i>insights</i> são geradas a partir de diversos
          conjuntos de dados já tratados no nosso <i>datalake</i> público
          atrelado à <i>expertise</i> da nossa equipe de Dados. E mais:
          utilizamos nossa metodologia padrão de tratamento para que você também
          possa cruzar esses dados com quaisquer outras bases disponíveis no{" "}
          <i>datalake</i>.
        </BodyText>

        <Stack paddingTop="40px">
          <BodyText fontWeight="700">Exemplos de perguntas que podemos responder</BodyText>
          <BoxBenefits>
            Como vem evoluindo a economia brasileira, com indicadores detalhados mensais por setor?
          </BoxBenefits>
          <BoxBenefits>
            Quais escolas terão <i>performance</i> acima da média do estado em matemática no ano que vem?
          </BoxBenefits>
          <BoxBenefits>
            Quantas vezes o Diário Oficial da União publica sobre certo tema a cada dia?
          </BoxBenefits>
        </Stack>
      </VStack>

      <VStack
        id="Consultoria de dados"
        width="100%"
        maxWidth="1264px"
        padding="100px 0 40px"
        margin="auto"
        textAlign="center"
        spacing={0}
      >
        <Display paddingBottom="24px" >
          Consultoria de dados
        </Display>

        <BodyText maxWidth="900px" paddingBottom="8px" fontWeight="500" marginTop="0">
          Orientamos como aplicar a nossa metodologia de limpeza, estruturação e padronização de dados
        </BodyText>
        <BodyText maxWidth="800px">
          No seu projeto ou organização através de workshops e materiais
          exclusivos. Reproduzir nosso processo de tratamento em seu próprio
          banco de dados pode poupar horas de trabalho de sua equipe ao
          consultar, manipular ou atualizar as informações.
        </BodyText>

        <Stack paddingTop="40px">
          <BodyText fontWeight="700">Principais vantagens</BodyText>
          <BoxBenefits>
            Experiência em construir infraestruturas capazes de suportar milhares de acessos mensais.
          </BoxBenefits>
          <BoxBenefits>
            Flexibilidade para projetos remotos em qualquer lugar do país.
          </BoxBenefits>
          <BoxBenefits>
            Equipe diversa e com <i>expertise</i> em diferentes áreas do conhecimento e dados.
          </BoxBenefits>
        </Stack>

        <Stack paddingTop="40px" spacing="40px">
          <BodyText fontWeight="700">Frentes de atuação</BodyText>

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
        </Stack>
      </VStack>

      <VStack
        maxWidth="1264px"
        margin="auto"
      >
        <BigTitle paddingTop="80px" paddingBottom="10px" color="#2B8C4D">
          Nosso fluxo de trabalho
        </BigTitle>
        <SectionText paddingBottom="50px">
          Uma mesma metodologia de trabalho para todos os serviços, pautada na
          satisfação dos clientes e na primazia pela qualidade.
        </SectionText>
        <KnowOurServices paddingBottom="50px" />
      </VStack>

      {/* <FixedBottomBar /> */}
    </MainPageTemplate>
  )
}
