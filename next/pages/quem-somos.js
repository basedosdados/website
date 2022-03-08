import {
  Box,
  Flex,
  VStack,
  Stack,
} from "@chakra-ui/react";
import BigTitle from "../components/atoms/BigTitle";
import SectionText from "../components/atoms/SectionText";
import { MainPageTemplate } from "../components/templates/main";
import { withPages } from "../hooks/pages.hook";
  
export async function getStaticProps(context) {
  return await withPages();
}
  
export default function QuemSomos({ pages }) {
  return (
  <MainPageTemplate pages={pages}>
    <Stack
      paddingTop={{ base: "80px", lg: "0px" }}
      paddingBottom={{ base: "10px", lg: "50px" }}
      width="80%"
      justify="space-between"
      direction={{ base: "column", lg: "row" }}
      margin="auto"
    >
      <VStack maxWidth={{ base: "100%", lg: "45%" }}>
        <Box contentAlign="flex-start">
          <BigTitle paddingBottom="25px">
            Quem somos
          </BigTitle>
          <SectionText fontSize="14px" fontWeight="300" paddingBottom="20px">
            A Base dos Dados é uma organização não-governamental, sem fins lucrativos, <i>open source</i> e colaborativa. Nossa missão é universalizar o acesso a dados públicos de qualidade para que <b>a distância entre qualquer pessoa e uma análise seja apenas uma boa pergunta</b>.
          </SectionText>
          <SectionText fontSize="14px" fontWeight="300" paddingBottom="20px">
            Atuamos nesse objetivo catalogando e organizando bases de dados públicas que podem ser encontradas através do nosso mecanismo de busca, com informações estruturadas dos conjuntos de dados e a possibilidade de download direto.
          </SectionText>
          <SectionText fontSize="14px" fontWeight="300" paddingBottom="20px">
            Além disso, nossa iniciativa conta com um <i>datalake</i> público, em que disponibilizamos diversas <b>bases de dados já limpas</b>, <b>integradas e compatibilizadas</b>. Através dele, você pode acessar e cruzar tabelas de diferentes organizações de maneira simples e rápida usando <b>nossos pacotes</b> em <b>Python</b>, <b>R</b> ou direto pelo <b>BigQuery</b>. Nós estruturamos dados públicos para você poder focar no que realmente importa, sua análise (artigo científico, matéria de jornal, painel de visualização, integrações etc).
          </SectionText>
        </Box>
      </VStack>
      <VStack maxWidth={{ base: "100%", lg: "45%" }}>
        <Box 
          contentAlign="flex-start" 
          paddingTop={{ base: "0px", lg: "80px" }}
        >
          <SectionText fontSize="14px" fontWeight="300" paddingBottom="20px">
            A ideia de catalogar bases de dados importantes começou em <b>2019</b>, com nosso co-fundador <b>Ricardo Dahis</b>, que enxergou a necessidade de uma plataforma com capacidade de busca e filtragem de diferentes conjuntos de dados e iniciou esse trabalho.
          </SectionText>
          <SectionText fontSize="14px" fontWeight="300" paddingBottom="20px">
            Mediante uma proposta do <b>João Carabetta</b>, também co-fundador da Base dos Dados, para estruturar um <i>datalake</i> pelo BigQuery e usar o mecanismo de busca para catalogação dos metadados, nossa iniciativa começou a tomar forma. 
          </SectionText>
          <SectionText fontSize="14px" fontWeight="300" paddingBottom="20px">
            Depois de um trabalho em conjunto estruturando as primeiras bases de dados com a <b>Fernanda Scovino</b>, <b>Fred Israel</b> e <b>Diego Oliveira</b>, todos co-fundadores da BD, lançamos nosso <i>datalake</i> público em <b>outubro de 2020</b>. Desde então, nossa organização vem crescendo em qualidade e quantidade de dados, número de colaboradores, parceiros e usuários. Faça parte dessa história também!
          </SectionText> 
        </Box>
      </VStack>
    </Stack>
  </MainPageTemplate>
  )
}