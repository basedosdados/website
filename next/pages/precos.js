import {
  Box,
  Stack,
  Text,
  Tooltip,
  Badge,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Head from "next/head";
import Toggle from "../components/atoms/Toggle";
import { MainPageTemplate } from "../components/templates/main";
import { isMobileMod } from "../hooks/useCheckMobile.hook";

import CheckIcon from "../public/img/icons/checkIcon";
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
  price,
  anualPlan = false,
  textResource,
  resources = [],
  button,
}) => {
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
          <Text
            fontFamily="Roboto"
            fontWeight="500"
            fontSize="28px"
            lineHeight="42px"
            textAlign="center"
            color="#252A32"
          >
            {title}
          </Text>
        </Box>

        <Text
          fontFamily="Roboto"
          fontWeight="400"
          fontSize="18px"
          lineHeight="28px"
          textAlign="center"
          color="#71757A"
          marginBottom="24px"
        >
          {subTitle}
        </Text>

        <Box
          justifyContent="center"
          display="flex"
          flexDirection="column"
          alignItems="center"
          marginBottom="40px"
        >
          <Box
            display="flex"
            flexDirection="row"
            height="50px"
            alignItems="center"
          >
            <Text
              color="#252A32"
              fontSize="50px"
              fontWeight="500"
              lineHeight="60px"
              fontFamily="Roboto"
              textAlign="center"
            >R$ {price}</Text>
            <Text
              position="relative"
              top="16px"
              right="-4px"
              color="#252A32"
              fontSize="18px"
              fontWeight="500"
              lineHeight="28px"
              fontFamily="Roboto"
              textAlign="center"
            >/mês</Text>
          </Box>

          {anualPlan && 
            <Text
              fontFamily="Roboto"
              fontWeight="400"
              fontSize="16px"
              lineHeight="24px"
              color="#464A51"
              marginTop="24px"
              alignItems="center"
            >{(price*12).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })} cobrado uma vez no ano</Text>
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
        <Box marginBottom="24px">
          <Text
            color="#71757A"
            fontSize="16px"
            fontWeight="400"
            lineHeight="24px"
            fontFamily="Roboto"
            alignItems="center"
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
                <Text
                  fontFamily="Roboto"
                  fontSize="16px"
                  lineHeight="24px"
                  fontWeight="400"
                  alignItems="center"
                  color="#464A51"
                >
                  {elm.name}
                </Text>
                {elm.tooltip &&
                  <Tooltip
                    label={elm.tooltip}
                    hasArrow
                    placement="top"
                    padding="16px"
                    backgroundColor="#252A32"
                    boxSizing="border-box"
                    borderRadius="8px"
                    fontFamily="Roboto"
                    fontWeight="400"
                    fontSize="14px"
                    lineHeight="20px"
                    textAlign="center"
                    color="#FFFFFF"
                    maxWidth="230px"
                  >
                    <InfoIcon width="14px" height="14px" alt="tip" cursor="pointer" fill="#878A8E"/>
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
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="100%"
              height="40px"
              textAlign="center"
              color="#7D7D7D"
              cursor="default"
              fontWeight="400"
              fontFamily="Roboto"
            >
              {button.text}
            </Box>
          :
            <Box
              as="button"
              onClick={() => {
                if(button.onClick) return button.onClick()
                return window.open(button.href, "_self")
              }}
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="100%"
              borderRadius="8px"
              backgroundColor="#0D99FC"
              padding="12px 16px"
              cursor="pointer"
              color="#FFF"
              fontFamily="Roboto"
              fontWeight="500"
              fontSize="20px"
              lineHeight="30px"
              _hover={{
                backgroundColor: "#0B89E2"
              }}
            >
              {button.text}
            </Box>
          }

          <Text 
            display="flex"
            flexDirection="row"
            justifyContent="center"
            textAlign="center"
            color="#71757A"
            fontWeight="400"
            fontSize="16px"
            lineHeight="24px"
            fontFamily="Roboto"
            height="20px"
          >Leia os
            <Text
              as="a"
              cursor="pointer"
              marginLeft="4px"
              href="/termos-e-privacidade?section=terms"
              target="_blank"
              alignItems="center"
              color="#0D99FC"
              _hover={{
                color: "#0B89E2"
              }}
            >Termos de Serviço</Text>
            .
          </Text>
        </Box>
      </Box>
    </Box>
  )
}

