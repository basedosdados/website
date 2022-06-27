import {
  Box,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useCheckMobile } from "../hooks/useCheckMobile.hook";
import { withPages } from "../hooks/pages.hook";
import { MainPageTemplate } from "../components/templates/main";
import Display from "../components/atoms/Display";
import BigTitle from "../components/atoms/BigTitle";
import SectionText from "../components/atoms/SectionText";
import Link from "../components/atoms/Link";
import RoundedButton from "../components/atoms/RoundedButton";
import TransparencyImage from "../public/img/transparencyImage";
import DonationImage from "../public/img/donationImage";

export async function getStaticProps(context) {
  return await withPages();
}
  
export default function Transparencia({ pages }) {
  const [isMobileMod, setIsMobileMod] = useState(false)
  const isMobile = useCheckMobile();

  useEffect(() => {
    setIsMobileMod(isMobile)
  }, [isMobile])

  const SectionBox = ({ children, ...props }) => {
    return (
      <Box
        display="flex"
        justifyContent="space-between"
        flexDirection={{ base: "column", lg: "row" }}
        paddingTop={{ base: "80px", lg: "112px" }}
        width="100%"
        maxWidth="1264px"
        margin="auto"
        {...props}
      >
        {children}
      </Box>
    )
  }

  const GraphicsBox = ({ text, url }) => {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        maxWidth={{ base: "100%", lg: "45%" }}
        width={{base: "350px", lg: "650px"}}
        height={{base: "320px", lg: "400px"}}
      >
        <Text
          width="100%"
          fontFamily="Ubuntu"
          fontSize={{base: "16px", lg: "22px"}}
          fontWeigth="400"
          letterSpacing={{base: "0.2px", lg: "0.1px"}}
          minHeight="30px"
          marginBottom={{base: "0px", lg: "24px"}}
          color="#252A32"
        >
          {text}
        </Text>
        
        <iframe
          src={url}
          frameborder="0"
          width="100%"
          height="100%"
          allowtransparency
        />
      </Box>
    )
  }

  return (
    <MainPageTemplate pages={pages} paddingX="24px" paddingBottom="0">
      <SectionBox
        paddingBottom={{ base: "10px", lg: "32px" }}
      >
        <Stack
          paddingTop={{ base: "0px", lg: "24px" }}
          maxWidth={{ base: "100%", lg: "45%" }}
        >
          <Display 
            color="#2B8C4D"
            paddingBottom="24px"
            lineHeight={isMobileMod ? "40px" : "52px"}
          >
            Nossas contas são transparentes e abertas – como todo o resto.
          </Display>
          <SectionText paddingBottom="20px">
            Somos uma organização não-governamental sem fins lucrativos e <i>open source</i>. A transparência fundamenta todas as nossas ações, desde o trabalho com dados públicos até a prestação de contas. Utilizamos os recursos para facilitar o acesso de milhares de pessoas a dados de qualidade. 
          </SectionText>
          <SectionText paddingBottom="20px">
            Nesse espaço, você encontra informações referentes às nossas atividades, receitas e despesas. Acompanhe de perto como garantimos a sustentabilidade da organização.
          </SectionText>
        </Stack>

        <Stack 
          width={isMobileMod ? "100%" : {base: "445px", lg: "569px"}}
          height={isMobileMod ? "100%" : {base: "356px", lg: "445px"}}
        >
          <TransparencyImage
            widthImage="100%"
            heightImage="100%"
          />
        </Stack>
      </SectionBox>

      <SectionBox
        paddingTop={ isMobileMod ? "80px" : "120px"}
      >
        <Stack
          display={isMobileMod ? "flex" : "none"}
          width="100%"
        >
          <BigTitle
            paddingBottom="40px"
          >
            Indicador de sobrevida
          </BigTitle>
        </Stack>

        <Stack 
          maxWidth={{ base: "100%", lg: "45%" }}
          width={{base: "350px", lg: "450px"}}
          height={{base: "300px", lg: "375px"}}
          marginLeft={{base: "0px", lg: "64px"}}
        >
          <iframe
            src="https://perguntas.basedosdados.org/public/question/80ad0ba9-bfa9-4427-96a0-675fb2252b37#titled=false&bordered=false"
            frameborder="0"
            width="100%"
            height="100%"
            allowtransparency
          />
        </Stack>

        <Stack 
          maxWidth={{ base: "100%", lg: "45%" }}
          paddingTop={{base: "24px", lg: "0px"}}
        >
          <BigTitle
            display={isMobileMod ? "none" : "flex"}
            paddingBottom={{base: "8px", lg: "24px"}}
          >
            Indicador de sobrevida
          </BigTitle>
          <SectionText paddingBottom="20px">
            Esse é nosso indicador de sobrevida. Ele mostra o tempo que nossas atividades poderiam se manter caso a arrecadação de recursos financeiros fosse interrompida, considerando as despesas regulares com infraestrutura e equipe, por exemplo. 
          </SectionText>
          <SectionText paddingBottom="20px">
            O indicador evidencia a importância de sua contribuição para a continuidade dos nossos esforços em busca da universalização do acesso a dados públicos.
          </SectionText>
          <SectionText paddingBottom="20px">
            Abaixo, você confere as fontes e destinações dos recursos da organização. Como não poderia deixar de ser, todos os microdados relativos à contabilidade da BD estão disponíveis no nosso <i>datalake</i> público. Veja
            <Link
              color="#42B0FF"
              href={`https://basedosdados.org/dataset/br-bd-indicadores?bdm_table=contabilidade#titled=false&bordered=false`}
            > aqui
            </Link>.
          </SectionText>
        </Stack>
      </SectionBox>

      <SectionBox
        order={isMobileMod ? 0 : 1}
        paddingTop={{ base: "40px", lg: "160px" }}
        gridGap={{ base: "40px", lg: "0px" }}
      >
        <GraphicsBox 
          text= "Receitas acumuladas"
          url= "https://perguntas.basedosdados.org/public/question/c41beae5-94d3-41e2-9161-a12492b0cae0#titled=false&bordered=false"
        />

        <GraphicsBox 
          text= "Despesas acumuladas"
          url= "https://perguntas.basedosdados.org/public/question/312842db-4ea9-455b-be7a-98d96e742ea7#titled=false&bordered=false"
        />
      </SectionBox>

      <SectionBox
        paddingTop={{ base: "80px", lg: "160px" }}
      >
        <Stack
          paddingTop={{ base: "0px", lg: "24px" }}
          maxWidth={{ base: "100%", lg: "45%" }}
        >
          <BigTitle
            paddingBottom={{base: "16px", lg: "24px"}}
          >
            Estatuto Social
          </BigTitle>
          <SectionText paddingBottom="20px">
            Em nosso estatuto, estão presentes as diretrizes que regulamentam o funcionamento e o processo de tomada de decisões da organização, além dos direitos e deveres dos membros e dos conselhos administrativos e fiscais.
          </SectionText>
          <SectionText paddingBottom="20px">
            O documento estabelece também os meios pelos quais sustentamos a iniciativa e os procedimentos relacionados à prestação de contas. É a partir do estatuto que norteamos o aprimoramento das nossas ferramentas e o desenvolvimento de novos projetos para a organização.
          </SectionText>
        </Stack>

        <Stack
          paddingTop={{ base: "0px", lg: "96px" }}
          maxWidth={{ base: "100%", lg: "45%" }}
        >
          <SectionText paddingBottom="20px">
            Os membros são pessoas que firmam compromisso com a nossa missão através de pedido por escrito feito ao Conselho de Administração. Uma vez associados, eles possuem direito formal de voto nas questões que direcionam a organização rumo à concretização dos objetivos sociais.
          </SectionText>
          <SectionText paddingBottom={{base: "20px", lg: "0px"}}>
            Os conselhos administrativos e fiscais são renovados através de eleições orientadas pelas regras do estatuto. Esses órgãos são responsáveis pela aprovação dos relatórios anuais de atividades, que posteriormente serão submetidos para apreciação da Assembleia Geral.
          </SectionText>
        </Stack>
      </SectionBox>

      <Stack
        paddingTop="16px"
        width="100%"
        maxWidth="1264px"
        margin="auto"
      >
        <Link
          target="_blank"
          color="#42B0FF"
          href={`https://drive.google.com/file/d/1JNcr4psQr42EV9mTafn512TD8p87ZP3a/view`}
        >
          BD Estatuto Social
        </Link>
      </Stack>
      
      <SectionBox
        paddingTop={{ base: "80px", lg: "160px" }}
      >
        <Stack maxWidth={{ base: "100%", lg: "45%" }}>
          <BigTitle
            paddingBottom={{base: "16px", lg: "24px"}}
          >
            Relatórios anuais de atividades
          </BigTitle>
          <SectionText paddingBottom="20px">
            Nossos relatórios apresentam todas as atividades empenhadas pela equipe. São diversos projetos que colaboram com a promoção da cultura de transparência, o desenvolvimento socioeconômico e a construção de políticas públicas baseadas em dados e evidências.
          </SectionText> 
        </Stack>

        <Stack 
          maxWidth={{ base: "100%", lg: "45%" }}
          paddingTop={{ base: "0", lg: "72px" }}
        >
          <SectionText paddingBottom="20px">
            Os documentos reúnem também as demonstrações de desempenho financeiro da organização. Explore nossos relatórios e conheça melhor o trabalho desenvolvido nas diferentes frentes de atuação.
          </SectionText> 
        </Stack>
      </SectionBox>
     
      <Stack
        paddingTop="16px"
        paddingBottom={{ base: "80px", lg: "120px" }}
        width="100%"
        maxWidth="1264px"
        margin="auto"
      >
        <Link
          target="_blank"
          color="#42B0FF"
          href={`https://drive.google.com/drive/folders/1cVs17GoC9bymakozof_kyEhay-hxUCW3`}
        >
          BD Relatório Anual 2021
        </Link>
      </Stack>

      <Stack
        backgroundColor="#252A32"
        width="100vw"
        position="relative"
        left={isMobileMod ? "-24px" :"-32px"}
        paddingX={isMobileMod ? "24px" :"32px"}
      >
        <Stack
          width="100%"
          maxWidth="1264px"
          paddingTop={{ base: "64px", lg: "80px" }}
          paddingBottom={{ base: "56px", lg: "72px" }}
          justify="space-between"
          direction={{ base: "column", lg: "row" }}
          margin="auto"
        >
          <Stack
            paddingTop={{ base: "0px", lg: "16px" }}
            maxWidth={{ base: "100%", lg: "35%" }}
          >
            <BigTitle 
              paddingBottom={{base: "8px", lg: "24px"}}
              color="#FFF"
            >
              Você também acredita no <p>acesso a dados de qualidade?</p>
            </BigTitle>
            <SectionText 
              paddingBottom="20px"
              color="#FFF"
            >
              Tudo o que fazemos só é possível por conta das pessoas que apoiam o nosso trabalho. Ajude a BD a continuar facilitando o acesso a dados públicos. Com qualquer valor, você contribui para a manutenção dos nossos projetos e a sobrevivência da organização.
            </SectionText>
            <Link _hover={{ opacity:"none" }} target="_blank" href="https://apoia.se/basedosdados">
              <RoundedButton
                backgroundColor="#FF8484"
                height="35px"
                fontSize="14px"
              >
                Apoie agora
              </RoundedButton>
            </Link>
          </Stack>

          <Stack 
            maxWidth={{ base: "100%", lg: "45%" }}
            paddingTop={{base: "32px", lg: "0px"}}
          >
            <DonationImage
              paddingRight={{ base: "0px", lg: "120px"}}
              widthImage={{ base: "90%", lg: "326px"}}
              heightImage={{ base: "90%", lg: "307px"}}
            />
          </Stack>
        </Stack>
      </Stack>
    </MainPageTemplate>
  )
}