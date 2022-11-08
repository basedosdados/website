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
import Head from "next/head";
import { useState, useEffect } from "react";
import { useDisclosure } from "@chakra-ui/hooks";
import { MainPageTemplate } from "../components/templates/main";
import { useCheckMobile } from "../hooks/useCheckMobile.hook";
import { withPages } from "../hooks/pages.hook";
import {
  getBDTeams,
  getBDPeople
} from "./api/team";
import Display from "../components/atoms/Display";
import RoundedButton from "../components/atoms/RoundedButton";
import SectionTitle from "../components/atoms/SectionTitle";
import BigTitle from "../components/atoms/BigTitle";
import BodyText from "../components/atoms/BodyText";
import Link from "../components/atoms/Link";
import Carousel from "../components/atoms/Carousel";
import WebIcon  from "../public/img/icons/webIcon";
import EmailIcon  from "../public/img/icons/emailIcon";
import TwitterIcon  from "../public/img/icons/twitterIcon";
import LinkedinIcon  from "../public/img/icons/linkedinIcon";
import GithubIcon  from "../public/img/icons/githubIcon";
import DiscordIcon from "../public/img/icons/discordIcon";
import RedirectIcon from "../public/img/icons/redirectIcon";
import styles from "../styles/quemSomos.module.css";

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
          alt={title}
          widht="100%"
          height="100%"
          src={image}
        />
      </Box>
      
      <Box padding={isMobileMod ? "32px 24px 0" :"40px 24px 0"}>
        <Text
          fontFamily="ubuntu"
          maxWidth="400px"
          color="#252A32"
          fontSize="20px"
          letterSpacing="0.2px"
          marginBottom="8px"
          lineHeight="26px"
        >{title}</Text>
        <BodyText fontSize="14px" letterSpacing="0.5px" color="#6F6F6F" marginBottom="16px">{date}</BodyText>
        <BodyText fontSize="17px" lineHeight="27px">
          {children}
        </BodyText>
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
            alt={title}
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

    if(ref.website) {
      const website = ref.website.replace(/(https:)\/\//gim, "")
      href = `https://${website}`
    }
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
      alt : "",
      cursor: "pointer",
      width:"22px",
      height:"22px",
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
        {data.github ? <GithubIcon {...iconTeamBox({github: data.github})}/> : null}
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
      >
        <Image
          alt={data?.name || ""}
          src={data.photo_url ? data.photo_url : "https://basedosdados-static.s3.us-east-2.amazonaws.com/equipe/sem_foto.png"}
          width="100%"
          height="100%"
        />
      </Box>
      <Box display="flex" flexDirection="column">
        <Box marginBottom="4px" display="flex" flexDirection="row">
          <BodyText
            fontSize="18px"
            marginRight="16px"
          >
            {data?.name}
          </BodyText>
          {!isMobileMod && iconLinks()}
        </Box>
        <BodyText
          fontSize="16px"
          fontWeight="400"
          marginBottom="4px"
          letterSpacing="0.2px"
          color="#6F6F6F"
        >
          {data?.role.join(", ")}
        </BodyText>
        <BodyText fontSize="16px" letterSpacing="0.2px" lineHeight="25px" marginBottom={isMobileMod ? "12px" : "0"}>{data?.description}</BodyText>
        {isMobileMod && iconLinks()}
      </Box>
    </Box>
  )
}

