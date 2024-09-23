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
import { isMobileMod } from "../hooks/useCheckMobile.hook";

import Display from "../components/atoms/Display";
import RoundedButton from "../components/atoms/RoundedButton";
import SectionTitle from "../components/atoms/SectionTitle";
import BigTitle from "../components/atoms/BigTitle";
import BodyText from "../components/atoms/BodyText";
import Link from "../components/atoms/Link";
import Carousel from "../components/atoms/Carousel";

import InternalError from "../public/img/internalError";
import WebIcon  from "../public/img/icons/webIcon";
import EmailIcon  from "../public/img/icons/emailIcon";
import TwitterIcon  from "../public/img/icons/twitterIcon";
import BlueskyIcon from "../public/img/icons/blueskyIcon";
import LinkedinIcon  from "../public/img/icons/linkedinIcon";
import GithubIcon  from "../public/img/icons/githubIcon";
import DiscordIcon from "../public/img/icons/discordIcon";
import RedirectIcon from "../public/img/icons/redirectIcon";
import styles from "../styles/quemSomos.module.css";

export async function getServerSideProps() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_FRONTEND}/api/team/getAllPeople`, {method: "GET"})
  const data = await response.json()

  return {
    props: {
      data
    },
  }
}

const HistoryBox = ({ children, title, date, image }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box
      display="flex"
      flexDirection="column"
    >
      <Box
        borderRadius="20px"
        overflow="hidden"
        width={isMobileMod() ? "fit-content" : "500px"}
        height={isMobileMod() ? "100%" : "300px"}
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
      
      <Box padding={isMobileMod() ? "32px 24px 0" :"40px 24px 0"}>
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
          marginTop={isMobileMod() && "5rem"}
          marginBottom={isMobileMod() && "0"}
          background="transparent"
          maxWidth="1000px"
          margin="24px"
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

function getRoleScore(role) {
  switch (role) {
    case "presidente":
      return 1;
    case "diretora executiva":
      return 2;
    case "co-fundador":
      return 3;
    case "associado":
      return 4;
    case "gerente":
      return 5;
    case "membro do conselho fiscal":
      return 10;
    default:
      return 6;
  }
}

const TeamBox = ({
  index,
  name,
  picture,
  description,
  website,
  email,
  twitter,
  linkedin,
  github,
  career
}) => {
  const hasLeftSpacing = (index % 2 == 0) ? false : true

  const role = () => {
    const roles = []
    career.map((elm) => roles.push(elm.node.role))
    roles.sort((a, b) => getRoleScore(a.toLowerCase()) - getRoleScore(b.toLowerCase()))
    return roles.filter((elm) => elm.length > 0).join(", ")
  }

  const iconTeamBox = (ref) => {
    let href = ""

    if(ref.website) {
      const website = ref.website.replace(/(https?:)\/\//gim, "")
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

  const IconLinks = () => {
    return (
      <Box display="flex" flexDirection="row" gridGap="5px">
        {website ? <WebIcon {...iconTeamBox({website: website})}/> : null}
        {email ? <EmailIcon {...iconTeamBox({email: email})}/> : null}
        {twitter ? <TwitterIcon {...iconTeamBox({twitter: twitter})}/> : null}
        {linkedin ? <LinkedinIcon {...iconTeamBox({linkedin: linkedin})}/> : null}
        {github ? <GithubIcon {...iconTeamBox({github: github})}/> : null}
      </Box>
    )
  }

  return (
    <Box
      display="flex"
      flexDirection={isMobileMod() ? "column" : "row"}
      maxWidth="750px"
      marginLeft={isMobileMod() ? "" : hasLeftSpacing && "200px !important"}
    >
      <Box
        minWidth="160px"
        maxWidth="160px"
        minHeight="160px"
        maxHeight="160px"
        borderRadius="16px"
        marginRight="32px"
        marginBottom={isMobileMod() && "20px"}
        overflow="hidden"
      >
        <Image
          alt={name}
          src={picture ? picture : "https://storage.googleapis.com/basedosdados-website/equipe/sem_foto.png"}
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
            {name}
          </BodyText>
          {!isMobileMod() && <IconLinks/>}
        </Box>

        <BodyText
          fontSize="16px"
          fontWeight="400"
          marginBottom="4px"
          letterSpacing="0.2px"
          color="#6F6F6F"
        >
          {role()}
        </BodyText>

        <BodyText
          fontSize="16px"
          letterSpacing="0.2px"
          lineHeight="25px"
          marginBottom={isMobileMod() ? "12px" : "0"}
        >
          {description}
        </BodyText>
        {isMobileMod() && <IconLinks/>}
      </Box>
    </Box>
  )
}

export default function QuemSomos({ data }) {
  const [allPeople, setAllPeople] = useState([])
  const [people, setPeople] = useState([])
  const [filterTeam, setFilterTeam] = useState("")

  useEffect(() => {
    if(data.length === 0) return
    if(data.errors) {
      console.error(data.errors)
      setAllPeople([])
      setPeople([])
    } else {
      setAllPeople(sortPeople(data))
      setPeople(sortPeople(data))
    }
  }, [data])

  const sortPeople = (array) => {
    const sortPeopleArray = array

    function compareByRole(a, b) {
      const rolesA = a.node.careers.edges.map(edge => edge.node.role.toLowerCase())
      const rolesB = b.node.careers.edges.map(edge => edge.node.role.toLowerCase())

      const sortedRolesA = rolesA.sort((x, y) => getRoleScore(x) - getRoleScore(y))
      const sortedRolesB = rolesB.sort((x, y) => getRoleScore(x) - getRoleScore(y))

      if (getRoleScore(sortedRolesA[0]) < getRoleScore(sortedRolesB[0])) {
        return -1
      } else if (getRoleScore(sortedRolesA[0]) > getRoleScore(sortedRolesB[0])) {
        return 1
      }
      return 0
    }

    const data = sortPeopleArray.sort(compareByRole)

    function removeDuplicates(array) {
      const conjunto = new Set()
      return array.filter(obj => {
        const objetoString = JSON.stringify(obj)
        if (!conjunto.has(objetoString)) {
          conjunto.add(objetoString)
          return true
        }
        return false
      })
    }

    return removeDuplicates(data).filter(obj => obj.node.firstName !== "API User" && obj.node.firstName !== "Staging")
  }

  const schemasTeam = [
    "Co-fundadores",
    "Associados",
    "Administrativo",
    "Captação, Parcerias e Projetos",
    "Comunicação",
    "Dados",
    "Plataforma",
    "BD Edu",
    "Conselho Fiscal"
  ]

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

  const handleSelect = async (elm) => {
    window.open("#teams", "_self")
    if(filterTeam === elm) {
      setFilterTeam("")
      return setPeople(allPeople)
    } else {
      setFilterTeam(elm)
      const result = await fetch(`/api/team/getCareerPeople?team=${elm}`, {method: "GET"})
        .then(res => res.json())
      if(result.length === 0) {
        setFilterTeam("")
        return setPeople(allPeople)
      } 
      setPeople(sortPeople(result))
    }
  }

  return (
    <MainPageTemplate paddingX="24px">
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
        left={isMobileMod() ? "0" :"-24px"}
      >
        <Stack
          display={isMobileMod() ? "none" :"flex"}
          spacing={0}
          position="sticky"
          width="fit-content"
          top="40%"
          left="-32px"
          zIndex="1"
          backgroundColor="#FFF"
        >
          {/* <TwitterIcon alt="twitter basedosdados" {...keyIcon("https://twitter.com/basedosdados")} borderTop="1px solid #0000001a"/> */}
          <BlueskyIcon alt="bluesky basedosdados" {...keyIcon("https://bsky.app/profile/basedosdados.bsky.social")} borderTop="1px solid #0000001a"/>
          <DiscordIcon alt="comunidade do discord basedosdados" {...keyIcon("https://discord.gg/huKWpsVYx4")}/>
          <GithubIcon alt="repositório github" {...keyIcon("https://github.com/basedosdados")}/>
          <LinkedinIcon alt="linkedin basedosdados" {...keyIcon("https://www.linkedin.com/company/base-dos-dados/mycompany/")}/>
        </Stack>

        <VStack paddingLeft={isMobileMod() ? "0" : "30px"} position="relative" top="-40px">
          <Stack
            width="100%"
            maxWidth="1264px"
            margin="auto"
            paddingTop={{ base: "150px", lg: "0" }}
            alignItems="center"
          >
            <Display 
              fontSize={isMobileMod() ? "34px" : "60px"}
              letterSpacing={isMobileMod() ? "-0.5px" : "-1.5px"}
              lineHeight={isMobileMod() ? "40px" : "90px"}
              textAlign="center" 
              marginBottom={isMobileMod() ? "80px" : "136px"}
            >
              Facilitamos o acesso a dados {isMobileMod() ? " " : <br/>} para que a distância entre você e sua análise{isMobileMod() ? " " : <br/>}seja <a style={{color:"#2B8C4D"}}>apenas uma boa pergunta</a>.
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
            paddingBottom={isMobileMod() ? "0" : "16px"}
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
              paddingBottom={isMobileMod() ? "16px" : "24px" }
              fontSize={isMobileMod() ? "34px" : "50px" }
              lineHeight={isMobileMod() ? "40px" : "54px"}
              letterSpacing={isMobileMod() ? "-0.5px" : "-0.8px" }
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
              paddingBottom={isMobileMod() ? "56px" : "104px" }
              fontSize={isMobileMod() ? "34px" : "50px" }
              lineHeight={isMobileMod() ? "40px" : "54px"}
              letterSpacing={isMobileMod() ? "-0.5px" : "-0.8px" }
              textAlign="center"
            >
              Reconhecimentos
            </Display>

            <Stack
              flexDirection={isMobileMod() ? "column" : "row"}
              justifyContent="space-between"
              spacing={isMobileMod() ? "80px" : "0"}
              paddingX={isMobileMod() ? "0" : "16px"}
            >
              <Box textAlign="center" maxWidth={isMobileMod() ? "100%" : "45%"}>
                <Image
                  alt="google cloud"
                  src="https://storage.googleapis.com/basedosdados-website/logos/2022/google_cloud.svg"
                  width={{ base: "100px", lg: "140px" }}
                  height={{ base: "100px", lg: "140px" }}
                  margin={{base: "0 auto 24px", lg: "0 auto 48px"}}
                />
                <SectionTitle 
                  fontSize={{base: "20px", lg: "24px"}}
                  fontWeight="400"
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
                  fontWeight="500"
                  letterSpacing="0.2px"
                  target="_blank"
                  color="#42B0FF"
                  href="https://cloud.google.com/blog/topics/customers/announcing-winners-of-google-cloud-customer-awards"
                >
                  Veja mais detalhes
                  <RedirectIcon width="12px" height="12px" alt="hiperlink" fill="#42B0FF"/>
                </Link>
              </Box>

              <Box textAlign="center" maxWidth={isMobileMod() ? "100%" : "45%"}>
                <Image
                  alt="premio tesouro nacional"
                  src="https://storage.googleapis.com/basedosdados-website/logos/2022/premio_tesouro_nacional_2021.png"
                  width={{ base: "100px", lg: "140px" }}
                  height={{ base: "100px", lg: "140px" }}
                  margin={{base: "0 auto 40px", lg: "0 auto 48px"}}
                />
                <SectionTitle 
                  fontSize={{base: "20px", lg: "24px"}}
                  fontWeight="400"
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
                  fontWeight="500"
                  letterSpacing="0.2px"
                  target="_blank"
                  color="#42B0FF"
                  href="https://www.tesourotransparente.gov.br/descubra-explore-crie/crie"
                >
                  Veja mais detalhes
                  <RedirectIcon width="12px" height="12px" alt="hiperlink" fill="#42B0FF"/>
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
        left={isMobileMod() ? "-24px" : "-32px"}
        paddingBottom={{ base: "40px", lg: "104px" }}
        bgGradient={isMobileMod() ? "linear(#34A15A 38%, #FFF 38%)" : "linear(#34A15A 45%, #FFF 45%)"}
      >
        <Center flexDirection="column">
          <Display 
            padding="56px 0 8px"
            fontSize={isMobileMod() ? "34px" : "50px" }
            lineHeight={isMobileMod() ? "40px" : "54px"}
            letterSpacing={isMobileMod() ? "-0.5px" : "-0.8px" }
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
              spaceBetween: isMobileMod() ? 100 : 400,
              slidesPerView: isMobileMod() ? 1 : 3,
              navigation: !isMobileMod() && true,
              centeredSlides: true,
            }}
          >
            <HistoryBox
              title="Um grande catálogo"
              date="OUT DE 2019"
              image="https://storage.googleapis.com/basedosdados-website/historia/nossa_historia_um_grande_catalogo_colaborativo.png"
            >
              Nosso co-fundador, Ricardo Dahis, enxergou a necessidade de uma plataforma com capacidade de busca e filtragem de diferentes conjuntos de dados e iniciou esse trabalho lançando o mecanismo de busca da BD.
            </HistoryBox>
            <HistoryBox
              title="O e-mail"
              date="SET DE 2020"
              image="https://storage.googleapis.com/basedosdados-website/historia/nossa_historia_o_email.png"
            >
              Foi já no primeiro contato de João Carabetta, também co-fundador da BD, com Ricardo Dahis que veio a ambiciosa proposta: estruturar um grande <i>datalake</i> público pelo BigQuery e usar o mecanismo de busca para catalogação das bases e de seus metadados.
            </HistoryBox>
            <HistoryBox
              title="A happy sunday"
              date="SET DE 2020"
              image="https://storage.googleapis.com/basedosdados-website/historia/nossa_historia_a_happy_sunday.png"
            >
              Nos últimos três minutos de um domingo de setembro, o GitHub testemunhou o <i>commit</i> que mudaria para sempre a vida de quem trabalha com dados públicos. Criamos a estrutura do nosso <i>datalake</i>, uma ferramenta que faria a alegria de muita gente que já passou tantos domingos limpando bases.
            </HistoryBox>
            <HistoryBox
              title="Nem só de boa vontade..."
              date="SET DE 2020"
              image="https://storage.googleapis.com/basedosdados-website/historia/nossa_historia_nem_so_de_boa_vontade.png"
            >
              Começamos a receber apoio financeiro de pessoas que acreditam na importância do nosso trabalho. Isso foi fundamental para escalar nossas atividades, afinal, nem só de esforço e boa vontade se faz um bom projeto.
            </HistoryBox>
            <HistoryBox
              title="Funcionário do mês"
              date="NOV DE 2020"
              image="https://storage.googleapis.com/basedosdados-website/historia/nossa_historia_funcionario_do_mes.png"
            >
              Abrimos a primeira vaga de Assistente de Dados e contratamos a primeira pessoa remunerada para integrar nossa equipe. Aos poucos, esse time foi crescendo e hoje não é mais tão fácil assim ser funcionário(a) do mês.
            </HistoryBox>
            <HistoryBox
              title="A primeira de muitas"
              date="JAN DE 2021"
              image="https://storage.googleapis.com/basedosdados-website/historia/nossa_historia_a_primeira_de_muitas.png"
            >
              A RAIS foi nossa primeira grande base tratada e disponibilizada no <i>datalake</i> público. Subimos seus assombrosos 260 GB de microdados completos, com informações de 1985 até 2019, possibilitando agregações por município e UF.
            </HistoryBox>
            <HistoryBox
              title="Real oficial"
              date="JUN DE 2021"
              image="https://storage.googleapis.com/basedosdados-website/historia/nossa_historia_real_oficial.png"
            >
              Nos tornamos oficialmente o Instituto Base dos Dados, uma organização sem fins lucrativos, com equipe formal, CNPJ e tudo que tem direito. Um passo importante para consolidar nosso trabalho.
            </HistoryBox>
            <HistoryBox
              title="De cara nova"
              date="SET DE 2021"
              image="https://storage.googleapis.com/basedosdados-website/historia/nossa_historia_de_cara_nova.png"
            >
              Desenvolver o novo site foi um dos maiores e desafiadores projetos que assumimos. Apesar dos momentos de caos e peças mirabolantes, aos poucos tudo foi se encaixando e tomando a forma de uma plataforma com a nossa cara. Assim, nasceu a primeira versão do novo site da BD, com interface mais intuitiva, design moderno e uma estrutura que facilita ainda mais a experiência dos usuários.
            </HistoryBox>
            <HistoryBox
              title="Um prêmio de peso"
              date="OUT DE 2021"
              image="https://storage.googleapis.com/basedosdados-website/historia/nossa_historia_um_premio_de_peso.png"
            >
              Precisamos de muitas mãos para carregar essa conquista. Recebemos o <i>Google Cloud Customer Award</i> na categoria de Impacto Social. O prêmio inédito foi anunciado no evento internacional, <i>Google Cloud Next'21</i>, e tem como objetivo reconhecer as implementações mais inovadoras e transformadoras do Google Cloud ao redor do mundo.
            </HistoryBox>
            <HistoryBox
              title="Chegamos primeiro no tesouro"
              date="NOV DE 2021"
              image="https://storage.googleapis.com/basedosdados-website/historia/nossa_historia_chegamos_primeiro_no_tesouro.png"
            >
              Conquistamos o 1º lugar na categoria Soluções do XXVI Prêmio Tesouro Nacional 2021. O prêmio tem como objetivo expandir as fronteiras do conhecimento em finanças públicas, promovendo a normalização de temas específicos quando tratados consistentemente pela pesquisa científica.
            </HistoryBox>
            <HistoryBox
              title="Conquistando o mundo"
              date="Muito em breve"
              image="https://storage.googleapis.com/basedosdados-website/historia/nossa_historia_conquistando_o_mundo.png"
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
          paddingBottom={isMobileMod() ? "56px" : "104px" }
          fontSize={isMobileMod() ? "34px" : "50px" }
          lineHeight={isMobileMod() ? "40px" : "54px"}
          letterSpacing={isMobileMod() ? "-0.5px" : "-0.8px" }
          textAlign="center"
        >
          Uma equipe colaborativa
        </Display>

        {data.length > 0 ?
          <Stack
            position="relative"
            gridGap="96px"
            spacing={0}
            flexDirection={isMobileMod() ? "column" :"row"}
            paddingBottom="32px"
          >
            <Box
              display="flex"
              height="100%"
              flexDirection="column"
              gridGap="16px"
              position={isMobileMod() ? "relative" : "sticky"}
              top={isMobileMod()? "0" : "120px"}
              z-index="20"
            >
              {schemasTeam?.map((elm, i) => (
                <Text
                  key={i}
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
                  key={index}
                  index={index}
                  name={`${elm.node.firstName} ${elm.node.lastName}`}
                  picture={elm.node.picture}
                  description={elm.node.description}
                  website={elm.node.website}
                  email={elm.node.email}
                  twitter={elm.node.twitter}
                  linkedin={elm.node.linkedin}
                  github={elm.node.github}
                  career={elm.node.careers.edges}
                />
              ))}
            </Stack>
          </Stack>
        :
          <Stack justifyContent="center" alignItems="center">
            <InternalError
              widthImage="300"
              heightImage="300"
            />
          </Stack>
        }

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
              alignItems="center"
              onClick={() => window.open("https://info.basedosdados.org/carreiras", "_blank")}
            >
              Veja as vagas abertas <RedirectIcon alt="vagas basedosdados" fill="#FFF" width="12px" height="12px" marginLeft="8px"/>
            </RoundedButton>
          </Box>
        </Stack>
      </Stack>
    </MainPageTemplate>
  )
}