import {
  Box,
  HStack,
  VStack,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  Divider,
} from "@chakra-ui/react";
import Image from "next/image";
import ControlledInput from "../atoms/ControlledInput";
import RoundedButton from "../atoms/RoundedButton";
import Link from "../atoms/Link";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

function MenuDrawer({ isOpen, onClose, links }) {
  return (
    <Drawer zIndex="10px" isOpen={isOpen} placement="top" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent padding="110px 30px 30px 30px">
        <VStack alignItems="center" width="100%" spacing={5}>
          {Object.entries(links).map(([k, v]) => (
            <>
              <Link color="black" href={v}>
                {k}
              </Link>
              <Divider />
            </>
          ))}
        </VStack>
      </DrawerContent>
    </Drawer>
  );
}

function DesktopLinks({ links }) {
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
        {Object.entries(links).map(([k, v]) => (
          <Link color="white" href={v}>
            {k}
          </Link>
        ))}
      </HStack>
      <HStack spacing={10} display={{ base: "none", lg: "flex" }}>
        <ControlledInput
          onEnterPress={openSearchLink}
          color="black"
          value={search}
          onChange={setSearch}
          inputBackgroundColor="#E6FEE2"
          rightIcon={
            <Box width="60px" height="60px" position="relative">
              <Image
                cursor="pointer"
                onClick={openSearchLink}
                layout="fill"
                objectFit="contain"
                src="/_nxt/img/icon_search.png"
              />
            </Box>
          }
        />
        <Link>Entrar</Link>
        <RoundedButton>Cadastrar</RoundedButton>
      </HStack>
    </HStack>
  );
}

export default function Menu({ strapiPages = [] }) {
  const menuDisclosure = useDisclosure();

  const links = {
    Dados: "/_nxt/search",
  };

  strapiPages.map((p) => {
    links[p.MenuTitle] = "/_nxt/blog/" + p.id + "/";
  });

  links["APOIE"] = "";

  return (
    <>
      <MenuDrawer links={links} {...menuDisclosure} />
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
            <Box
              transform={{ base: "translateX(-27%)" }}
              width={{ base: "80px", lg: "105px" }}
              height="50px"
              position="relative"
            >
              <Image
                layout="fill"
                objectFit="contain"
                src="/_nxt/img/logo.png"
              />
            </Box>
          </Link>
          <DesktopLinks links={links} />
        </HStack>
      </Box>
    </>
  );
}