export default function QuemSomos({ pages, bdTeam, bdPeople }) {
  const isMobile = useCheckMobile()
  const [isMobileMod, setIsMobileMod] = useState(false)

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
        const indexTeam = person.team.findIndex((res) => res === personTeam)
        if(indexTeam > -1) return person.team[indexTeam]
      })

      const orderByName = newPeopleByTeam.sort((a, b) => {
        const compareName = (firstPerson, secondPerson) => firstPerson.name.localeCompare(secondPerson.name)

        if (compareName(a, b) < compareName(b, a)) return -1
        if (compareName(a, b) > compareName(b, a)) return 1
        return 0
      })

      const orderByLevel = orderByName.sort((a, b) => {
        const valueLevel = (elm) => {{
          const levelPerson = elm.level[0]
          if(levelPerson === "Presidente") return -3
          if(levelPerson === "Diretora Executiva") return -2
          if(levelPerson === "Gerente") return -1
          return 0
        }}

        return valueLevel(a) - valueLevel(b)
      })

      orderByLevel.map((res) => {
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
    setAllPeople(groupingTeamAndRole(Object.values(bdPeople)).filter(Boolean))
  },[bdTeam, bdPeople])

  const groupingTeamAndRole = (array) => array.map((elm) => {
    const person = elm
    const team = []
    const role = []
    const level = []
    const endDate = []

    const getById = bdTeam.filter((elm) => elm.person_id === person.id)

    if(getById) getById.map((res) => {
      team.push(res.team)
      role.push(res.role)
      level.push(res.level)
      endDate.push(res.end_date)
    })

    const filterArray = (array) => Array.from(new Set(array.filter(Boolean)))

    const departureDate = filterArray(endDate)

    if(departureDate.length > 0) {
      const endDate = new Date(departureDate[0])
      const dateNow = new Date()
      if(endDate < dateNow) return ""
    }

    return {
      ...person,
      team : filterArray(team),
      role : filterArray(role),
      level : filterArray(level),
    }
  })

  useEffect(() => {
    if(filterTeam) filterPeopleByTeam(filterTeam)
  },[filterTeam])

  const filterPeopleByTeam = (team) => {
    const teamPeople = bdTeam.filter((elm) => elm.team === team)

    const mapId = () => teamPeople.map((elm) => elm.person_id)
    
    const personIdList = Array.from(new Set(mapId()))

    const filterPeople = () => personIdList.map((personId) => bdPeople[personId])
      
    const newGroupPerson = groupingTeamAndRole(filterPeople()).filter(Boolean)

    setPeople(sortingTeam(newGroupPerson, [team]))
  }

  const keyIcon = (url) => {
    return {
      cursor:"pointer",
      width:"35px",
      height:"35px",
      fill:"#42B0FF",
      backgroundColor:"#FFF",
      padding:"6px",
      boxShadow:"1px 1px 0 0 #0000001a",
      _hover:{opacity: "0.8"},
      onClick:() => {window.open(url)}
    }
  }

  const handleSelect = (elm) => {
    window.open("#teams", "_self")
    if(filterTeam === elm) {
      setFilterTeam()
      return setPeople(sortingTeam(allPeople))
    } else {
      return setFilterTeam(elm)
    }
  }

  return (
    <MainPageTemplate pages={pages} paddingX="24px">
      <Head>
        <title>Quem Somos – Base dos Dados</title>
        <meta
          property="og:title"
          content="Quem Somos – Base dos Dados"
          key="ogtitle"
        />
        <meta
          property="og:description"
          content="Conheça a Base dos Dados. Nós facilitamos o acesso a dados para que a distância entre você e sua análise seja apenas uma boa pergunta. Saiba mais sobre a história da organização e sobre a equipe por trás do nosso trabalho."
          key="ogdesc"
        />
      </Head>

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
          zIndex="1"
          backgroundColor="#FFF"
        >
          <TwitterIcon alt="twitter basedosdados" {...keyIcon("https://twitter.com/basedosdados")} borderTop="1px solid #0000001a"/>
          <DiscordIcon alt="comunidade do discord basedosdados" {...keyIcon("https://discord.gg/huKWpsVYx4")}/>
          <GithubIcon alt="repositório github" {...keyIcon("https://github.com/basedosdados")}/>
          <LinkedinIcon alt="linkedin basedosdados" {...keyIcon("https://www.linkedin.com/company/base-dos-dados/mycompany/")}/>
        </Stack>

        <VStack paddingLeft={isMobileMod ? "0" : "30px"} position="relative" top="-40px">
          <Stack
            width="100%"
            maxWidth="1264px"
            margin="auto"
            paddingTop={{ base: "112px", lg: "0" }}
            alignItems="center"
          >
            <Display 
              fontSize={isMobile ? "34px" : "60px"}
              letterSpacing={isMobileMod ? "-0.5px" : "-1.5px"}
              lineHeight={isMobileMod ? "40px" : "90px"}
              textAlign="center" 
              marginBottom={isMobile ? "80px" : "136px"}
            >
              Facilitamos o acesso a dados {isMobileMod ? " " : <br/>} para que a distância entre você e sua análise{isMobileMod ? " " : <br/>}seja <a style={{color:"#2B8C4D"}}>apenas uma boa pergunta</a>.
            </Display>
          </Stack>

          <Stack
            width="100%"
            flexDirection={{base: "column", lg: "row"}}
            spacing={{base: "40px", lg: "0"}}
            gridGap="8%"
            maxWidth="1264px"
            justifyContent="center"
            marginTop="0px !important"
            paddingBottom={isMobileMod ? "0" : "16px"}
          >
            <Center flexDirection="column">
              <Display>
                +114 mil
              </Display>
              <Text paddingTop="4px" letterSpacing="0.1px" fontSize="20px" fontFamily="Ubuntu" color="#252A32" fontWeight="300">
                usuários na plataforma 
              </Text>
            </Center>

            <Center flexDirection="column">
              <Display>
                +1,3 milhão
              </Display>
              <Text paddingTop="4px" letterSpacing="0.1px" fontSize="20px" fontFamily="Ubuntu" color="#252A32" fontWeight="300">
                consultas aos dados
              </Text>
            </Center>   
          </Stack>

          <Stack
            paddingTop={{ base: "112px", lg: "144px" }}
            paddingBottom={{ base: "96px", lg: "104px" }}
            marginTop="0px !important"
            textAlign="center"
            justifyContent="center"
            maxWidth="1264px"
            width={{ base: "100%", lg: "650px" }}
          >
            <Display
              paddingBottom={isMobileMod ? "16px" : "24px" }
              fontSize={isMobileMod ? "34px" : "50px" }
              lineHeight={isMobileMod ? "40px" : "54px"}
              letterSpacing={isMobileMod ? "-0.5px" : "-0.8px" }
            >
              A Base dos Dados
            </Display>
            <BodyText paddingBottom="20px">
              Somos uma organização não-governamental sem fins lucrativos e <i>open source</i> que atua para universalizar o acesso a dados de qualidade. Fazemos isso através da criação de ferramentas inovadoras, da produção e difusão do conhecimento e da promoção de uma cultura de transparência e dados abertos.
            </BodyText>
            <BodyText paddingBottom="20px">
              Ao quebrar barreiras técnicas para quem já faz e quem quer começar a fazer análise de dados, reunimos uma rede altamente engajada que potencializa o impacto do nosso trabalho. Estamos construindo uma comunidade de pessoas que acreditam no uso inteligente de dados como instrumento para o desenvolvimento socioeconômico e que encontram na BD uma grande aliada.
            </BodyText>
            <BodyText paddingBottom="20px">
              O que queremos é aproximar diferentes setores da sociedade de informações que são de interesse coletivo, mas ainda pouco acessíveis para a maioria das pessoas. Acreditamos que ampliar o acesso e uso de dados abertos favorece o aumento da participação social, a melhoria da gestão pública e o aperfeiçoamento da democracia.
            </BodyText>
          </Stack>

          <Stack
            width="100%"
            maxWidth="1264px"
            margin="auto"
            paddingBottom={{ base: "80px", lg: "104px" }}
            spacing={0}
          >
            <Display
              paddingBottom={isMobileMod ? "56px" : "104px" }
              fontSize={isMobileMod ? "34px" : "50px" }
              lineHeight={isMobileMod ? "40px" : "54px"}
              letterSpacing={isMobileMod ? "-0.5px" : "-0.8px" }
              textAlign="center"
            >
              Reconhecimentos
            </Display>

            <Stack
              flexDirection={isMobileMod ? "column" : "row"}
              justifyContent="space-between"
              spacing={isMobileMod ? "80px" : "0"}
              paddingX={isMobileMod ? "0" : "16px"}
            >
              <Box textAlign="center" maxWidth={isMobileMod ? "100%" : "45%"}>
                <Image
                  alt="google cloud"
                  src="https://basedosdados-static.s3.us-east-2.amazonaws.com/logos/2022/google_cloud.svg"
                  width={{ base: "100px", lg: "140px" }}
                  height={{ base: "100px", lg: "140px" }}
                  margin={{base: "0 auto 24px", lg: "0 auto 48px"}}
                />
                <SectionTitle 
                  fontSize={{base: "20px", lg: "24px"}}
                  fontWeigth="400"
                  letterSpacing={{base: "0.2px", lg: "0px"}}
                  marginBottom={{base: "8px", lg: "16px"}}
                >
                  Google Cloud Customer Award
                </SectionTitle>
                <BodyText
                  fontSize="17px"
                  lineHeight="27px"
                  letterSpacing="0.1px"
                  marginBottom="8px"
                >
                  O prêmio reconheceu as implementações mais inovadoras e transformadoras do Google Cloud ao redor do mundo. 
                  Fomos a única organização brasileira a receber a premiação na categoria de Impacto Social, que também selecionou outras iniciativas que usam tecnologia para promover mais abertura e transparência. 
                </BodyText>
                <Link
                  display="flex"
                  gridGap="8px"
                  alignItems="center"
                  justifyContent="center"
                  fontFamily="Ubuntu"
                  fontSize="16px"
                  fontWeigth="500"
                  letterSpacing="0.2px"
                  target="_blank"
                  color="#42B0FF"
                  href="https://cloud.google.com/blog/topics/customers/announcing-winners-of-google-cloud-customer-awards"
                >
                  Veja mais detalhes
                  <RedirectIcon alt="hiperlink" fill="#42B0FF"/>
                </Link>
              </Box>

              <Box textAlign="center" maxWidth={isMobileMod ? "100%" : "45%"}>
                <Image
                  alt="premio tesouro nacional"
                  src="https://basedosdados-static.s3.us-east-2.amazonaws.com/logos/2022/premio_tesouro_nacional_2021.png"
                  width={{ base: "100px", lg: "140px" }}
                  height={{ base: "100px", lg: "140px" }}
                  margin={{base: "0 auto 40px", lg: "0 auto 48px"}}
                />
                <SectionTitle 
                  fontSize={{base: "20px", lg: "24px"}}
                  fontWeigth="400"
                  letterSpacing={{base: "0.2px", lg: "0px"}}
                  marginBottom={{base: "8px", lg: "16px"}}
                >
                  XXVI Prêmio Tesouro Nacional 2021
                </SectionTitle>
                <BodyText 
                  fontSize="17px"
                  lineHeight="27px"
                  letterSpacing="0.1px"
                  marginBottom="8px"
                >
                  Conquistamos o 1º lugar na categoria Soluções do prêmio, que tem como objetivo reconhecer o desenvolvimento de aplicações em ciências de dados e inteligência artificial aplicadas a finanças públicas. Fomos selecionados por conta de nosso trabalho compatibilizando informações de despesas e receitas orçamentárias do Setor Público Brasileiro.
                </BodyText>
                <Link
                  display="flex"
                  gridGap="8px"
                  alignItems="center"
                  justifyContent="center" 
                  fontFamily="Ubuntu"
                  fontSize="16px"
                  fontWeigth="500"
                  letterSpacing="0.2px"
                  target="_blank"
                  color="#42B0FF"
                  href="https://www.tesourotransparente.gov.br/descubra-explore-crie/crie"
                >
                  Veja mais detalhes
                  <RedirectIcon alt="hiperlink" fill="#42B0FF"/>
                </Link>
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
        paddingBottom={{ base: "40px", lg: "104px" }}
        bgGradient={isMobileMod ? "linear(#34A15A 38%, #FFF 38%)" : "linear(#34A15A 45%, #FFF 45%)"}
      >
        <Center flexDirection="column">
          <Display 
            padding="56px 0 8px"
            fontSize={isMobileMod ? "34px" : "50px" }
            lineHeight={isMobileMod ? "40px" : "54px"}
            letterSpacing={isMobileMod ? "-0.5px" : "-0.8px" }
            color="#FFF"
          >
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
              title="Um grande catálogo"
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
              Abrimos a primeira vaga de Assistente de Dados e contratamos a primeira pessoa remunerada para integrar nossa equipe. Aos poucos, esse time foi crescendo e hoje não é mais tão fácil assim ser funcionário(a) do mês.
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
        id="teams"
        width="100%"
        maxWidth="1264px"
        margin="auto"
      >
        <Display
          paddingBottom={isMobileMod ? "56px" : "104px" }
          fontSize={isMobileMod ? "34px" : "50px" }
          lineHeight={isMobileMod ? "40px" : "54px"}
          letterSpacing={isMobileMod ? "-0.5px" : "-0.8px" }
          textAlign="center"
        >
          Uma equipe colaborativa
        </Display>

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
                letterSpacing="0.2px"
                onClick={() => handleSelect(elm)}
              >
                {elm}
              </Text>
            ))}
          </Box>

          <Stack
            width="100%"
            spacing={{ base: "72px", lg: "96px" }}
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

        <Stack
          width="100%"
          height="100%"
          alignItems="center"
          padding="104px 0 64px"
        >
          <Box
            maxWidth="800px"
            padding="32px"
            borderRadius="20px"
            boxShadow="0 2px 8px 1px rgba(64, 60, 67, 0.16)"
          >
            <BigTitle paddingBottom="16px">
              Venha colaborar com a transparência
            </BigTitle>

            <BodyText paddingBottom="24px">
              Faça parte de uma organização que está mudando a maneira de acessar dados.<br/>
              Reunimos pessoas de várias partes do Brasil, empenhadas em contribuir e trabalhar<br/>
              por mais transparência pública.
            </BodyText>
            <RoundedButton
              paddingX="20px"
              fontSize="15px"
              onClick={() => window.open("https://info.basedosdados.org/carreiras", "_blank")}
            >
              Veja as vagas abertas <RedirectIcon alt="vagas basedosdados" fill="#FFF" width="15px" height="15px" marginLeft="8px"/>
            </RoundedButton>
          </Box>
        </Stack>

      </Stack>

    </MainPageTemplate>
  )
}