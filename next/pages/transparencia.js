import {
  Box,
  Flex,
  VStack,
  Stack,
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
          Adicionar parágrafo.
        </SectionText>
        <SectionText paddingBottom="20px">
          Adicionar parágrafo.
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
        width= {{base: "350px", lg: "600px"}}
        height= {{base: "200px", lg: "450px"}}
      >
        <iframe
          src="https://perguntas.basedosdados.org/public/question/be7d4328-c30d-411a-b965-3eec277d6254"
          frameborder="0"
          width="100%"
          height="100%"
          allowtransparency
        />
      </Stack>
      <Stack maxWidth={{ base: "100%", lg: "45%" }}>
        <BigTitle
          paddingBottom="24px"
        >
          Indicador de sobrevida
        </BigTitle>
        <SectionText paddingBottom="20px">
          Adicionar parágrafo. Adicionar parágrafo. Adicionar parágrafo. Adicionar parágrafo. Adicionar parágrafo.
        </SectionText>
        <SectionText paddingBottom="20px">
          Adicionar parágrafo.
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
        width= {{base: "350px", lg: "600px"}}
        height= {{base: "200px", lg: "450px"}}
      >
        <iframe
          src="https://perguntas.basedosdados.org/public/question/be7d4328-c30d-411a-b965-3eec277d6254"
          frameborder="0"
          width="100%"
          height="100%"
          allowtransparency
        />
      </Stack>
      <Stack 
        maxWidth={{ base: "100%", lg: "45%" }}
        width= {{base: "350px", lg: "600px"}}
        height= {{base: "200px", lg: "450px"}}
      >
        <iframe
          src="https://perguntas.basedosdados.org/public/question/be7d4328-c30d-411a-b965-3eec277d6254"
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
          paddingBottom="24px"
        >
          Relatórios
        </BigTitle>
        <SectionText paddingBottom="20px">
          Adicionar parágrafo.
        </SectionText> 
      </Stack>
      <Stack 
        maxWidth={{ base: "100%", lg: "45%" }}
        paddingTop={{ base: "0", lg: "62px" }}
      >
        <SectionText paddingBottom="20px">
          Adicionar parágrafo. Adicionar parágrafo. Adicionar parágrafo. Adicionar parágrafo. Adicionar parágrafo.
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
          maxWidth={{ base: "100%", lg: "45%" }}
        >
          <BigTitle 
            paddingBottom="24px"
            color="#FFF"
          >
            Você também acredita no <p>acesso a dados de qualidade?</p>
          </BigTitle>
          <SectionText 
            paddingBottom="20px"
            color="#FFF"
          >
            Adicionar parágrafo.
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
          paddingTop="40px"
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