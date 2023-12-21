import {
  Stack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { activeAccount } from "../api/user";

import Display from "../../components/atoms/Display";
import { isMobileMod } from "../../hooks/useCheckMobile.hook"
import { MainPageTemplate } from "../../components/templates/main";

import { EmailConfirmImage, EmailRecoveryImage } from "../../public/img/emailImage";

export async function getServerSideProps(context) {
  const { query } = context

  const result = await activeAccount(query.q, query.p)
  const data = result?.status || ""

  return {
    props: {
      data
    }
  }
}

export default function ActiveAccount({ data }) {
  return (
    <MainPageTemplate display="flex" justifyContent="center" cleanTemplate>
      <Stack
        display="flex"
        justifyContent="center"
        width="510px"
        height="100%"
        marginTop={isMobileMod() ? "150px" : "50px"}
        marginX="27px"
        spacing="40px"
        alignItems="center"
      >
        {data === 200 ?
          <EmailConfirmImage justifyContent="center" marginBottom="8px"/>
        :
          <EmailRecoveryImage justifyContent="center" marginBottom="8px"/>
        }

        {data === 200 ?
          <Display
            fontSize={isMobileMod() ? "28px" : "34px"}
            lineHeight={isMobileMod() ? "36px" : "44px"}
            letterSpacing={isMobileMod() ? "0" : "-0.4px"}
            fontWeith="500"
            textAlign="center"
          >Conta ativa</Display>
        :
          <Display
            fontSize={isMobileMod() ? "28px" : "34px"}
            lineHeight={isMobileMod() ? "36px" : "44px"}
            letterSpacing={isMobileMod() ? "0" : "-0.4px"}
            fontWeith="500"
            textAlign="center"
          >Algo deu errado</Display>
        }
      </Stack>
    </MainPageTemplate>
  )
}