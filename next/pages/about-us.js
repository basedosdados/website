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
  Spinner,
} from "@chakra-ui/react";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useDisclosure } from "@chakra-ui/hooks";
import { MainPageTemplate } from "../components/templates/main";
import { isMobileMod } from "../hooks/useCheckMobile.hook";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { capitalize } from "lodash";
import { useRouter } from "next/router";

import Button from "../components/atoms/Button";
import Display from "../components/atoms/Text/Display";
import TitleText from "../components/atoms/Text/TitleText";
import LabelText from "../components/atoms/Text/LabelText";
import BodyText from "../components/atoms/Text/BodyText";
import Link from "../components/atoms/Link";
import Carousel from "../components/atoms/Carousel";

import InternalError from "../public/img/internalError";
import WebIcon from "../public/img/icons/webIcon";
import EmailIcon from "../public/img/icons/emailIcon";
import XIcon from "../public/img/icons/xIcon";
import BlueskyIcon from "../public/img/icons/blueskyIcon";
import LinkedinIcon from "../public/img/icons/linkedinIcon";
import GithubIcon from "../public/img/icons/githubIcon";
import DiscordIcon from "../public/img/icons/discordIcon";
import RedirectIcon from "../public/img/icons/redirectIcon";
import styles from "../styles/quemSomos.module.css";

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["aboutUs", "common", "menu"])),
    },
  };
}

const HistoryBox = ({ children, title, date, image }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box display="flex" flexDirection="column">
      <Box
        borderRadius="20px"
        overflow="hidden"
        width={{ base: "fit-content", lg: "500px" }}
        height={{ base: "100%", lg: "300px" }}
        boxShadow="0 2px 20px 0 #00000026"
        cursor="pointer"
        onClick={onOpen}
      >
        <Image alt={title} widht="100%" height="100%" src={image} />
      </Box>

      <Box padding="40px 24px 0">
        <TitleText marginBottom="8px">{title}</TitleText>
        <LabelText
          fontWeight="400"
          color="#71757A"
          marginBottom="16px"
          typography="small"
        >
          {date}
        </LabelText>
        <BodyText textAlign="start" color="#464A51" typography="large">
          {children}
        </BodyText>
      </Box>

      <Modal
        isCentered={isMobileMod() ? false : true}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay backdropFilter="blur(2px)" />
        <ModalContent background="transparent" maxWidth="1000px" margin="24px">
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
  );
};

function getRoleScore(role) {
  switch (role) {
    case "ceo":
      return 1;
    case "platform_leader":
      return 2;
    case "db_lab_leader":
      return 2;
    case "communication_community_leader":
      return 2;
    case "db_edu_leader":
      return 2;
    case "data_leader":
      return 3;
    case "board_chair":
      return 5;
    case "cofounder":
      return 6;
    case "member":
      return 7;
    case "fiscal_council_member":
      return 10;
    default:
      return 4;
  }
}

