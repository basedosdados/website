import {
  Box,
  Stack,
  Text,
  Link,
  Tooltip,
  Badge,
  Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Head from "next/head";
import Display from "../components/atoms/Display";
import BigTitle from "../components/atoms/BigTitle"
import BodyText from "../components/atoms/BodyText";
import RoundedButton from "../components/atoms/RoundedButton";
import { MainPageTemplate } from "../components/templates/main";
import { isMobileMod } from "../hooks/useCheckMobile.hook";

import CheckIcon from "../public/img/icons/checkIcon";
import CrossIcon from "../public/img/icons/crossIcon";
import InfoIcon from '../public/img/icons/infoIcon';

export async function getServerSideProps(context) {
  const { req, res } = context
  let user = null

  if(req.cookies.userBD) user = JSON.parse(req.cookies.userBD)

  if (user === null || Object.keys(user).length < 0) {
    return {
      props: {
        username: null,
        isBDPro: false,
        isBDEmp: false
      }
    }
  }

  return {
    props: {
      username: user.username,
      isBDPro: user?.proSubscription === "bd_pro",
      isBDEmp: user?.proSubscription === "bd_pro_empresas"
    }
  }
}

export const CardPrice = ({
  title,
  badge,
  subTitle,
  personConfig,
  textResource,
  resources = [],
  button,
}) => {
  const [nubmerOfPerson, setNubmerOfPerson] = useState(personConfig.person)
  const [priceValue, setPriceValue] = useState(personConfig.price)

  const addRemovePersonPrice = (action) => {
    if(action === "add") {
      const personAdd = nubmerOfPerson + 1
      setNubmerOfPerson(personAdd)
      setPriceValue(150 + 50 * personAdd)
    }
    if(action === "remove") {
      const personRemove = nubmerOfPerson - 1
      setNubmerOfPerson(personRemove)
      setPriceValue(150 + 50 * personRemove)
    }
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      position="relative"
      width={isMobileMod() ? "100%" : "272px"}
      boxSizing={isMobileMod() ? "inherit" : "content-box"}
      borderRadius="16px"
      boxShadow="0 2px 16px 0 rgba(100, 96, 103, 0.16)"
      padding="40px 24px"
      textAlign="center"
    >
      <Box
        height="fit-content"
      >
        <Box
          display="flex"
          flexDirection="row"
          gap="8px"
          justifyContent="center"
          alignItems="center"
          marginBottom="8px"
        >
          <BigTitle>{title}</BigTitle>
          {badge &&
            <Badge
              padding="4px 5px"
              textTransform="none"
              borderRadius="6px"
              backgroundColor="#DEDFE0"
              color="#252A32"
              fontSize="10px"
              fontFamily="ubuntu"
              fontWeight="300"
              letterSpacing="0.2px"
            >{badge}</Badge>}
        </Box>

        <Box marginBottom="24px">{subTitle}</Box>

        <Box
          justifyContent="center"
          display="flex"
          flexDirection="row"
          height="50px"
          alignItems="center"
          marginBottom="40px"
        >
          <Text
            color="#252A32"
            fontSize="50px"
            fontWeight="500"
            lineHeight="54px"
            letterSpacing="-0.8px"
            fontFamily="Ubuntu"
          >R$ {priceValue}</Text>
          <Text
            position="relative"
            top="16px"
            right="-4px"
            color="#252A32"
            fontSize="18px"
            fontWeight="700"
            lineHeight="22px"
            letterSpacing="0.3px"
            fontFamily="Ubuntu"
          >/mês</Text>
        </Box>
        
        <Box
          display={isMobileMod() && !personConfig.text ? "none" :"flex"}
          flexDirection="row"
          justifyContent="space-between"
        >
          {personConfig.text &&
          <>
            <Text
              color="#252A32"
              fontFamily="ubuntu"
              fontSize="14px"
              fontStyle="normal"
              fontWeight="400"
              lineHeight="20px"
              letterSpacing="0.3px"
              textAlign="initial"
            >
              {personConfig.text}
            </Text>

            <Box
              display="flex"
              flexDirection="row"
              border="1px solid #DEDFE0"
              overflow="hidden"
              borderRadius="12px"
              height="40px"
            >
              <Button
                width="40px"
                height="100%"
                backgroundColor="#FFF"
                borderRadius="0"
                borderRight="1px solid #DEDFE0"
                _hover={{backgroundColor: "#FFF", opacity: "0.6", color: "#42B0FF"}}
                fontFamily="Ubuntu"
                onClick={() => addRemovePersonPrice("remove")}
                isDisabled={nubmerOfPerson === 2}
                >–</Button>
              <Text
                width="50px"
                height="100%"
                color="#252A32"
                fontFamily="Lato"
                fontSize="16px"
                fontStyle="normal"
                fontWeight="400"
                lineHeight="24px"
                letterSpacing="0.5px"
                padding="7px 20px 9px"
              >{nubmerOfPerson - personConfig.person}</Text>
              <Button
                width="40px"
                height="100%"
                backgroundColor="#FFF"
                borderRadius="0"
                borderLeft="1px solid #DEDFE0"
                _hover={{backgroundColor: "#FFF", opacity: "0.6", fill:"#42B0FF"}}
                fontFamily="Ubuntu"
                onClick={() => addRemovePersonPrice("add")}
                isDisabled={nubmerOfPerson === 5}
                ><CrossIcon height="14px" width="14px" transform="rotate(45deg)"/></Button>
            </Box>
          </>
          }
        </Box>
      </Box>

      <Box
        flex={1}
        textAlign="start"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Box>
          <Text
            color="#6F6F6F"
            fontSize="14px"
            fontWeight="400"
            lineHeight="27px"
            letterSpacing="0.3px"
            fontFamily="Ubuntu"
            marginBottom="16px"
          >
            {textResource}
          </Text>

          {resources.map((elm, i) => {
            return (
              <Box
                key={i}
                display="flex"
                marginBottom="8px"
                flexDirection="row"
                alignItems="center"
                gap="8px"
                _last={{marginBottom:"24px"}}
              >
                <CheckIcon 
                  width="24px"
                  height="24px"
                  fill="#2B8C4D"
                />
                <BodyText
                  fontSize="16px"
                  lineHeight="22px"
                  letterSpacing="0.2px"
                  fontWeight="400"
                >
                  {elm.name}
                </BodyText>
                {elm.tooltip &&
                  <Tooltip
                    hasArrow
                    placement="top"
                    bg="#2A2F38"
                    label={elm.tooltip}
                    fontSize="14px"
                    fontWeight="400"
                    padding="5px 16px 6px"
                    letterSpacing="0.5px"
                    lineHeight="24px"
                    color="#FFF"
                    borderRadius="6px"
                  >
                    <InfoIcon width="14px" height="14px" alt="tip" cursor="pointer" fill="#A3A3A3"/>
                  </Tooltip>
                }
              </Box>
            )
          })}
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          gap="16px"
        >
          {button.isCurrentPlan ?
            <Text
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="100%"
              height="40px"
              textAlign="center"
              color="#7D7D7D"
              cursor="default"
              fontWeight="400"
              fontFamily="Ubuntu"
            >
              {button.text}
            </Text>
          :
            <RoundedButton
              width="100%"              
              color={button.colorText || "#FFF"}
              backgroundColor={button.color || "#42B0FF"}
              onClick={() => {
                if(button.onClick) return button.onClick()
                return window.open(button.href, "_self")
              }}
              border={button.color && `1px solid ${button.colorText}`}
              {...button.styles}
            >
              {button.text}
            </RoundedButton>
          }

          <Text 
            display="flex"
            flexDirection="row"
            justifyContent="center"
            color="#252A32"
            fontSize="14px"
            fontWeight="400"
            lineHeight="27px"
            letterSpacing="0.3px"
            fontFamily="Ubuntu"
            height="20px"
            textAlign="center"
          >Leia os
            <Link
              fontFamily="ubuntu"
              color="#42B0FF"
              cursor="pointer"
              _hover={{opacity: 0.7}}
              marginLeft="6px"
              fontWeight="700"
              letterSpacing="0.5px"
              href="/termos-e-privacidade?section=terms"
              target="_blank"
            >Termos de Serviço</Link>
            .
          </Text>
        </Box>
      </Box>
    </Box>
  )
}

export default function Price({ username ,isBDPro, isBDEmp }) {
  return (
    <MainPageTemplate paddingX="24px">
      <Head>
        <title>Preços – Base dos Dados</title>
        <meta
          property="og:title"
          content="Preço – Base dos Dados"
          key="ogtitle"
        />
        <meta
          property="og:description"
          content="Compare os planos da Base dos Dados: Grátis, Pro e Empresas. Com a BD Pro você conta com recursos avançados da nossa plataforma, dados de alta frequência e conjuntos exclusivos a partir de R$47/mês."
          key="ogdesc"
        />
      </Head>

      <Stack
        gridGap={{base:"40px", lg: "64px"}}
        paddingTop="90px"
        width="100%"
        maxWidth="1264px"
        flexDirection="column"
        margin="auto"
        spacing={0}
      >
        <Display
          width="100%"
          fontSize="60px"
          textAlign="center"
          lineHeight="72px"
          letterSpacing="-1.5px"
        >
          Compare os planos
        </Display>

        <Stack
          display={isMobileMod() ? "flex" : "grid"}
          gridTemplateColumns="repeat(3, 320px)"
          gridTemplateRows="1fr"
          justifyContent="center"
          justifyItems="center"
          marginBottom="80px !important"
          gap="20px"
          spacing={0}
        >
          <CardPrice
            title="BD Grátis"
            subTitle={<BodyText>Para você descobrir o potencial da plataforma de dados</BodyText>}
            personConfig={{
              price: "0"
            }}
            textResource="Recursos:"
            resources={[
              {name: "Tabelas tratadas"},
              {name: "Dados integrados", tooltip: "Nossa metodologia de padronização e compatibilização de dados permite que você cruze tabelas de diferentes instituições e temas de maneira simplificada."},
              {name: "Acesso em nuvem"},
              {name: "Acesso via SQL, Python, R e Stata"},
              {name: "Integração com ferramentas BI"},
            ]}
            button={{
              text: "Explorar recursos",
              href: "/dataset",
              target: "_self",
              color: "#FFF",
              colorText: "#42B0FF"
            }}
          />

          <CardPrice
            title="BD Pro"
            subTitle={<BodyText>Para você ter acesso aos<br/> dados mais atualizados</BodyText>}
            personConfig={{
              price: "47"
            }}
            textResource="Todos os recursos da BD Grátis, mais:"
            resources={[
              {name: "Dezenas de bases de alta frequência atualizadas"},
            ]}
            button={{
              text: isBDPro ? "Plano atual" : `Iniciar teste grátis`,
              href: username === null ? "/user/login?p=plans&q=pro" :`/user/${username}?plans_and_payment&q=pro`,
              isCurrentPlan: isBDPro,
            }}
          />

          <CardPrice
            title="BD Empresas"
            subTitle={<BodyText>Para sua empresa ganhar tempo<br/> e qualidade em decisões</BodyText>}
            personConfig={{
              price: "350"
            }}
            textResource="Todos os recursos da BD Pro, mais:"
            resources={[
              {name: "Acesso para 10 contas"},{name: "Suporte prioritário via email e Discord"}
            ]}
            button={{
              text: isBDEmp ? "Plano atual" : "Iniciar teste grátis",
              href: username === null ? "/user/login?p=plans&q=empresas" :`/user/${username}?plans_and_payment&q=empresas`,
              isCurrentPlan: isBDEmp,
            }}
          />
        </Stack>
      </Stack>
    </MainPageTemplate>
)
}
