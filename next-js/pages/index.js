import {Box, Center, HStack, Image, Text, VStack} from "@chakra-ui/react";
import Menu from "../components/molecules/Menu";
import SiteHead from "../components/atoms/SiteHead";
import ControlledInput from "../components/atoms/ControlledInput";
import SectionText from "../components/atoms/SectionText";
import BigTitle from "../components/atoms/BigTitle";
import SectionTitle from "../components/atoms/SectionTitle";
import DatabaseCard from "../components/organisms/DatabaseCard";
import NewsCard from "../components/organisms/NewsCard";
import Footer from "../components/molecules/Footer";
import {useState} from "react";

function Hero(){
    const [search, setSearch] = useState();

    return(
        <VStack width="100%" height="100vh" background="linear-gradient(180deg, #3A761E 0%, #66A24A 10.42%, #6CA850 100%);">
            <Menu/>
            <Center  height="100%">
                <VStack alignItems="center" spacing={10}>
                    <BigTitle color="#ffffff">Encontre os dados que você precisa</BigTitle>
                    <ControlledInput value={search} onChange={setSearch} maxWidth="80%" placeholder="Pesquisar palavras-chave, instituições e temas" justifyContent="center" inputStyle={{ padding:"40px", borderRadius:"50px", backgroundColor:"#ffffff", fontSize:"24px"}} rightIcon={<Image src="/img/arrow_black_right.png" marginRight="40px"/>}/>
                    <SectionText color="#FFFFFF">930 conjuntos de dados públicos de 498 instituições e 22 temas; 40 bases prontas para análise no nosso datalake.</SectionText>
                </VStack>
            </Center>
            <VStack spacing={5} paddingBottom="20px">
                <SectionText fontWeight="700" color="#FFFFFF">Veja mais sobre nossos dados</SectionText>
                <Image height="34px" src="/img/arrow_white_down.png"/>
            </VStack>
        </VStack>
    )
}

function HomeSection({title, sectionText, sectionTitle, children}){
    const padding = "7%";
    return(
        <Box padding="50px 0px" backgroundColor="#FAFAFA">
            <VStack margin="auto" alignItems="flex-start" spacing={12} maxWidth="1500px">
                <BigTitle alignSelf="center">{title}</BigTitle>
                <SectionText alignSelf="center" width="70%" textAlign="center">{sectionText}</SectionText>
                <SectionTitle paddingLeft={padding} alignSelf="flex-start">{sectionTitle}</SectionTitle>
                <HStack padding={`0px ${padding}`} shouldWrapChildren={true} width="100%" paddingBottom="20px" justify="space-between">
                    {children}
                </HStack>
            </VStack>
        </Box>
    )
}

export default function Home() {
  return (
    <>
        <SiteHead/>
        <Hero/>
        <HomeSection
            title="ENCONTRE DADOS PÚBLICOS"
            sectionText="Descubra informações sobre dados públicos de grandes instituições brasileiras e internacionais através da nossa ferramenta de busca. Algumas bases também estão no nosso datalake."
            sectionTitle="Base mais populares"
        >
            <DatabaseCard name="Eleições brasileiras" organization="Tribunal Superior Eleitoral" tags={["Política", "Finanças públicas"]} description="O Repositório de dados eleitorais é uma compilação de informações brutas das eleições, desde as de 1945, voltada para pesquisadores, imprensa e pessoas interessadas em..." size="2 GB" tableNum="13 tabelas (CSV)" externalLinkNum={1} updatedSince="13 dias" updatedAuthor="Ricardo Dahis" iconUrl="/img/icon_organization.png" isPlus={true} />
            <DatabaseCard name="Eleições brasileiras" organization="Tribunal Superior Eleitoral" tags={["Política", "Finanças públicas"]} description="O Repositório de dados eleitorais é uma compilação de informações brutas das eleições, desde as de 1945, voltada para pesquisadores, imprensa e pessoas interessadas em..." externalLinkNum={1} updatedSince="13 dias" updatedAuthor="Ricardo Dahis" iconUrl="/img/icon_organization.png" />
            <DatabaseCard name="Eleições brasileiras" organization="Tribunal Superior Eleitoral" tags={["Política", "Finanças públicas"]} description="O Repositório de dados eleitorais é uma compilação de informações brutas das eleições, desde as de 1945, voltada para pesquisadores, imprensa e pessoas interessadas em..."  externalLinkNum={1} updatedSince="13 dias" updatedAuthor="Ricardo Dahis" iconUrl="/img/icon_organization.png"   />
        </HomeSection>
        <HomeSection
            title="USE NOSSO DATALAKE"
            sectionText={`Baixe e consulte dados já limpos, integrados e atualizados de forma extremamente fácil pelo nosso datalake público. As bases disponíveis no datalake possuem o ícone ${<Image marginLeft="10px" width="70px" display="inline-block" src="/img/logo_plus.png"/>}`}
            sectionTitle="Dados mais recentes na BD+"
        >
            <DatabaseCard name="Eleições brasileiras" organization="Tribunal Superior Eleitoral" tags={["Política", "Finanças públicas"]} description="O Repositório de dados eleitorais é uma compilação de informações brutas das eleições, desde as de 1945, voltada para pesquisadores, imprensa e pessoas interessadas em..." size="2 GB" tableNum="13 tabelas (CSV)" externalLinkNum={1} updatedSince="13 dias" updatedAuthor="Ricardo Dahis" isPlus={true} />
            <DatabaseCard name="Eleições brasileiras" organization="Tribunal Superior Eleitoral" tags={["Política", "Finanças públicas"]} description="O Repositório de dados eleitorais é uma compilação de informações brutas das eleições, desde as de 1945, voltada para pesquisadores, imprensa e pessoas interessadas em..." size="2 GB" tableNum="13 tabelas (CSV)" externalLinkNum={1} updatedSince="13 dias" updatedAuthor="Ricardo Dahis" isPlus={true} />
            <DatabaseCard name="Eleições brasileiras" organization="Tribunal Superior Eleitoral" tags={["Política", "Finanças públicas"]} description="O Repositório de dados eleitorais é uma compilação de informações brutas das eleições, desde as de 1945, voltada para pesquisadores, imprensa e pessoas interessadas em..." size="2 GB" tableNum="13 tabelas (CSV)" externalLinkNum={1} updatedSince="13 dias" updatedAuthor="Ricardo Dahis" isPlus={true} />
        </HomeSection>
        <HomeSection
            title="EXPLORE NA SUA LINGUAGEM FAVORITA"
            sectionText="Desenvolvemos pacotes para acesso aos dados da BD+ em Python, R e linha de comando. Além disso, você pode consultar e filtrar dados usando SQL no editor do nosso datalake no Google BigQuery."
            sectionTitle="Tutoriais e análises"
        >
            <NewsCard title="Workshop SQL: Analisando 250 GB em segundos com o BigQuery" site="YOUTUBE" image="/img/news_placeholder.png"/>
            <NewsCard title="Workshop SQL: Analisando 250 GB em segundos com o BigQuery" site="YOUTUBE" image="/img/news_placeholder.png"/>
            <NewsCard title="Workshop SQL: Analisando 250 GB em segundos com o BigQuery" site="YOUTUBE" image="/img/news_placeholder.png"/>
        </HomeSection>
        <Footer/>
    </>
  )
}