function getTeamScore(slug) {
  switch (slug) {
    case "board_directors":
      return 1;
    case "platform":
      return 2;
    case "db_lab":
      return 3;
    case "db_edu":
      return 4;
    case "communication":
      return 5;
    case "board":
      return 6;
    case "members":
      return 7;
    case "cofounders":
      return 8;
    case "fiscal_council":
      return 9;
    case "admin":
      return 10;
    default:
      return 11;
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
  careers,
  locale,
}) => {
  const hasLeftSpacing = index % 2 == 0 ? false : true;

  const role = () => {
    const roles = [];
    careers.map((elm) => {
      const roleData = elm.node.role;
      if (!roleData) return;
      const roleName = roleData[`name${capitalize(locale)}`];
      if (roleName) roles.push(roleName);
    });
    roles.sort(
      (a, b) => getRoleScore(a.toLowerCase()) - getRoleScore(b.toLowerCase()),
    );
    return roles.filter((elm) => elm.length > 0).join(", ");
  };

  const iconTeamBox = (ref) => {
    let href = "";

    if (ref.website) {
      const website = ref.website.replace(/(https?:)\/\//gim, "");
      href = `https://${website}`;
    }
    if (ref.email) href = `mailto:${ref.email}`;
    if (ref.twitter) {
      const twitter = ref.twitter.replace(/(https:)\/\/(twitter.com)\//gim, "");
      href = `https://twitter.com/${twitter}`;
    }
    if (ref.linkedin) {
      const linkedin = ref.linkedin.replace(
        /(https:)\/\/(linkedin.com)\/(in)\//gim,
        "",
      );
      href = `https://linkedin.com/in/${linkedin}`;
    }
    if (ref.github) {
      const github = ref.github.replace(/(https:)\/\/(github.com)\//gim, "");
      href = `https://github.com/${github}`;
    }

    return {
      alt: "",
      cursor: "pointer",
      width: "22px",
      height: "22px",
      fill: "#0068C5",
      _hover: { fill: "#0057A4" },
      onClick: () => {
        window.open(href);
      },
    };
  };

  const IconLinks = ({ ...props }) => {
    return (
      <Box display="flex" flexDirection="row" gap="5px" {...props}>
        {website ? <WebIcon {...iconTeamBox({ website: website })} /> : null}
        {email ? <EmailIcon {...iconTeamBox({ email: email })} /> : null}
        {twitter ? <XIcon {...iconTeamBox({ twitter: twitter })} /> : null}
        {linkedin ? (
          <LinkedinIcon {...iconTeamBox({ linkedin: linkedin })} />
        ) : null}
        {github ? <GithubIcon {...iconTeamBox({ github: github })} /> : null}
      </Box>
    );
  };

  return (
    <Box
      display="flex"
      flexDirection={{ base: "column", lg: "row" }}
      maxWidth="750px"
      marginLeft={{ base: "0", lg: hasLeftSpacing ? "200px !important" : "0" }}
    >
      <Box
        minWidth="160px"
        maxWidth="160px"
        minHeight="160px"
        maxHeight="160px"
        borderRadius="16px"
        marginRight="32px"
        marginBottom={{ base: "20px", lg: "0" }}
        overflow="hidden"
      >
        <Image
          alt={name}
          src={
            picture
              ? picture
              : "https://storage.googleapis.com/basedosdados-website/equipe/sem_foto.png"
          }
          width="100%"
          height="100%"
        />
      </Box>
      <Box display="flex" flexDirection="column">
        <Box
          display="flex"
          gap="16px"
          flexDirection="row"
          alignItems="center"
          marginBottom="4px"
        >
          <LabelText typography="large" textAlign="start">
            {name}
          </LabelText>
          <IconLinks display={{ base: "none", lg: "flex" }} />
        </Box>

        <LabelText color="#71757A" textAlign="start" marginBottom="4px">
          {role()}
        </LabelText>

        <LabelText
          fontWeight="400"
          typography="large"
          textAlign="start"
          color="#464A51"
          marginBottom={{ base: "12px", lg: "0" }}
        >
          {description}
        </LabelText>
        <IconLinks display={{ base: "flex", lg: "none" }} />
      </Box>
    </Box>
  );
};

export default function AboutUs() {
  const { t } = useTranslation("aboutUs");
  const { locale } = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [data, setData] = useState([]);
  const [allPeople, setAllPeople] = useState([]);
  const [people, setPeople] = useState([]);
  const [filterTeam, setFilterTeam] = useState("");
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/team/getAllPeople?locale=${locale}`,
          { method: "GET" },
        );
        if (!response.ok) {
          throw new Error("Erro");
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Erro:", error);
      }
      setLoadingData(true);
      setIsLoading(true);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length === 0) return;
    if (data.errors) {
      console.error(data.errors);
      setAllPeople([]);
      setPeople([]);
    } else {
      setAllPeople(sortPeople(data));
      setPeople(sortPeople(data));
    }
  }, [data]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(`/api/team/getAllTeams?locale=${locale}`);
        if (!response.ok) {
          throw new Error("Error fetching teams");
        }
        const result = await response.json();
        if (result.success) {
          setTeams(result.resource);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchTeams();
  }, [locale]);

  const sortPeople = (array) => {
    const sortPeopleArray = array;

    function compareByRole(a, b) {
      const rolesA = a.node.careers.edges
        .map((edge) => {
          const roleData = edge.node.role;
          if (!roleData) return "";
          return roleData.slug || "";
        })
        .filter(Boolean);

      const rolesB = b.node.careers.edges
        .map((edge) => {
          const roleData = edge.node.role;
          if (!roleData) return "";
          return roleData.slug || "";
        })
        .filter(Boolean);

      // If no valid roles found, sort to end
      if (!rolesA.length) return 1;
      if (!rolesB.length) return -1;

      const sortedRolesA = rolesA.sort(
        (x, y) => getRoleScore(x) - getRoleScore(y),
      );
      const sortedRolesB = rolesB.sort(
        (x, y) => getRoleScore(x) - getRoleScore(y),
      );

      if (getRoleScore(sortedRolesA[0]) < getRoleScore(sortedRolesB[0])) {
        return -1;
      } else if (
        getRoleScore(sortedRolesA[0]) > getRoleScore(sortedRolesB[0])
      ) {
        return 1;
      }
      return 0;
    }

    const data = sortPeopleArray.sort(compareByRole);

    function removeDuplicates(array) {
      const conjunto = new Set();
      return array.filter((obj) => {
        const objetoString = JSON.stringify(obj);
        if (!conjunto.has(objetoString)) {
          conjunto.add(objetoString);
          return true;
        }
        return false;
      });
    }

    return removeDuplicates(data).filter(
      (obj) =>
        obj.node.firstName !== "API User" && obj.node.firstName !== "Staging",
    );
  };

  const keyIcon = (url) => {
    return {
      cursor: "pointer",
      width: "35px",
      height: "35px",
      fill: "#0068C5",
      _hover: { fill: "#0057A4" },
      backgroundColor: "#FFF",
      padding: "6px",
      boxShadow: "1px 1px 0 0 #0000001a",
      onClick: () => {
        window.open(url);
      },
    };
  };

  const handleSelect = async (elm) => {
    window.open("#teams", "_self");
    setIsLoading(false);
    if (filterTeam === elm) {
      setFilterTeam("");
      setIsLoading(true);
      return setPeople(allPeople);
    } else {
      setFilterTeam(elm);
      const result = await fetch(
        `/api/team/getTeamMembers?team=${elm}&locale=${locale}`,
        { method: "GET" },
      ).then((res) => res.json());
      if (result.length === 0) {
        setFilterTeam("");
        setIsLoading(true);
        return setPeople(allPeople);
      }
      setIsLoading(true);
      setPeople(sortPeople(result));
    }
  };

  return (
    <MainPageTemplate>
      <Head>
        <title>{t("pageTitle")}</title>
        <meta property="og:title" content={t("pageTitle")} key="ogtitle" />
        <meta
          property="og:description"
          content={t("pageDescription")}
          key="ogdesc"
        />
      </Head>

      <Stack spacing={0}>
        <Stack
          display={{ base: "none", lg: "flex" }}
          spacing={0}
          position="sticky"
          width="fit-content"
          top="40%"
          zIndex="1"
          backgroundColor="#FFF"
        >
          <XIcon
            alt="twitter basedosdados"
            {...keyIcon("https://x.com/basedosdados")}
            borderTop="1px solid #0000001a"
          />
          <BlueskyIcon
            alt="bluesky basedosdados"
            {...keyIcon("https://bsky.app/profile/basedosdados.bsky.social")}
          />
          <DiscordIcon
            alt="comunidade do discord basedosdados"
            {...keyIcon("https://discord.gg/huKWpsVYx4")}
          />
          <GithubIcon
            alt="repositório github"
            {...keyIcon("https://github.com/basedosdados")}
          />
          <LinkedinIcon
            alt="linkedin basedosdados"
            {...keyIcon(
              "https://www.linkedin.com/company/base-dos-dados/mycompany/",
            )}
          />
        </Stack>

        <VStack spacing={0}>
          <Stack
            width="100%"
            maxWidth="1440px"
            margin="auto"
            paddingTop={{ base: "128px", lg: "0" }}
            paddingX="24px"
            paddingBottom="50px"
            alignItems="center"
          >
            <Display
              as="h1"
              width="100%"
              typography="large"
              display={{ base: "block", lg: "flex" }}
              flexDirection="column"
              textAlign="center"
              marginBottom="80px"
            >
              <Text as="span">{t("heroTitle1")}</Text>
              <Text as="span" marginLeft="12px">
                {t("heroTitle2")}
              </Text>
              <Text as="span" marginLeft="12px">
                {t("heroTitle3")}
                <Text
                  as="span"
                  width="fit-content"
                  marginLeft="12px"
                  color="#2B8C4D"
                >
                  {t("heroTitle4")}
                  <Text as="span" color="#252A32">
                    .
                  </Text>
                </Text>
              </Text>
            </Display>

            <Stack
              width="100%"
              flexDirection={{ base: "column", lg: "row" }}
              spacing={{ base: "40px", lg: "0" }}
              gridGap={{ base: "0", lg: "128px" }}
              maxWidth="1440px"
              justifyContent="center"
              marginTop="0px !important"
              paddingBottom={{ base: "0", lg: "16px" }}
              paddingX="24px"
            >
              <Center flexDirection="column">
                <TitleText textAlign="center" typography="large">
                  {t("usersCount")}
                </TitleText>
                <LabelText
                  paddingTop="4px"
                  fontWeight="400"
                  textAlign="center"
                  color="#464A51"
                  typography="large"
                >
                  {t("usersText")}
                </LabelText>
              </Center>

              <Center flexDirection="column">
                <TitleText textAlign="center" typography="large">
                  {t("queriesCount")}
                </TitleText>
                <LabelText
                  paddingTop="4px"
                  fontWeight="400"
                  textAlign="center"
                  color="#464A51"
                  typography="large"
                >
                  {t("queriesText")}
                </LabelText>
              </Center>
            </Stack>
          </Stack>

          <Stack
            padding="94px 24px 50px"
            textAlign="center"
            justifyContent="center"
            maxWidth="1440px"
            spacing="24px"
            width={{ base: "100%", lg: "650px" }}
          >
            <Display as="h2" textAlign="center" color="#252A32">
              {t("aboutTitle")}
            </Display>
            <BodyText typography="large" color="#464A51">
              {t("aboutText1")}
            </BodyText>
            <BodyText typography="large" color="#464A51">
              {t("aboutText2")}
            </BodyText>
            <BodyText typography="large" color="#464A51">
              {t("aboutText3")}
            </BodyText>
          </Stack>

          <Stack
            width="100%"
            maxWidth="1440px"
            margin="auto"
            padding="94px 24px 144px"
            spacing={0}
          >
            <Display as="h2" textAlign="center" paddingBottom="104px">
              {t("recognitionTitle")}
            </Display>

            <Stack
              flexDirection={{ base: "column", lg: "row" }}
              justifyContent="space-between"
              alignItems="center"
              gap="80px"
              spacing="0"
            >
              <Box textAlign="center" maxWidth="600px">
                <Image
                  alt="google cloud"
                  src="https://storage.googleapis.com/basedosdados-website/logos/2022/google_cloud.svg"
                  width="140px"
                  height="140px"
                  margin="0 auto 48px"
                />
                <TitleText textAlign="center" marginBottom="20px">
                  {t("googleCloudAwardTitle")}
                </TitleText>
                <BodyText marginBottom="8px" typography="large" color="#464A51">
                  {t("googleCloudAwardText")}
                </BodyText>
                <Link
                  display="flex"
                  gridGap="8px"
                  alignItems="center"
                  justifyContent="center"
                  fontWeight="400"
                  fontSize="18px"
                  lineHeight="26px"
                  target="_blank"
                  color="#0068C5"
                  fill="#0068C5"
                  _hover={{
                    color: "#0057A4",
                    fill: "#0057A4",
                  }}
                  href="https://cloud.google.com/blog/topics/customers/announcing-winners-of-google-cloud-customer-awards"
                >
                  {t("googleCloudAwardLink")}
                  <RedirectIcon width="18px" height="18px" alt="hiperlink" />
                </Link>
              </Box>

              <Box textAlign="center" maxWidth="600px">
                <Image
                  alt="premio tesouro nacional"
                  src="https://storage.googleapis.com/basedosdados-website/logos/2022/premio_tesouro_nacional_2021.png"
                  width="140px"
                  height="140px"
                  margin="0 auto 48px"
                />
                <TitleText textAlign="center" marginBottom="20px">
                  {t("treasuryAwardTitle")}
                </TitleText>
                <BodyText marginBottom="8px" typography="large" color="#464A51">
                  {t("treasuryAwardText")}
                </BodyText>
                <Link
                  display="flex"
                  gridGap="8px"
                  alignItems="center"
                  justifyContent="center"
                  fontWeight="400"
                  fontSize="18px"
                  lineHeight="26px"
                  target="_blank"
                  color="#0068C5"
                  fill="#0068C5"
                  _hover={{
                    color: "#0057A4",
                    fill: "#0057A4",
                  }}
                  href="https://www.tesourotransparente.gov.br/descubra-explore-crie/crie"
                >
                  {t("treasuryAwardLink")}
                  <RedirectIcon width="18px" height="18px" alt="hiperlink" />
                </Link>
              </Box>
            </Stack>
          </Stack>
        </VStack>
      </Stack>

      <Stack
        width="100%"
        height="100%"
        alignItems="center"
        paddingBottom="50px"
        bgGradient={{
          base: "linear(#34A15A 38%, #FFF 38%)",
          lg: "linear(#34A15A 45%, #FFF 45%)",
        }}
      >
        <Center flexDirection="column" padding="56px 24px">
          <Display
            as="h2"
            textAlign="center"
            color="#FFFFFF"
            paddingBottom="16px"
          >
            {t("historyTitle")}
          </Display>
          <TitleText textAlign="center" color="#FFFFFF">
            {t("historySubtitle")}
          </TitleText>
        </Center>

        <Center width="100%" className={styles.historyTimeLine}>
          <Carousel
            settings={{
              spaceBetween: isMobileMod() ? 100 : 400,
              slidesPerView: isMobileMod() ? 1 : 3,
              navigation: !isMobileMod() && true,
              centeredSlides: true,
            }}
          >
            <HistoryBox
              title={t("historyBox1Title")}
              date={t("historyBox1Date")}
              image="https://storage.googleapis.com/basedosdados-website/historia/nossa_historia_um_grande_catalogo_colaborativo.png"
            >
              {t("historyBox1Text")}
            </HistoryBox>
            <HistoryBox
              title={t("historyBox2Title")}
              date={t("historyBox2Date")}
              image="https://storage.googleapis.com/basedosdados-website/historia/nossa_historia_o_email.png"
            >
              {t("historyBox2Text")}
            </HistoryBox>
            <HistoryBox
              title={t("historyBox3Title")}
              date={t("historyBox3Date")}
              image="https://storage.googleapis.com/basedosdados-website/historia/nossa_historia_a_happy_sunday.png"
            >
              {t("historyBox3Text")}
            </HistoryBox>
            <HistoryBox
              title={t("historyBox4Title")}
              date={t("historyBox4Date")}
              image="https://storage.googleapis.com/basedosdados-website/historia/nossa_historia_nem_so_de_boa_vontade.png"
            >
              {t("historyBox4Text")}
            </HistoryBox>
            <HistoryBox
              title={t("historyBox5Title")}
              date={t("historyBox5Date")}
              image="https://storage.googleapis.com/basedosdados-website/historia/nossa_historia_funcionario_do_mes.png"
            >
              {t("historyBox5Text")}
            </HistoryBox>
            <HistoryBox
              title={t("historyBox6Title")}
              date={t("historyBox6Date")}
              image="https://storage.googleapis.com/basedosdados-website/historia/nossa_historia_a_primeira_de_muitas.png"
            >
              {t("historyBox6Text")}
            </HistoryBox>
            <HistoryBox
              title={t("historyBox7Title")}
              date={t("historyBox7Date")}
              image="https://storage.googleapis.com/basedosdados-website/historia/nossa_historia_real_oficial.png"
            >
              {t("historyBox7Text")}
            </HistoryBox>
            <HistoryBox
              title={t("historyBox8Title")}
              date={t("historyBox8Date")}
              image="https://storage.googleapis.com/basedosdados-website/historia/nossa_historia_de_cara_nova.png"
            >
              {t("historyBox8Text")}
            </HistoryBox>
            <HistoryBox
              title={t("historyBox9Title")}
              date={t("historyBox9Date")}
              image="https://storage.googleapis.com/basedosdados-website/historia/nossa_historia_um_premio_de_peso.png"
            >
              {t("historyBox9Text")}
            </HistoryBox>
            <HistoryBox
              title={t("historyBox10Title")}
              date={t("historyBox10Date")}
              image="https://storage.googleapis.com/basedosdados-website/historia/nossa_historia_chegamos_primeiro_no_tesouro.png"
            >
              {t("historyBox10Text")}
            </HistoryBox>
            <HistoryBox
              title={t("historyBox11Title")}
              date={t("historyBox11Date")}
              image="https://storage.googleapis.com/basedosdados-website/historia/nossa_historia_conquistando_o_mundo.png"
            >
              {t("historyBox11Text")}
            </HistoryBox>
          </Carousel>
        </Center>
      </Stack>

      <Stack
        id="teams"
        width="100%"
        maxWidth="1440px"
        padding="54px 24px 50px"
        margin="auto"
        spacing={0}
      >
        <Display as="h2" textAlign="center" paddingBottom="104px">
          {t("teamTitle")}
        </Display>

        {!loadingData ? (
          <Stack>
            <Spinner
              margin="0 auto"
              width="200px"
              height="200px"
              color="#2B8C4D"
            />
          </Stack>
        ) : data.length > 0 ? (
          <Stack
            position="relative"
            gap="80px"
            spacing={0}
            flexDirection={{ base: "column", lg: "row" }}
            justifyContent="space-between"
            paddingBottom="50px"
          >
            <Box
              display="flex"
              height="100%"
              flexDirection="column"
              gap="16px"
              position={{ base: "relative", lg: "sticky" }}
              top={{ base: "0", lg: "120px" }}
              z-index="20"
            >
              {teams
                .sort(
                  (a, b) =>
                    getTeamScore(a.node.slug) - getTeamScore(b.node.slug),
                )
                .map((elm, i) => (
                  <LabelText
                    key={i}
                    color={filterTeam === elm.node.slug ? "#2B8C4D" : "#71757A"}
                    _hover={{
                      color: "#2B8C4D",
                    }}
                    width="max-content"
                    cursor="pointer"
                    onClick={() => handleSelect(elm.node.slug)}
                  >
                    {elm.node[`name${capitalize(locale)}`] || elm.node.name}
                  </LabelText>
                ))}
            </Box>

            {!isLoading ? (
              <Stack width="100%" justifyContent="center">
                <Spinner
                  margin="0 auto"
                  width="200px"
                  height="200px"
                  color="#2B8C4D"
                />
              </Stack>
            ) : (
              <Stack width="fit-content" spacing={{ base: "72px", lg: "96px" }}>
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
                    careers={elm.node.careers.edges}
                    locale={locale}
                  />
                ))}
              </Stack>
            )}
          </Stack>
        ) : (
          <Stack justifyContent="center" alignItems="center">
            <InternalError widthImage="300" heightImage="300" />
          </Stack>
        )}

        <Stack
          width="100%"
          height="100%"
          alignItems="center"
          padding="94px 24px 14px"
        >
          <Box
            display="flex"
            flexDirection="column"
            align-items="flex-start"
            padding="32px"
            maxWidth="800px"
            borderRadius="20px"
            boxShadow="0 2px 8px 1px rgba(64, 60, 67, 0.16)"
            backgroundColor="#FFFFFF"
          >
            <TitleText paddingBottom="8px" typography="large">
              {t("joinUsTitle")}
            </TitleText>

            <BodyText
              color="#464A51"
              textAlign="start"
              paddingBottom="24px"
              typography="large"
            >
              {t("joinUsText")}
            </BodyText>
            <Link
              target="_blank"
              href="https://info.basedosdados.org/carreiras"
            >
              <Button
                height="54px"
                backgroundColor="#0D99FC"
                padding="10px 16px"
                fontSize="20px"
                lineHeight="30px"
                _hover={{
                  backgroundColor: "#0B89E2",
                }}
              >
                {t("joinUsButton")}
                <RedirectIcon
                  alt="vagas basedosdados"
                  fill="#FFFFFF"
                  width="18px"
                  height="18px"
                  marginLeft="8px"
                />
              </Button>
            </Link>
          </Box>
        </Stack>
      </Stack>
    </MainPageTemplate>
  );
}
