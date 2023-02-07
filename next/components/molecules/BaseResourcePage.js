import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
} from "@chakra-ui/modal";
import {
  HStack,
  VStack,
  Flex,
  Button
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import Head from "next/head";
import { useContext, useEffect, useState } from "react";

import UserContext from "../../context/user";
import { isMobileMod } from "../../hooks/useCheckMobile.hook";

import Title from "../atoms/Title";
import RoundedButton from "../atoms/RoundedButton";

import PenIcon from "../../public/img/icons/penIcon";
import TrashIcon from "../../public/img/icons/trashIcon";

export default function BaseResourcePage({
  title,
  children,
  removeFunction,
  formComponent = null,
  forceForm = false,
  ...style
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
      position="relative"
      width="100%"
      borderRadius="20px"
      padding="20px"
      alignItems="flex-start"
      spacing={8}
      {...style}
    >
      {editing &&
        <Head>
          <link
            rel="stylesheet"
            href="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"
            integrity="sha384-HSMxcRTRxnN+Bdg0JdbxYKrThecOKuH5zCYotlSAcp1+c8xmyTe9GYg1l9a69psu"
            crossorigin="anonymous"
          />
        </Head>
      }
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
                onClick={async () => {
                  await removeFunction();
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
        <Title
          width="100%"
          wordBreak="break-all"
        >
          {(editing ? "Editando " : "") + title}
        </Title>
        {userData?.is_admin && formComponent && !editing &&
          <HStack
            width={isMobileMod() ? "100%" : "80%"}
            marginTop={isMobileMod() && "24px"}
            justifyContent={isMobileMod() ? "flex-start" : "flex-end"}
            alignContent="flex-end"
          >
            <RoundedButton
              onClick={() => setEditing(true)}
              minWidth="132px"
            >
              <PenIcon alt="" width="20px" height="20px" fill="#FFF" marginRight="8px"/>
              Editar
            </RoundedButton>

            <RoundedButton
              backgroundColor="#FF8484"
              onClick={deleteModalDisclosure.onOpen}
              minWidth="132px"
            >
              <TrashIcon alt="" width="20px" height="20px" fill="#FFF" marginRight="8px"/>
              Remover
            </RoundedButton>
          </HStack>
        }
      </Flex>
      {editing ? formComponent : children}
    </VStack>
  )
}
