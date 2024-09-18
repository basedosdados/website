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
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

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

export async function getServerSideProps({ locale }) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_FRONTEND}/api/team/getAllPeople`, {method: "GET"})
  const data = await response.json()

  return {
    props: {
      ...(await serverSideTranslations(locale, ['aboutUs', 'common', 'menu'])),
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
  const { t } = useTranslation('aboutUs');
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
        <title>{t('pageTitle')}</title>
        <meta
          property="og:title"
          content={t('pageTitle')}
          key="ogtitle"
        />
        <meta
          property="og:description"
          content={t('pageDescription')}
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
              {t('heroTitle1')} {isMobileMod() ? " " : <br/>} {t('heroTitle2')} {isMobileMod() ? " " : <br/>} {t('heroTitle3')} <a style={{color:"#2B8C4D"}}>{t('heroTitle4')}</a>.
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
                {t('usersCount')}
              </Display>
              <Text paddingTop="4px" letterSpacing="0.1px" fontSize="20px" fontFamily="Ubuntu" color="#252A32" fontWeight="300">
                {t('usersText')}
              </Text>
            </Center>

            <Center flexDirection="column">
              <Display>
                {t('queriesCount')}
              </Display>
              <Text paddingTop="4px" letterSpacing="0.1px" fontSize="20px" fontFamily="Ubuntu" color="#252A32" fontWeight="300">
                {t('queriesText')}
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
              {t('aboutTitle')}
            </Display>
            <BodyText paddingBottom="20px">
              {t('aboutText1')}
            </BodyText>
            <BodyText paddingBottom="20px">
              {t('aboutText2')}
            </BodyText>
            <BodyText paddingBottom="20px">
              {t('aboutText3')}
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
              {t('recognitionTitle')}
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
                  {t('googleCloudAwardTitle')}
                </SectionTitle>
                <BodyText
                  fontSize="17px"
                  lineHeight="27px"
                  letterSpacing="0.1px"
                  marginBottom="8px"
                >
                  {t('googleCloudAwardText')}
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
                  {t('googleCloudAwardLink')}
                  <RedirectIcon alt="hiperlink" fill="#42B0FF"/>
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
                  {t('treasuryAwardTitle')}
                </SectionTitle>
                <BodyText 
                  fontSize="17px"
                  lineHeight="27px"
                  letterSpacing="0.1px"
                  marginBottom="8px"
                >
                  {t('treasuryAwardText')}
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
                  {t('treasuryAwardLink')}
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
            {t('historyTitle')}
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
          >{t('historySubtitle')}</Text>
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
              title={t('historyBox1Title')}
              date={t('historyBox1Date')}
              image="https://storage.googleapis.com/basedosdados-website/historia/nossa_historia_um_grande_catalogo_colaborativo.png"
            >
              {t('historyBox1Text')}
            </HistoryBox>
            <HistoryBox
              title={t('historyBox2Title')}
              date={t('historyBox2Date')}
              image="https://storage.googleapis.com/basedosdados-website/historia/nossa_historia_o_email.png"
            >
              {t('historyBox2Text')}
            </HistoryBox>
            <HistoryBox
              title={t('historyBox3Title')}
              date={t('historyBox3Date')}
              image="https://storage.googleapis.com/basedosdados-website/historia/nossa_historia_a_happy_sunday.png"
            >
              {t('historyBox3Text')}
            </HistoryBox>
            <HistoryBox
              title={t('historyBox4Title')}
              date={t('historyBox4Date')}
              image="https://storage.googleapis.com/basedosdados-website/historia/nossa_historia_nem_so_de_boa_vontade.png"
            >
              {t('historyBox4Text')}
            </HistoryBox>
            <HistoryBox
              title={t('historyBox5Title')}
              date={t('historyBox5Date')}
              image="https://storage.googleapis.com/basedosdados-website/historia/nossa_historia_funcionario_do_mes.png"
            >
              {t('historyBox5Text')}
            </HistoryBox>
            <HistoryBox
              title={t('historyBox6Title')}
              date={t('historyBox6Date')}
              image="https://storage.googleapis.com/basedosdados-website/historia/nossa_historia_a_primeira_de_muitas.png"
            >
              {t('historyBox6Text')}
            </HistoryBox>
            <HistoryBox
              title={t('historyBox7Title')}
              date={t('historyBox7Date')}
              image="https://storage.googleapis.com/basedosdados-website/historia/nossa_historia_real_oficial.png"
            >
              {t('historyBox7Text')}
            </HistoryBox>
            <HistoryBox
              title={t('historyBox8Title')}
              date={t('historyBox8Date')}
              image="https://storage.googleapis.com/basedosdados-website/historia/nossa_historia_de_cara_nova.png"
            >
              {t('historyBox8Text')}
            </HistoryBox>
            <HistoryBox
              title={t('historyBox9Title')}
              date={t('historyBox9Date')}
              image="https://storage.googleapis.com/basedosdados-website/historia/nossa_historia_um_premio_de_peso.png"
            >
              {t('historyBox9Text')}
            </HistoryBox>
            <HistoryBox
              title={t('historyBox10Title')}
              date={t('historyBox10Date')}
              image="https://storage.googleapis.com/basedosdados-website/historia/nossa_historia_chegamos_primeiro_no_tesouro.png"
            >
              {t('historyBox10Text')}
            </HistoryBox>
            <HistoryBox
              title={t('historyBox11Title')}
              date={t('historyBox11Date')}
              image="https://storage.googleapis.com/basedosdados-website/historia/nossa_historia_conquistando_o_mundo.png"
            >
              {t('historyBox11Text')}
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
          {t('teamTitle')}
        </Display>

        {data.length > 1 ?
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
              {t('teamCategories').map((elm, i) => (
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
              {t('joinUsTitle')}
            </BigTitle>

            <BodyText paddingBottom="24px">
              {t('joinUsText')}
            </BodyText>
            <RoundedButton
              paddingX="20px"
              fontSize="15px"
              onClick={() => window.open("https://info.basedosdados.org/carreiras", "_blank")}
            >
              {t('joinUsButton')} <RedirectIcon alt="vagas basedosdados" fill="#FFF" width="15px" height="15px" marginLeft="8px"/>
            </RoundedButton>
          </Box>
        </Stack>
      </Stack>
    </MainPageTemplate>
  )
}