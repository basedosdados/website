import {
  Box,
  Center,
  Stack,
  VStack,
  Image,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
} from "@chakra-ui/react";
import React, { useState, useEffect} from "react";
import { useDisclosure } from "@chakra-ui/hooks";
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
import Link from "../components/atoms/Link";
import Carousel from "../components/atoms/Carousel";
import WebIcon  from "../public/img/icons/webIcon";
import EmailIcon  from "../public/img/icons/emailIcon";
import TwitterIcon  from "../public/img/icons/twitterIcon";
import LinkedinIcon  from "../public/img/icons/linkedinIcon";
import GitIcon  from "../public/img/icons/gitIcon";
import DiscordIcon from "../public/img/icons/discordIcon";
import TrophySvg from "../public/img/trophySvg";
import styles from "../styles/quemSomos.module.css"

export async function getStaticProps(context) {
  const bdTeam = await getBDTeams();
  const bdPeople = await getBDPeople();

  return await withPages({
    props: {
      bdTeam,
      bdPeople
    },
    revalidate: 60,
  })
}

const HistoryBox = ({ children, title, date, image }) => {
  const isMobile = useCheckMobile();
  const [isMobileMod, setIsMobileMod] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  
  useEffect(() => {
    setIsMobileMod(isMobile)
  }, [isMobile])

  return (
    <Box
      display="flex"
      flexDirection="column"
    >
      <Box
        borderRadius="20px"
        overflow="hidden"
        width={isMobileMod ? "fit-content" : "500px"}
        height={isMobileMod ? "100%" : "300px"}
        boxShadow="0 2px 20px 0 #00000026"
        cursor="pointer"
        onClick={onOpen}
      >
        <Image
          widht="100%"
          height="100%"
          src={image}
        />
      </Box>
      
      <Box padding={isMobileMod ? "20px 24px 0" :"40px 48px 0"}>
        <Text
          fontFamily="ubuntu"
          maxWidth="400px"
          color="#252A32"
          fontSize={{ base: "18px", lg: "20px" }}
          letterSpacing="0.2px"
          marginBottom="8px"
        >{title}</Text>
        <SectionText fontSize={{ base: "14px", lg: "16px" }} color="#6F6F6F" marginBottom="16px">{date}</SectionText>
        <SectionText fontSize={{ base: "14px", lg: "16px" }}>
          {children}
        </SectionText>
      </Box>

      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay backdropFilter="blur(2px)"/>
        <ModalContent
          marginTop={isMobileMod && "5rem"}
          marginBottom={isMobileMod && "0"}
          background="transparent"
          maxWidth="1000px"
        >
          <Image
            widht="100%"
            height="100%"
            src={image}
            onClick={onClose}
            cursor="pointer"
          />
        </ModalContent>
      </Modal>
    </Box>
  )
}

const TeamBox = ({ isMobileMod, index, data }) => {
  const hasLeftSpacing = (index % 2 == 0) ? false : true

  const iconTeamBox = (ref) => {
    let href = ""

    if(ref.website) href = `${ref.website}`
    if(ref.email) href = `mailto:${ref.email}`
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
      maxWidth="750px"
      marginLeft={isMobileMod ? "" : hasLeftSpacing && "200px !important"}
    >
      <Box
        minWidth="160px"
        maxWidth="160px"
        minHeight="160px"
        maxHeight="160px"
        borderRadius="16px"
        marginRight="32px"
        marginBottom={isMobileMod && "20px"}
        overflow="hidden"
        backgroundColor={!data.photo_url && "#F4F4F4"}
      >
        {data.photo_url && <Image src={data.photo_url} width="100%" height="100%"/>}
      </Box>
      <Box display="flex" flexDirection="column">
        <Box marginBottom={{ base: "0", lg: "4px" }} display="flex" flexDirection="row">
          <Text
            fontSize={{ base: "16px", lg: "18px" }}
            fontFamily="ubuntu"
            fontWeight="300"
            color="#6F6F6F"
            marginRight="16px"
          >
            {data?.name}
          </Text>
          {!isMobileMod && iconLinks()}
        </Box>
        <Text
          marginBottom={{ base: "8px", lg: "12px" }}
          fontSize={{ base: "16px", lg: "18px" }}
          fontFamily="ubuntu"
          fontWeight="300"
          color="#252A32"
        >
          {data?.role.join(", ")}
        </Text>
        <SectionText marginBottom="16px" fontSize={{ base: "14px", lg: "16px" }}>{data?.description}</SectionText>
        {isMobileMod && iconLinks()}
      </Box>
    </Box>
  )
}

