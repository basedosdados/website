import { Button } from "@chakra-ui/button";
import { Flex, VStack } from "@chakra-ui/layout";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import Head from "next/head";
import Title from "../atoms/Title";
import UserContext from "../../context/user";
import Icon from "@chakra-ui/icon";

export function BaseResourcePage({
  title,
  children,
  onClick,
  buttonText,
  buttonRightIcon = <></>,
  formComponent = null,
}) {
  const [editing, setEditing] = useState(false);
  const userData = useContext(UserContext);

  useEffect(() => {
    setEditing(false);
  }, [children]);

  return (
    <VStack
      width="100%"
      border="1px solid #DEDFE0"
      borderRadius="20px"
      padding="20px"
      alignItems="flex-start"
      spacing={7}
    >
      <Flex
        flexDirection={{ base: "column", lg: "row" }}
        width="100%"
        alignItems={{ base: "flex-start", lg: "flex-start" }}
      >
        <Title wordBreak="break-all">
          {(editing ? "Editando " : "") + title}
        </Title>
        {userData?.is_admin && formComponent && !editing ? (
          <Button
            marginLeft={{ base: null, lg: "auto" }}
            colorScheme="blue"
            backgroundColor="#3AA1EB"
            marginTop={{ base: "20px", lg: "0px" }}
            height="35px"
            onClick={() => setEditing(true)}
            borderRadius="13px"
            fontFamily="Lato"
            alignContent="center"
            justifyContent="center"
            letterSpacing="0.1em"
            boxShadow="0px 4px 4px 0px #00000040"
            leftIcon={
              <Icon>
                <FontAwesomeIcon size="lg" icon={faPen} />
              </Icon>
            }
          >
            Editar
          </Button>
        ) : (
          <></>
        )}
      </Flex>
      {editing ? formComponent : children}
      {editing ? (
        <Head>
          <link
            rel="stylesheet"
            href="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"
            integrity="sha384-HSMxcRTRxnN+Bdg0JdbxYKrThecOKuH5zCYotlSAcp1+c8xmyTe9GYg1l9a69psu"
            crossorigin="anonymous"
          />
        </Head>
      ) : (
        <></>
      )}
    </VStack>
  );
}
