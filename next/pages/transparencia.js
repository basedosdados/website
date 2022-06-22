import {
  Box,
  Flex,
  VStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import Display from "../components/atoms/Display";
import BigTitle from "../components/atoms/BigTitle";
import SectionText from "../components/atoms/SectionText";
import Link from "../components/atoms/Link";
import RoundedButton from "../components/atoms/RoundedButton";
import { MainPageTemplate } from "../components/templates/main";
import { withPages } from "../hooks/pages.hook";
import TransparencyImage from "../public/img/transparencyImage";
import DonationImage from "../public/img/donationImage";
import { useEffect, useState } from "react";
import { useCheckMobile } from "../hooks/useCheckMobile.hook";

export async function getStaticProps(context) {
  return await withPages();
}
  
export default function Transparencia({ pages }) {

  const [isMobileMod, setIsMobileMod] = useState(false)
  const isMobile = useCheckMobile();

  useEffect(() => {
    setIsMobileMod(isMobile)
  }, [isMobile])

  return (
  <MainPageTemplate pages={pages} paddingBottom="0px">
    <Stack 
      paddingX={{ base: "24px", lg: "0px" }}
      paddingTop={{ base: "80px", lg: "112px" }}
      paddingBottom={{ base: "10px", lg: "32px" }}
      width="100%"
      maxWidth="1264px"
      justify="space-between"
      direction={{ base: "column", lg: "row" }}
      margin="auto"
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
          Somos uma organização não-governamental sem fins lucrativos e <i>open source</i>. A transparência fundamenta todas nossas ações, desde o trabalho com dados públicos até a prestação de contas. Utilizamos os recursos para facilitar o acesso de milhares de pessoas a dados de qualidade. Nesse espaço, você encontra informações referentes às nossas atividades, receitas e despesas. 
        </SectionText>
        <SectionText paddingBottom="20px">
          Em nosso
          <Link
            color="#42B0FF"
            href={`https://drive.google.com/file/d/1JNcr4psQr42EV9mTafn512TD8p87ZP3a/view`}
          > estatuto  
          </Link>, estão presentes as diretrizes que regulamentam o funcionamento e o processo de tomada de decisões da organização.       
        </SectionText>
      </Stack>
      <Stack maxWidth={{ base: "100%", lg: "45%" }}>
        <TransparencyImage
          widthImage={{ base: "95%", lg: "569px"}}
          heightImage={{ base: "95%", lg: "445px"}}
        />
      </Stack>
    </Stack>
    <Stack
      paddingX={{ base: "24px", lg: "0px" }}
      paddingTop={{ base: "80px", lg: "120px" }}
      width="100%"
      maxWidth="1264px"
      justify="space-between"
      direction={{ base: "column", lg: "row" }}
      margin="auto"
    >
      <Stack 
        order={isMobileMod ? 1 : 0}
        maxWidth={{ base: "100%", lg: "45%" }}
        width={{base: "350px", lg: "600px"}}
        height={{base: "300px", lg: "450px"}}
      >
        <iframe
          src="https://perguntas.basedosdados.org/public/question/80ad0ba9-bfa9-4427-96a0-675fb2252b37#titled=false&bordered=false"
          frameborder="0"
          width="100%"
          height="100%"
          allowtransparency
        />
      </Stack>
      <Stack maxWidth={{ base: "100%", lg: "45%" }}>
        <BigTitle
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
          Abaixo, você confere as fontes e destinações dos recursos da organização. Além disso, todos os microdados referentes à contabilidade da BD estão disponíveis no nosso <i>datalake</i> público. Veja
          <Link
            color="#42B0FF"
            href={`https://basedosdados.org/dataset/br-bd-indicadores?bdm_table=contabilidade#titled=false&bordered=false`}
          > aqui
          </Link>.
        </SectionText>
      </Stack>
    </Stack>
    <Stack
      order={isMobileMod ? 0 : 1}
      paddingX={{ base: "24px", lg: "0px" }}
      paddingTop={{ base: "80px", lg: "120px" }}
      width="100%"
      maxWidth="1264px"
      justify="space-between"
      direction={{ base: "column", lg: "row" }}
      margin="auto"
      gridGap={{ base: "64px", lg: "0px" }}
    >
      <Stack 
        maxWidth={{ base: "100%", lg: "45%" }}
        width={{base: "350px", lg: "600px"}}
        height={{base: "400px", lg: "450px"}}
      >
        <Text
        fontFamily="Ubuntu"
        fontSize={{base: "16px", lg: "22px"}}
        fontWeigth="400"
        letterSpacing={{base: "0.2px", lg: "0.1px"}}
        minHeight="30px"
        marginBottom={{base: "0px", lg: "24px"}}
        color="#252A32"
        >
          Receitas acumuladas
        </Text>
        <iframe
          src="https://perguntas.basedosdados.org/public/question/c41beae5-94d3-41e2-9161-a12492b0cae0#titled=false&bordered=false"
          frameborder="0"
          width="100%"
          height="100%"
          allowtransparency
        />
      </Stack>
      <Stack 
        maxWidth={{ base: "100%", lg: "45%" }}
        width={{base: "350px", lg: "600px"}}
        height={{base: "400px", lg: "450px"}}
      >
        <Text
          fontFamily="Ubuntu"
          fontSize={{base: "16px", lg: "22px"}}
          fontWeigth="400"
          letterSpacing={{base: "0.2px", lg: "0.1px"}}
          minHeight="30px"
          marginBottom={{base: "0px", lg: "24px"}}
          color="#252A32"
        >
          Despesas acumuladas
        </Text>
        <iframe
          src="https://perguntas.basedosdados.org/public/question/312842db-4ea9-455b-be7a-98d96e742ea7#titled=false&bordered=false"
          frameborder="0"
          width="100%"
          height="100%"
          allowtransparency
        />
      </Stack>
    </Stack>
    <Stack
      paddingX={{ base: "24px", lg: "0px" }}
      paddingTop={{ base: "80px", lg: "120px" }}
      width="100%"
      maxWidth="1264px"
      justify="space-between"
      direction={{ base: "column", lg: "row" }}
      margin="auto"
    >
      <Stack maxWidth={{ base: "100%", lg: "45%" }}>
        <BigTitle
          paddingBottom={{base: "8px", lg: "24px"}}
        >
          Relatórios
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
          Os documentos reúnem também os demonstrativos financeiros da organização. Explore nossos relatórios e conheça melhor o trabalho desenvolvido nas diferentes frentes de atuação.
        </SectionText> 
      </Stack>   
    </Stack>
    <Stack
      paddingX={{ base: "24px", lg: "0px" }}
      paddingTop="16px"
      paddingBottom={{ base: "64px", lg: "96px" }}
      width="100%"
      maxWidth="1264px"
      margin="auto"
    >
      <Link 
        color="#42B0FF"
        href={`https://drive.google.com/drive/folders/1cVs17GoC9bymakozof_kyEhay-hxUCW3`}
      >
        BD Relatório Anual 2021
      </Link>
    </Stack>
    <Stack
      backgroundColor="#252A32"
    >
      <Stack
        paddingX={{ base: "24px", lg: "0px" }}
        paddingTop={{ base: "64px", lg: "80px" }}
        paddingBottom={{ base: "56px", lg: "72px" }}
        width="100%"
        maxWidth="1264px"
        justify="space-between"
        direction={{ base: "column", lg: "row" }}
        margin="auto"
      >
        <Stack 
          paddingTop={{ base: "0px", lg: "16px" }}
          maxWidth={{ base: "100%", lg: "45%" }}
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
            widthImage={{ base: "90%", lg: "326px"}}
            heightImage={{ base: "90%", lg: "307px"}}
          />
        </Stack>
      </Stack>
    </Stack>
  </MainPageTemplate>
  )
}