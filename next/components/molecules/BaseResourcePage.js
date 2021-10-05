import { Button } from "@chakra-ui/button";
import { Flex, HStack, VStack } from "@chakra-ui/layout";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import Head from "next/head";
import Title from "../atoms/Title";
import UserContext from "../../context/user";
import Icon from "@chakra-ui/icon";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
} from "@chakra-ui/modal";
import { useDisclosure } from "@chakra-ui/hooks";

export function BaseResourcePage({
  title,
  children,
  removeFunction,
  formComponent = null,
  forceForm = false,
}) {
  const [editing, setEditing] = useState(false);
  const deleteModalDisclosure = useDisclosure();
  const userData = useContext(UserContext);

  useEffect(() => {
    if (forceForm) return setEditing(true);
    setEditing(false);
  }, [children, forceForm]);

  return (
    <VStack
      width="100%"
      border="1px solid #DEDFE0"
      borderRadius="20px"
      padding="20px"
      alignItems="flex-start"
      spacing={7}
    >
      <AlertDialog
        isOpen={deleteModalDisclosure.isOpen}
        onClose={deleteModalDisclosure.onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Deletar este objeto?
            </AlertDialogHeader>

            <AlertDialogBody>
              Uma vez deletado este objeto não poderá ser restaurado.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={deleteModalDisclosure.onClose}>Cancelar</Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  removeFunction();
                  window.location.reload();
                }}
                ml={3}
              >
                Deletar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <Flex
        flexDirection={{ base: "column", lg: "row" }}
        width="100%"
        alignItems={{ base: "flex-start", lg: "flex-start" }}
      >
        <Title width="100%" wordBreak="break-all">
          {(editing ? "Editando " : "") + title}
        </Title>
        {userData?.is_admin && formComponent && !editing ? (
          <HStack width="80%" justify="center" alignContent="flex-end">
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
            <Button
              marginLeft={{ base: null, lg: "auto" }}
              colorScheme="red"
              marginTop={{ base: "20px", lg: "0px" }}
              height="35px"
              onClick={deleteModalDisclosure.onOpen}
              borderRadius="13px"
              fontFamily="Lato"
              alignContent="center"
              justifyContent="center"
              letterSpacing="0.1em"
              boxShadow="0px 4px 4px 0px #00000040"
              leftIcon={
                <Icon>
                  <FontAwesomeIcon size="lg" icon={faTrash} />
                </Icon>
              }
            >
              Remover
            </Button>
          </HStack>
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