export default function QuemSomos({ pages, bdTeam, bdPeople }) {
  const isMobile = useCheckMobile()
  const [isMobileMod, setIsMobileMod] = useState(false)
  const [mScreen] = useMediaQuery("(max-width: 1390px)")

  useEffect(() => {
    setIsMobileMod(isMobile)
  }, [isMobile])

  const [allPeople, setAllPeople] = useState([])
  const [people, setPeople] = useState([])
  const [filterTeam, setFilterTeam] = useState("")

  const schemasTeam = [
    "Co-fundadores",
    "Associados",
    "Administrativo",
    "Captação, Parcerias e Projetos",
    "Comunicação",
    "Dados",
    "Infraestrutura",
    "Website",
    "Conselho Fiscal"
  ]

  const sortingTeam = (array, team = schemasTeam) => {
    let arraySorting = []

    team.map((personTeam) => {
      const newPeopleByTeam = array.filter((person) => {
        const indexTeam = person.team.indexOf(personTeam)
        if(indexTeam === -1) {
          return ""
        } else { 
          return person.team[indexTeam] === personTeam
        }
      })

      newPeopleByTeam.sort(function (a, b) {
        const compareName = (firstPerson, secondPerson) => firstPerson.name.localeCompare(secondPerson.name)
        
        if (a.role[0] === "Presidente") return -3
        if (a.role[0] === "Diretoria") return -2
        if (a.role[0] === "Gerente") return -1
        if (compareName(a, b) > compareName(b, a)) {
          return 1
        }
        if (compareName(a, b) < compareName(b, a)) {
          return -1
        }
        return 0
      })

      newPeopleByTeam.map((res) => {
        arraySorting.push(res)
      })

    })
    const newArraySorting = [...new Set(arraySorting)]
    return newArraySorting
  }

  useEffect(() => {
    setPeople(sortingTeam(allPeople))
  },[allPeople])

  useEffect(() => {
    setAllPeople(groupingTeamAndRole(Object.values(bdPeople)))
  },[bdTeam, bdPeople])

  const groupingTeamAndRole = (array) => array.map((elm) => {
    const person = elm
    const team = []
    const role = []

    const getById = bdTeam.filter((elm) => elm.person_id === person.id)

    if(getById) getById.map((res) => {
      team.push(res.team)
      role.push(res.role)
    })

    const refiningTeam = Array.from(new Set(team.filter(Boolean)))
    const refiningRole = Array.from(new Set(role.filter(Boolean)))

    return {...person, team : refiningTeam, role : refiningRole}
  })

  useEffect(() => {
    if(filterTeam) filterPeopleByTeam(filterTeam)
  },[filterTeam])

  const filterPeopleByTeam = (team) => {
    const teamPeople = bdTeam.filter((elm) => elm.team === team)

    const mapId = () => teamPeople.map((elm) => elm.person_id)
    
    const personIdList = Array.from(new Set(mapId()))

    const filterPeople = () => personIdList.map((personId) => bdPeople[personId])
      
    const newGroupPerson = groupingTeamAndRole(filterPeople())

    setPeople(sortingTeam(newGroupPerson, [team]))
  }

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
      return setPeople(sortingTeam(allPeople))
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
          top="40%"
          left="-32px"
          backgroundColor="#FFF"
        >
          <TwitterIcon {...keyIcon("https://twitter.com/basedosdados")} borderTop="1px solid #0000001a"/>
          <DiscordIcon {...keyIcon("https://discord.gg/huKWpsVYx4")}/>
          <GitIcon {...keyIcon("https://github.com/basedosdados")}/>
          <LinkedinIcon {...keyIcon("https://www.linkedin.com/company/base-dos-dados/mycompany/")}/>
        </Stack>

        <VStack paddingLeft={isMobileMod ? "0" : "24px"} position="relative" top="-145px">
          <Stack
            width="100%"
            maxWidth="1264px"
            margin="auto"
            paddingTop={{ base: "80px", lg: "128px" }}
            alignItems="center"
          >
            <Display 
              lineHeight={{ base: "40px", lg: "52px" }}
              textAlign="center" 
              marginBottom="56px"
            >
              Facilitamos o acesso a dados {isMobileMod ? " " : <br/>} para que a distância entre você e sua análise {isMobileMod ? " " : <br/>} seja <a style={{color:"#2B8C4D"}}>apenas uma boa pergunta</a>.
            </Display>
            <Text
              width={isMobileMod ? "100%" : "80%"}
              fontFamily="Lato"
              fontWeight="300"
              fontSize="20px"
              lineHeight="32px"
              letterSpacing="0.2px"
              color="#6F6F6F"
              textAlign="center"
            >
              Milhares de pessoas encontram, baixam, cruzam e analisam dados {isMobileMod ? " " : <br/>} de uma maneira muito mais prática com a BD.  
            </Text>
          </Stack>

          <Stack
            width="100%"
            paddingTop="80px"
            flexDirection={{base: "column", lg: "row"}}
            spacing={{base: 20, lg: 0}}
            gridGap="20%"
            maxWidth="1264px"
            justifyContent="center"
          >
            <Center flexDirection="column">
              <Text fontFamily="ubuntu" fontWeight="400" fontSize="30px" lineHeight="32px" letterSpacing="0.2px">
                +104k
              </Text>
              <SectionText fontSize="18px">
                usuários na plataforma 
              </SectionText>
            </Center>

            <Center flexDirection="column">
              <Text fontFamily="ubuntu" fontWeight="400" fontSize="30px" lineHeight="32px" letterSpacing="0.2px">
                +1MM
              </Text>
              <SectionText fontSize="18px">
                consultas aos dados
              </SectionText>
            </Center>
          </Stack>

          <Stack
            paddingTop={{ base: "80px", lg: "144px" }}
            paddingBottom={{ base: "80px", lg: "144px" }}
            textAlign="center"
            justifyContent="center"
            maxWidth="1264px"
            width={{ base: "100%", lg: "50%" }}
          >
            <BigTitle 
              paddingBottom="24px"
            >
              A Base dos Dados
            </BigTitle>
            <SectionText lineHeight="26px" fontSize={{ base: "16px", lg: "18px" }} paddingBottom="20px">
              Somos uma organização não-governamental sem fins lucrativos e <i>open source</i> que atua para universalizar o acesso a dados de qualidade. Fazemos isso através da criação de ferramentas inovadoras, da produção e difusão do conhecimento e da promoção de uma cultura de transparência e dados abertos.
            </SectionText>
            <SectionText lineHeight="26px" fontSize={{ base: "16px", lg: "18px" }} paddingBottom="20px">
              Ao quebrar barreiras técnicas para quem já faz e quem quer começar a fazer análise de dados, reunimos uma rede altamente engajada que potencializa o impacto do nosso trabalho. Estamos construindo uma comunidade de pessoas que acreditam no uso inteligente de dados como instrumento para o desenvolvimento socioeconômico e que encontram na BD uma grande aliada.
            </SectionText>
            <SectionText lineHeight="26px" fontSize={{ base: "16px", lg: "18px" }} paddingBottom="20px">
              O que queremos é aproximar diferentes setores da sociedade de informações que são de interesse coletivo, mas ainda pouco acessíveis para a maioria das pessoas. Acreditamos que ampliar o acesso e uso de dados abertos favorece o aumento da participação social, a melhoria da gestão pública e o aperfeiçoamento da democracia.
            </SectionText>
          </Stack>

          <Stack
            width="100%"
            maxWidth="1264px"
            margin="auto"
            paddingBottom={{ base: "80px", lg: "120px" }}
            paddingX={mScreen ? "28px" : "0"}
            spacing={0}
          >
            <Center 
              paddingBottom={{ base: "56px", lg: "32px" }}
              flexDirection="column"
            >
              <TrophySvg 
                width={{ base: "50px", lg: "70px" }} 
                height={{ base: "50px", lg: "70px" }} 
                marginBottom="8px"
              />
              <BigTitle>Reconhecimentos</BigTitle>
            </Center>

            <Stack
              flexDirection={isMobileMod ? "column" : "row"}
              justifyContent="space-between"
              spacing={isMobileMod ? "80px" : "0"}
            >
              <Box textAlign="center" maxWidth={isMobileMod ? "100%" : "45%"}>
                <Image
                  src="https://basedosdados-static.s3.us-east-2.amazonaws.com/logos/2022/google_cloud.svg"
                  width={{ base: "100px", lg: "140px" }}
                  height={{ base: "100px", lg: "140px" }}
                  margin={{base: "0 auto 24px", lg: "0 auto 48px"}}
                />
                <SectionTitle 
                  marginBottom="16px"  
                  fontSize={{ base: "18px", lg: "22px" }}
                  letterSpacing={{base: "0.1px", lg: "0.2px"}}
                >
                  Google Cloud Customer Award
                </SectionTitle>
                <SectionText marginBottom="8px" fontSize="16px">O prêmio reconheceu as implementações mais inovadoras e transformadoras do Google Cloud ao redor do mundo. 
                    Fomos a única organização brasileira a receber a premiação na categoria de Impacto Social, que também selecionou outras iniciativas que usam tecnologia para promover mais abertura e transparência. 
                </SectionText>
                <Link fontSize="16px" target="_blank" color="#42B0FF" href="https://cloud.google.com/blog/topics/customers/announcing-winners-of-google-cloud-customer-awards">Veja mais detalhes.</Link>
              </Box>

              <Box textAlign="center" maxWidth={isMobileMod ? "100%" : "45%"}>
                <Image
                  src="https://basedosdados-static.s3.us-east-2.amazonaws.com/logos/2022/premio_tesouro_nacional_2021.png"
                  width={{ base: "100px", lg: "140px" }}
                  height={{ base: "100px", lg: "140px" }}
                  margin={{base: "0 auto 40px", lg: "0 auto 48px"}}
                />
                <SectionTitle 
                  marginBottom="16px"  
                  fontSize={{ base: "18px", lg: "22px" }}
                  letterSpacing={{base: "0.1px", lg: "0.2px"}}
                >
                  XXVI Prêmio Tesouro Nacional 2021
                </SectionTitle>
                <SectionText marginBottom="8px" fontSize="16px">
                  Conquistamos o 1º lugar na categoria Soluções. O prêmio tem como objetivo reconhecer o desenvolvimento de aplicações em ciências de dados e inteligência artificial aplicadas a finanças públicas. Fomos selecionados por conta de nosso trabalho compatibilizando informações de despesas e receitas orçamentárias do Setor Público Brasileiro.
                </SectionText>
                <Link fontSize="16px" target="_blank" color="#42B0FF" href="https://www.tesourotransparente.gov.br/descubra-explore-crie/crie">Veja mais detalhes.</Link>
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
        paddingBottom={{ base: "80px", lg: "144px" }}
        bgGradient="linear(#34A15A 45%, #FFF 45%)"
      >
        <Center flexDirection="column">
          <Display textAlign="center" paddingTop="56px" color="#FFF">
            Nossa história
          </Display>
          <Text
            fontFamily="ubuntu"
            maxWidth="650px"
            fontSize={{ base: "18px", lg: "20px" }}
            letterSpacing={{ base: "0.1px", lg: "0.2px" }}
            fontWeight="300"
            textAlign="center"
            color="#FFF"
            margin="8px 0 48px"
          >Alguns dos marcos que definiram nossa trajetória até aqui</Text>
        </Center>
      
        <Center
          width="100%"
          className={styles.historyTimeLine}
        >
          <Carousel
            settings={{
              spaceBetween: isMobileMod ? 100 : 400,
              slidesPerView: isMobileMod ? 1 : 3,
              navigation: !isMobileMod && true,
              centeredSlides: true,
            }}
          >
            <HistoryBox
              title="Um grande catálogo colaborativo"
              date="OUT DE 2019"
              image="https://basedosdados-static.s3.us-east-2.amazonaws.com/historia/nossa_historia_Um_grande_catalogo_colaborativo.png"
            >
              Nosso co-fundador, Ricardo Dahis, enxergou a necessidade de uma plataforma com capacidade de busca e filtragem de diferentes conjuntos de dados e iniciou esse trabalho lançando o mecanismo de busca da BD.
            </HistoryBox>
            <HistoryBox
              title="O e-mail"
              date="SET DE 2020"
              image="https://basedosdados-static.s3.us-east-2.amazonaws.com/historia/nossa_historia_O_email.png"
            >
              Foi já no primeiro contato de João Carabetta, também co-fundador da BD, com Ricardo Dahis que veio a ambiciosa proposta: estruturar um grande <i>datalake</i> público pelo BigQuery e usar o mecanismo de busca para catalogação das bases e de seus metadados.
            </HistoryBox>
            <HistoryBox
              title="A happy sunday"
              date="SET DE 2020"
              image="https://basedosdados-static.s3.us-east-2.amazonaws.com/historia/nossa_historia_A_happy_sunday.png"
            >
              Nos últimos três minutos de um domingo de setembro, o GitHub testemunhou o <i>commit</i> que mudaria para sempre a vida de quem trabalha com dados públicos. Criamos a estrutura do nosso <i>datalake</i>, uma ferramenta que faria a alegria de muita gente que já passou tantos domingos limpando bases.
            </HistoryBox>
            <HistoryBox
              title="Nem só de boa vontade..."
              date="SET DE 2020"
              image="https://basedosdados-static.s3.us-east-2.amazonaws.com/historia/nossa_historia_Nem_so_de_boa_vontade.png"
            >
              Começamos a receber apoio financeiro de pessoas que acreditam na importância do nosso trabalho. Isso foi fundamental para escalar nossas atividades, afinal, nem só de esforço e boa vontade se faz um bom projeto.
            </HistoryBox>
            <HistoryBox
              title="Funcionário do mês"
              date="NOV DE 2020"
              image="https://basedosdados-static.s3.us-east-2.amazonaws.com/historia/nossa_historia_Funcionario_do_mes.png"
            >
              Abrimos a primeira vaga de engenharia de dados e contratamos a primeira pessoa remunerada para integrar nossa equipe. Aos poucos, esse time foi crescendo e hoje não é mais tão fácil assim ser funcionário(a) do mês.
            </HistoryBox>
            <HistoryBox
              title="A primeira de muitas"
              date="JAN DE 2021"
              image="https://basedosdados-static.s3.us-east-2.amazonaws.com/historia/nossa_historia_A_primeira_de_muitas.png"
            >
              A RAIS foi nossa primeira grande base tratada e disponibilizada no <i>datalake</i> público. Subimos seus assombrosos 260 GB de microdados completos, com informações de 1985 até 2019, possibilitando agregações por município e UF.
            </HistoryBox>
            <HistoryBox
              title="Real oficial"
              date="JUN DE 2021"
              image="https://basedosdados-static.s3.us-east-2.amazonaws.com/historia/nossa_historia_Real_oficial.png"
            >
              Nos tornamos oficialmente o Instituto Base dos Dados, uma organização sem fins lucrativos, com equipe formal, CNPJ e tudo que tem direito. Um passo importante para consolidar nosso trabalho.
            </HistoryBox>
            <HistoryBox
              title="De cara nova"
              date="SET DE 2021"
              image="https://basedosdados-static.s3.us-east-2.amazonaws.com/historia/nossa_historia_De_cara_nova.png"
            >
              Desenvolver o novo site foi um dos maiores e desafiadores projetos que assumimos. Apesar dos momentos de caos e peças mirabolantes, aos poucos tudo foi se encaixando e tomando a forma de uma plataforma com a nossa cara. Assim, nasceu a primeira versão do novo site da BD, com interface mais intuitiva, design moderno e uma estrutura que facilita ainda mais a experiência dos usuários.
            </HistoryBox>
            <HistoryBox
              title="Um prêmio de peso"
              date="OUT DE 2021"
              image="https://basedosdados-static.s3.us-east-2.amazonaws.com/historia/nossa_historia_Um_premio_de_peso.png"
            >
              Precisamos de muitas mãos para carregar essa conquista. Recebemos o <i>Google Cloud Customer Award</i> na categoria de Impacto Social. O prêmio inédito foi anunciado no evento internacional, <i>Google Cloud Next'21</i>, e tem como objetivo reconhecer as implementações mais inovadoras e transformadoras do Google Cloud ao redor do mundo.
            </HistoryBox>
            <HistoryBox
              title="Chegamos primeiro no tesouro"
              date="NOV DE 2021"
              image="https://basedosdados-static.s3.us-east-2.amazonaws.com/historia/nossa_historia_Chegamos_primeiro_no_tesouro.png"
            >
              Conquistamos o 1º lugar na categoria Soluções do XXVI Prêmio Tesouro Nacional 2021. O prêmio tem como objetivo expandir as fronteiras do conhecimento em finanças públicas, promovendo a normalização de temas específicos quando tratados consistentemente pela pesquisa científica.
            </HistoryBox>
            <HistoryBox
              title="Conquistando o mundo"
              date="Muito em breve"
              image="https://basedosdados-static.s3.us-east-2.amazonaws.com/historia/nossa_historia_Conquistando_o_mundo.png"
            >
              A necessidade de ter um repositório que centralize importantes bases de dados já tratadas e padronizadas não é exclusiva do Brasil. Imagina ter um <i>datalake</i> aberto que permite o acesso e cruzamento de dados de diversos países diferentes? Esse é o futuro da BD.
            </HistoryBox>
          </Carousel>
        </Center>
      </Stack>

      <Stack
        width="100%"
        maxWidth="1264px"
        margin="auto"
      >
        <Center flexDirection="column" paddingBottom="72px">
          <BigTitle marginBottom="16px">Uma equipe colaborativa</BigTitle>
          <SectionText textAlign="center" fontSize="16px">Somos uma rede de pessoas empenhadas em contribuir {isMobileMod ? " " : <br/>} com a transparência e a democratização do acesso a dados.</SectionText>
          <SectionText fontSize="16px">Faça parte da equipe você também.</SectionText>
          <Link fontSize="16px" target="_blank" color="#42B0FF" href="https://info.basedosdados.org/carreiras">Veja as vagas abertas.</Link>
        </Center>

        <Stack
          position="relative"
          gridGap="96px"
          spacing={0}
          flexDirection={isMobileMod ? "column" :"row"}
          paddingBottom="32px"
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
            {schemasTeam?.map((elm) => (
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
            spacing={{ base: "64px", lg: "96px" }}
          >
            {people?.map((elm, index) => (
              <TeamBox
                index={index}
                data={elm}
                isMobileMod={isMobileMod}
              />
            ))}
          </Stack>
        </Stack>
      </Stack>

    </MainPageTemplate>
  )
}