export default function Price({ username ,isBDPro, isBDEmp }) {
  const [toggleAnual, setToggleAnual] = useState(false)
  const [priceBDPro, setPriceBDPro] = useState("47")
  const [priceBDEmp, setPriceBDEmp] = useState("350")

  useEffect(() => {
    if(toggleAnual === true) {
      setPriceBDPro("37")
      setPriceBDEmp("280")
    } else {
      setPriceBDPro("47")
      setPriceBDEmp("350")
    }
  }, [toggleAnual])

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
        gridGap="40px"
        paddingTop="90px"
        width="100%"
        maxWidth="1264px"
        flexDirection="column"
        margin="auto"
        spacing={0}
      >
        <Text
          width="100%"
          fontFamily="Roboto"
          fontWeight="500"
          color="#252A32"
          fontSize="60px"
          textAlign="center"
          lineHeight="70px"
        >
          Compare os planos
        </Text>

        <Box
          display="none"
          width="100%"
          flexDirection="row"
          justifyContent="center"
          alignitems="center"
          gap="8px"
        >
          <Toggle
            value={toggleAnual}
            onChange={() => setToggleAnual(!toggleAnual)}
          />
          <Text
            gap="8px"
            fontFamily="Ubuntu"
            fontWeight="400"
            fontSize="18px"
            lineHeight="24px"
            display="flex"
            alignItems="center"
            textAlign="center"
            letterSpacing="0.1px"
            color="#252A32"
          >
            Desconto anual <Text color="#2B8C4D">Economize 20%</Text>
          </Text>
        </Box>

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
            subTitle={<>Para você descobrir o potencial da plataforma de dados</>}
            price={"0"}
            textResource="Recursos:"
            resources={[
              {name: "Tabelas tratadas"},
              {name: "Dados integrados", tooltip: "Nossa metodologia de padronização e compatibilização de dados permite que você cruze tabelas de diferentes instituições e temas de maneira simplificada."},
              {name: "Acesso em nuvem"},
              {name: "Acesso via SQL, Python e R"},
              {name: "Integração com ferramentas BI"},
              {name: "Download direto até 100 MB", tooltip: "Esse limite não se aplica ao acesso via SQL, Python e R."},
            ]}
            button={{
              text: "Explorar recursos",
              href: "/dataset",
            }}
          />

          <CardPrice
            title="BD Pro"
            subTitle={<>Para você ter acesso aos<br/> dados mais atualizados</>}
            price={priceBDPro}
            anualPlan={toggleAnual}
            textResource="Todos os recursos da BD Grátis, mais:"
            resources={[
              {name: "Dezenas de bases de alta frequência atualizadas"},
              {name: "Download direto até 1GB (80% das tabelas da plataforma)", tooltip: "Tabelas maiores que 5 GB não estão disponíveis para download parcial ou completo. Esse limite não se aplica ao acesso via SQL, Python e R."}
            ]}
            button={{
              text: isBDPro ? "Plano atual" : `Iniciar teste grátis`,
              href: username === null ? "/user/login?p=plans&q=pro" :`/user/${username}?plans_and_payment&q=pro`,
              isCurrentPlan: isBDPro,
            }}
          />

          <CardPrice
            title="BD Empresas"
            subTitle={<>Para sua empresa ganhar tempo<br/> e qualidade em decisões</>}
            price={priceBDEmp}
            anualPlan={toggleAnual}
            textResource="Todos os recursos da BD Pro, mais:"
            resources={[
              {name: "Acesso para 10 contas"},
              {name: "Suporte prioritário via email e Discord"}
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
