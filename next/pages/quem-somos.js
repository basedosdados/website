import {
  Box,
  Center,
  Stack,
  VStack,
  Image,
  Text,
} from "@chakra-ui/react";
import React, { useState, useEffect} from "react";
import { useMediaQuery } from "@chakra-ui/react";
import { MainPageTemplate } from "../components/templates/main";
import { useCheckMobile } from "../hooks/useCheckMobile.hook";
import { withPages } from "../hooks/pages.hook";
import {
  getBDTeams,
  getBDPeople
} from "./api/team";
import Display from "../components/atoms/Display";
import SectionText from "../components/atoms/SectionText";
import SectionTitle from "../components/atoms/SectionTitle";
import BigTitle from "../components/atoms/BigTitle";
import Carousel from "../components/atoms/Carousel";
import WebIcon  from "../public/img/icons/webIcon";
import EmailIcon  from "../public/img/icons/emailIcon";
import TwitterIcon  from "../public/img/icons/twitterIcon";
import LinkedinIcon  from "../public/img/icons/linkedinIcon";
import GitIcon  from "../public/img/icons/gitIcon";
import DiscordIcon from "../public/img/icons/discordIcon";
import TrophySvg from "../public/img/trophySvg";

export async function getStaticProps(context) {
  const bdTeam = await getBDTeams();
  const bdPeople = await getBDPeople();

  return await withPages({
    props: {
      bdPeople,
      bdTeam
    },
    revalidate: 60,
  })
}

const HistoryBox = ({ title, date, text }) => {
  const isMobile = useCheckMobile();
  const [isMobileMod, setIsMobileMod] = useState(false)
  
  useEffect(() => {
    setIsMobileMod(isMobile)
  }, [isMobile])

  return (
    <Box
      display="flex"
      flexDirection="column"
    >
      <Box
        backgroundColor="#CECECE"
        borderRadius="20px"
        width={isMobileMod ? "90vw" : "500px"}
        height={isMobileMod ? "200px" : "300px"}
        boxShadow="0 2px 20px 0 #00000026"
      >

      </Box>
      
      <Box padding={isMobileMod ? "20px 24px 0" :"40px 48px 0"}>
        <Text
          fontFamily="ubuntu"
          maxWidth="400px"
          color="#252A32"
          fontSize="20px"
          letterSpacing="0.2px"
          marginBottom="8px"
        >{title}</Text>
        <SectionText fontSize="16px" color="#6F6F6F" marginBottom="16px">{date}</SectionText>
        <SectionText fontSize="16px" >{text}</SectionText>
      </Box>
    </Box>
  )
}


