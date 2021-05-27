import {Center, Image, Text, VStack} from "@chakra-ui/react";
import Menu from "../components/molecules/Menu";
import SiteHead from "../components/atoms/SiteHead";
import ControlledInput from "../components/atoms/ControlledInput";
import SectionText from "../components/atoms/SectionText";
import BigTitle from "../components/atoms/BigTitle";
import SectionTitle from "../components/atoms/SectionTitle";


function Hero(){
    return(
        <VStack width="100%" height="100vh" background="linear-gradient(180deg, #3A761E 0%, #66A24A 10.42%, #6CA850 100%);">
            <Menu/>
            <Center  height="100%">
                <VStack alignItems="center" spacing={10}>
                    <BigTitle color="#ffffff">Encontre os dados que você precisa</BigTitle>
                    <ControlledInput maxWidth="80%" placeholder="Pesquisar palavras-chave, instituições e temas" justifyContent="center" inputStyle={{ padding:"40px", borderRadius:"50px", backgroundColor:"#ffffff", fontSize:"24px"}} rightIcon={<Image src="/img/arrow_black_right.png" marginRight="40px"/>}/>
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

function FindPubicData(){
    return(
        <VStack alignItems="flex-start" spacing={10} padding="50px 70px" backgroundColor="#E5E5E5">
            <BigTitle alignSelf="center">ENCONTRE DADOS PÚBLICOS</BigTitle>
            <SectionText alignSelf="center" width="80%" textAlign="center">Descubra informações sobre dados públicos de grandes instituições brasileiras e internacionais através da nossa ferramenta de busca. Algumas bases também estão no nosso datalake.</SectionText>
            <SectionTitle alignSelf="flex-start">Base mais populares</SectionTitle>
        </VStack>
    )
}

export default function Home() {
  return (
    <>
        <SiteHead/>
        <Hero/>
        <FindPubicData/>
    </>
  )
}
