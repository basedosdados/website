import {
  Box,
  HStack,
  VStack,
  Image,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  Divider,
} from "@chakra-ui/react";
import ControlledInput from "../atoms/ControlledInput";
import RoundedButton from "../atoms/RoundedButton";
import Link from "../atoms/Link";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

function MenuDrawer({ isOpen, onClose }) {
  return (
    <Drawer zIndex="10px" isOpen={isOpen} placement="top" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent padding="110px 30px 30px 30px">
        <VStack alignItems="center" width="100%" spacing={5}>
          <Link color="black" href="/_nxt/search">
            Dados
          </Link>
          <Divider />
          <Link color="black">Comunidade</Link>
          <Divider />
          <Link color="black" href="/about">
            Sobre
          </Link>
          <Divider />
          <Link color="black">Contato</Link>
          <Divider />
          <Link color="black">APOIE</Link>
        </VStack>
      </DrawerContent>
    </Drawer>
  );
}

function DesktopLinks() {
  const [search, setSearch] = useState();

  function openSearchLink() {
    window.open(`/_nxt/search/?q=${search}`, "_self");
  }

  return (
    <HStack
      justifyContent="space-between"
      width="100%"
      display={{ base: "none", md: "flex" }}
      position={{ base: "relative", md: "initial" }}
    >
      <HStack width="100%" flex="3" spacing={10}>
        <Link href="/_nxt/search">Dados</Link>
        <Link>Comunidade</Link>
        <Link href="/about">Sobre</Link>
        <Link>Contato</Link>
        <Link>APOIE</Link>
      </HStack>
      <HStack spacing={10} display={{ base: "none", lg: "flex" }}>
        <ControlledInput
          onEnterPress={openSearchLink}
          color="black"
          value={search}
          onChange={setSearch}
          inputBackgroundColor="#E6FEE2"
          rightIcon={
            <Image
              cursor="pointer"
              onClick={openSearchLink}
              src="/_nxt/img/icon_search.png"
            />
          }
        />
        <Link>Entrar</Link>
        <RoundedButton>Cadastrar</RoundedButton>
      </HStack>
    </HStack>
  );
}

export default function Menu() {
  const menuDisclosure = useDisclosure();

  return (
    <>
      <MenuDrawer {...menuDisclosure} />
      <Box
        position="fixed"
        top="0px"
        width="100%"
        left="0px"
        backgroundColor="#34A25A"
        boxShadow="0px 4px 4px rgba(0,0,0,0.25)"
        padding="15px 60px"
        zIndex="10000000"
        as="nav"
      >
        <HStack
          justifyContent={{ base: "center", md: "flex-start" }}
          width="100%"
          spacing={10}
        >
          <Box display={{ base: "flex", md: "none" }}>
            <FontAwesomeIcon
              onClick={menuDisclosure.onOpen}
              style={{
                maxWidth: "20px",
                alignSelf: "flex-start",
                flex: 1,
                position: "fixed",
                left: 30,
                top: 23,
                color: "white",
              }}
              icon={faBars}
            />
          </Box>
          <Link href="/_nxt/">
            <Image
              flex="2"
              transform={{ base: "translateX(-27%)" }}
              maxWidth={{ base: "80px", lg: "105px" }}
              src="/_nxt/img/logo.png"
            />
          </Link>
          <DesktopLinks />
        </HStack>
      </Box>
    </>
  );
}