const TeamBox = ({ index, bdTeam, data }) => {
  const isMobile = useCheckMobile();
  const [isMobileMod, setIsMobileMod] = useState(false)
  const [role, setRole] = useState([])
  
  useEffect(() => {
    const filterId = (elm) => {
      if(elm.person_id === data.id) {
        return elm.role
      }
    }
    const peopleId = bdTeam.filter(filterId)
  
    const filterRole = () => peopleId.map((elm) => {
      return elm.role
    })

    return setRole(filterRole())
  },[bdTeam])


  useEffect(() => {
    setIsMobileMod(isMobile)
  }, [isMobile])

  const hasLeftSpacing = (index % 2 == 0) ? false : true

  const iconTeamBox = (ref) => {
    let href = ""

    if(ref.website) { href = `${ref.website}` }
    if(ref.email) { href = `mailto:${ref.email}` }
    if(ref.twitter) {
      const twitter = ref.twitter.replace(/(https:)\/\/(twitter.com)\//gim, "")
      href = `https://twitter.com/${twitter}`
    }
    if(ref.linkedin) {
      const linkedin = ref.linkedin.replace(/(https:)\/\/(linkedin.com)\/(in)\//gim, "")
      href = `https://linkedin.com/in/${linkedin}`
    }
    if(ref.github) {
      const github = ref.github.replace(/(https:)\/\/(github.com)\//gim, "")
      href = `https://github.com/${github}` 
    }

    return {
      cursor: "pointer",
      widthIcon:"22px",
      heightIcon:"22px",
      fill: "#42B0FF",
      _hover: {opacity: "0.8"},
      onClick: () => {window.open(href)}
    }
  }

  const iconLinks = () => {
    return (
      <Box display="flex" flexDirection="row" gridGap="5px">
        {data.website ? <WebIcon {...iconTeamBox({website: data.website})}/> : null}
        {data.email ? <EmailIcon {...iconTeamBox({email: data.email})}/> : null}
        {data.twitter ? <TwitterIcon {...iconTeamBox({twitter: data.twitter})}/> : null}
        {data.linkedin ? <LinkedinIcon {...iconTeamBox({linkedin: data.linkedin})}/> : null}
        {data.github ? <GitIcon {...iconTeamBox({github: data.github})}/> : null}
      </Box>
    )
  }

  return (
    <Box
      display="flex"
      flexDirection={isMobileMod ? "column" : "row"}
      maxWidth="900px"
      marginLeft={isMobileMod ? "" : hasLeftSpacing && "200px !important"}
    >
      <Box
        backgroundColor="#F0F0F0"
        minWidth="160px"
        maxWidth="160px"
        minHeight="160px"
        maxHeight="160px"
        borderRadius="16px"
        marginRight="32px"
        marginBottom={isMobileMod && "20px"}
      />
      <Box display="flex" flexDirection="column">
        <Box marginBottom="8px" display="flex" flexDirection="row">
          <SectionText fontSize="18px" fontFamily="ubuntu" color="#6F6F6F" marginRight="16px">{data.name}</SectionText>
          {!isMobileMod && iconLinks()}
        </Box>
        <SectionText marginBottom="16px" fontSize="18px" fontFamily="ubuntu">{role.join(", ")}</SectionText>
        <SectionText marginBottom="16px" fontSize="16px">{data.description}</SectionText>
        {isMobileMod && iconLinks()}
      </Box>
    </Box>
  )
}
  
export default function QuemSomos({ pages, bdTeam, bdPeople }) {
  const isMobile = useCheckMobile();
  const [isMobileMod, setIsMobileMod] = useState(false)
  const [mScreen] = useMediaQuery("(max-width: 1390px)")
  const [filterTeam, setFilterTeam] = useState("")
  const [schemasTeam, setSchemasTeam] = useState([])
  const [people, setPeople] = useState([])

  useEffect(() => {
    if(!filterTeam) return null
    const filterByTeam = (elm) => {
      if(elm.team === filterTeam) {
        return elm
      }
    }
    const teamPeople = bdTeam.filter(filterByTeam)

    const filterId = () => teamPeople.map((elm) => {
      return elm.person_id
    })
    
    const personId = [...new Set(filterId())]

    const filterPeople = () => {
      return personId.map((elm) => {
        return bdPeople[elm]
      })
    }
    setPeople(filterPeople())
      
  },[filterTeam])

  useEffect(() => {
    setPeople(Object.values(bdPeople))
  },[bdPeople])
  
  useEffect(() => {
    const schemasTeam = () => bdTeam.map((elm) => {
      return elm.team
    })
    const newSchemasTeam = schemasTeam()
    return setSchemasTeam([...new Set(newSchemasTeam)])
  },[bdTeam])

  useEffect(() => {
    setIsMobileMod(isMobile)
  }, [isMobile])

  const keyIcon = (url) => {
    return {
      cursor:"pointer",
      widthIcon:"20px",
      heightIcon:"20px",
      fill:"#42B0FF",
      backgroundColor:"#FFF",
      padding:"8px 12px 8px",
      boxShadow:"1px 1px 0 0 #0000001a",
      _hover:{opacity: "0.8"},
      onClick:() => {window.open(url)}
    }
  }

  const handleSelect = (elm) => {
    if(filterTeam === elm) {
      setFilterTeam()
      return setPeople(Object.values(bdPeople)) 
    } else {
      return setFilterTeam(elm)
    }
  }  

  return (
    <MainPageTemplate pages={pages} paddingX="24px">
      <Stack
        position="relative"
        left={isMobileMod ? "0" :"-24px"}
      >
        <Stack
          display={isMobileMod ? "none" :"flex"}
          spacing={0}
          position="sticky"
          width="fit-content"
          height="0"
          top="40%"
          left="-32px"
          backgroundColor="#FFF"
        >
          <TwitterIcon {...keyIcon("https://twitter.com/basedosdados")} borderTop="1px solid #0000001a"/>
          <DiscordIcon {...keyIcon("https://discord.gg/huKWpsVYx4")}/>
          <GitIcon {...keyIcon("https://github.com/basedosdados")}/>
          <LinkedinIcon {...keyIcon("https://www.linkedin.com/company/base-dos-dados/mycompany/")}/>
        </Stack>

        <VStack paddingLeft={isMobileMod ? "0" : "24px"}>
          <Stack
            width="100%"
            maxWidth="1264px"
            margin="auto"
            paddingTop={{ base: "80px", lg: "0px" }}
            alignItems="center"
            paddingBottom="200px"
          >
            <Display lineHeight="52px" textAlign="center" marginBottom="56px">
              Facilitamos o acesso a dados<br/> para que a distância entre você e sua análise <br/>seja <a style={{color:"#2B8C4D"}}>apenas uma boa pergunta</a>.
            </Display>
            <Text
              width={isMobileMod ? "100%" : "80%"}
              fontFamily="ubuntu"
              fontWeight="300"
              fontSize="20px"
              lineHeight="32px"
              letterSpacing="0.2px"
              color="#6F6F6F"
              textAlign="center"
            >
              Adicionar subtitle: Milhares de pessoas encontram, baixam, cruzam e analisam dados de um jeito 
              muito mais fácil com a BD. Vivamus a urna vestibulum, luctus erat vitae, rhoncus ante. 
            </Text>
          </Stack>

          <Stack
            width="100%"
            maxWidth="1264px"
            margin="auto"
            paddingBottom="160px"
            paddingX={mScreen ? "28px" : "0"}
            spacing={0}
          >
            <Center marginBottom="80px" flexDirection="column">
              <TrophySvg width="100px" height="100px" marginBottom="8px"/>
              <BigTitle>Reconhecimentos</BigTitle>
            </Center>

            <Stack
              flexDirection={isMobileMod ? "column" : "row"}
              justifyContent="space-between"
              spacing={isMobileMod ? "120px" : "0"}
            >
              <Box textAlign="center" maxWidth={isMobileMod ? "100%" : "45%"}>
                <Image
                  src="https://basedosdados-static.s3.us-east-2.amazonaws.com/logos/2022/google_cloud.svg"
                  width="140px"
                  height="140px"
                  margin="0 auto 48px"
                />
                <SectionTitle marginBottom="16px" fontSize="22px">Google Cloud Customer Award</SectionTitle>
                <SectionText fontSize="16px">O prêmio reconheceu as implementações mais inovadoras e transformadoras do Google Cloud ao redor do mundo. 
                    Fomos a única organização brasileira a receber a premiação na categoria de Impacto Social, que também selecionou outras iniciativas que usam tecnologia para promover mais abertura e transparência. 
                    O anúncio aconteceu no Google Cloud Next'21. 
                </SectionText>
                <SectionText fontWeigth="700" fontSize="16px" color="#42B0FF">Veja mais detalhes.</SectionText>
              </Box>

              <Box textAlign="center" maxWidth={isMobileMod ? "100%" : "45%"}>
                <Image
                  src="https://basedosdados-static.s3.us-east-2.amazonaws.com/logos/2022/premio_tesouro_nacional_2021.png"
                  width="140px"
                  height="140px"
                  margin="0 auto 48px"
                />
                <SectionTitle marginBottom="16px" fontSize="22px">XXVI Prêmio Tesouro Nacional 2021</SectionTitle>
                <SectionText fontSize="16px">
                  Conquistamos o 1º lugar na categoria Soluções. O prêmio tem como objetivo expandir as fronteiras do conhecimento em finanças públicas, promovendo a normalização de temas específicos quando tratados consistentemente pela pesquisa científica. Fomos selecionados por conta de nosso trabalho compatibilizando informações de despesas e receitas orçamentárias do Setor Público Brasileiro.
                </SectionText>
                <SectionText fontWeigth="700" fontSize="16px" color="#42B0FF">Veja mais detalhes.</SectionText>
              </Box>
            </Stack>
          </Stack>
        </VStack>

      </Stack>

      <Stack
        width="100vw"
        height="100%"
        alignItems="center"
        position="relative"
        left={isMobileMod ? "-24px" : "-32px"}
        paddingBottom="160px"
        bgGradient="linear(#34A15A 62%, #FFF 62%)"
      >
        <Center flexDirection="column">
          <Display textAlign="center" paddingTop="60px" color="#FFF">
            Nossa história
          </Display>
          <Text
            fontFamily="ubuntu"
            maxWidth="650px"
            fontSize="20px"
            letterSpacing="0.2px"
            fontWeight="300"
            textAlign="center"
            color="#FFF"
            margin="8px 0 88px"
          >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ornare nibh vel ex porta pulvinar. Vivamus a urna vestibulum, luctus.</Text>
        </Center>
      
        <Center
          width="100%"
        >
          <Carousel
            settings={{
              spaceBetween: isMobileMod ? 100 : 400,
              slidesPerView: isMobileMod ? 1 : 3,
              centeredSlides: true,
              mousewheel: true
            }}
          >
            <HistoryBox
              title="Adicionar Titulo"
              date="Adicionar Data"
              text="Adicionar Texto"
            />
            <HistoryBox
              title="Adicionar Titulo"
              date="Adicionar Data"
              text="Adicionar Texto"
            />
            <HistoryBox
              title="Adicionar Titulo"
              date="Adicionar Data"
              text="Adicionar Texto"
            />
          </Carousel>
        </Center>
      </Stack>

      <Stack
        width="100%"
        maxWidth="1264px"
        margin="auto"
      >
        <Center flexDirection="column" paddingBottom="70px">
          <BigTitle marginBottom="16px">Adicionar Title</BigTitle>
          <SectionText fontSize="16px">Adicionar subTitle</SectionText>
          <SectionText fontSize="16px">Faça parte da equipe você também.</SectionText>
          <SectionText fontSize="16px" color="#42B0FF" fontWeigth="700">Veja as vagas abertas.</SectionText>
        </Center>

        <Stack
          position="relative"
          gridGap="96px"
          spacing={0}
          flexDirection={isMobileMod ? "column" :"row"}
        >
          <Box
            display="flex"
            height="100%"
            flexDirection="column"
            gridGap="16px"
            position={isMobileMod ? "relative" : "sticky"}
            top={isMobileMod? "0" : "120px"}
            z-index="20"
          >
            {schemasTeam.map((elm) => (
              <Text
                fontSize="16px"
                color={filterTeam === elm ? "#2B8C4D" :"#6F6F6F"}
                fontFamily="ubuntu"
                fontWeight="500"
                width="max-content"
                cursor="pointer"
                onClick={() => handleSelect(elm)}
              >
                {elm}
              </Text>
            ))}
          </Box>

          <Stack
            width="100%"
            spacing="100px"
          >
            {people.map((elm, index) => (
              <TeamBox
                index={index}
                data={elm}
                bdTeam={bdTeam}
              />
            ))}
          </Stack>
        </Stack>
      </Stack>

    </MainPageTemplate>
  )
}