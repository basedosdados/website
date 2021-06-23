import { Box, HStack, Image } from "@chakra-ui/react";
import ControlledInput from "../atoms/ControlledInput";
import RoundedButton from "../atoms/RoundedButton";
import Link from "../atoms/Link";
import { useState } from "react";

function DesktopLinks() {
  const [search, setSearch] = useState();

  function openSearchLink() {
    window.open(`/dataset/?q=${search}`, "_self");
  }

  return (
    <HStack
      justifyContent="space-between"
      width="100%"
      display={{ base: "none", md: "flex" }}
      position={{ base: "relative", md: "initial" }}
    >
      <HStack width="100%" flex="3" spacing={10}>
        <Link href="/dataset">Dados</Link>
        <Link>Comunidade</Link>
        <Link href="/about">Sobre</Link>
        <Link>Contato</Link>
        <Link>APOIE</Link>
      </HStack>
      <HStack spacing={10} display={{ base: "none", lg: "flex" }}>
        <ControlledInput
          onEnterPress={openSearchLink}
          color="white"
          value={search}
          onChange={setSearch}
          inputBackgroundColor="#E6FEE2"
          rightIcon={
            <Image
              cursor="pointer"
              onClick={openSearchLink}
              src="/next-img/icon_search.png"
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
  return (
    <Box
      position="fixed"
      top="0px"
      width="100%"
      left="0px"
      backgroundColor="#34A15A"
      boxShadow="0px 4px 4px rgba(0,0,0,0.25)"
      padding="15px 60px"
      zIndex="100"
      as="nav"
    >
      <HStack
        justifyContent={{ base: "center", md: "flex-start" }}
        width="100%"
        spacing={10}
      >
        <Image flex="2" maxWidth="105px" src="/next-img/logo.png" />
        <DesktopLinks />
      </HStack>
    </Box>
  );
}
