import {Box, Center, HStack, Image, Stack, Text, VStack} from "@chakra-ui/react";
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
import CardCatalog from "../components/organisms/CardCatalog";

function HeroText({children, iconUrl}){
    return(
        <VStack textAlign="center">
            <Image marginBottom="10px" height="140px" src={iconUrl}/>
            {children}
        </VStack>
    )
}

function Hero(){
    const [search, setSearch] = useState();

    function openSearchLink(){
        return window.open(`/dataset/?q=${search}`, "_self")
    }

    return(
        <VStack width="100%" height="100vh" backgroundColor="#FAFAFA">
            <Menu/>
            <Center paddingTop="100px"  height="100%">
                <VStack height="100%" justifyContent="center" alignItems="center" spacing={20}>
                    <Stack position="relative" width="100%" direction={{base:'column', lg:'row'}} alignItems="center" spacing={50}>
                        <Image src="/next-img/home_background.png" position="absolute" right="0px" top="-30px" width="600px"/>
                        <BigTitle flex="2" color="#2B8C4D">
                            Um único lugar para buscar, baixar e acessar os dados que você precisa
                        </BigTitle>
                        <ControlledInput
                            value={search}
                            onChange={setSearch}
                            onEnterPress={openSearchLink}
                            flex="3"
                            placeholder="Pesquisar palavras-chave, instituições e temas"
                            justifyContent="center"
                            inputStyle={{ padding:"40px", borderRadius:"50px", backgroundColor:"#ffffff", fontSize:"24px"}}
                            rightIcon={<Image onClick={openSearchLink} width="40px" marginRight="40px" src="/next-img/arrow_black_right.png"/>}/>
                    </Stack>
                    <Stack paddingTop="30px" position="relative" zIndex="1" width="90%" direction={{base:'column', lg:'row'}}>
                        <HeroText iconUrl="/next-img/icone_busca.png">
                            <SectionText>
                                Com o <b>mecanismo de busca</b> é possível descobrir informações sobre mais de 900 bases de dados de diversos temas e organizações.
                            </SectionText>
                        </HeroText>
                        <HeroText iconUrl="/next-img/icone_download.png">
                            <SectionText>
                                Disponibilizamos o <b>download</b> dos dados tratados e atualizados direto do nosso datalake público num só click.
                            </SectionText>
                        </HeroText>
                        <HeroText iconUrl="/next-img/icone_pacotes.png">
                            <SectionText>
                                Através dos nossos <b>pacotes de programação</b> você pode acessar o datalake público BD+ em Python, R ou pela linha de comando.
                            </SectionText>
                        </HeroText>
                    </Stack>
                </VStack>
            </Center>
            <Center transform="translateY(-20px)" boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)" backgroundColor="#42B0FF" borderRadius="500px"  width="52px" height="60px" >
                <Image height="24px" src="/next-img/arrow_white_down.png"/>
            </Center>
        </VStack>
    )
}

function CatalogNews(){
    return(
        <VStack width="100%" padding="60px 0px" alignItems="flex-start" backgroundColor="#FAFAFA" >
            <BigTitle marginBottom="40px" alignSelf="center">Veja as novidades do nosso catálogo</BigTitle>
            <CardCatalog
                sections={{
                    'populares': [
                        <DatabaseCard
                            name="Eleições brasileiras"
                            organization="Tribunal Superior Eleitoral"
                            tags={["Política", "Finanças públicas"]}
                            size="2 GB"
                            tableNum="13 tabelas (CSV)"
                            externalLinkNum={1}
                            updatedSince="13 dias"
                            updatedAuthor="Ricardo Dahis"
                            categories={['agro']}
                        />,
                       ],
                }}
            />
        </VStack>
    )
}

export default function Home() {
  return (
      <>
        <SiteHead/>
        <VStack alignItems="center" backgroundColor="#fafafa" padding="0px 5%">
            <Hero/>
            <CatalogNews/>
        </VStack>
        <Footer/>
      </>
  )
}
