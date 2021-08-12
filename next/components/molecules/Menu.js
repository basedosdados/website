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
import { useEffect, useRef, useState } from "react";
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
              <Link href={v}>{k}</Link>
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
      <HStack width="100%" flex="3" spacing={7}>
        {Object.entries(links).map(([k, v]) =>
          k === "Apoie" ? (
            <a href={v} target="_blank">
              <RoundedButton
                colorScheme="red"
                backgroundColor="#FF8484"
                minWidth="100px"
                letterSpacing="0.1em"
              >
                Apoie
              </RoundedButton>
            </a>
          ) : (
            <Link href={v}>{k}</Link>
          )
        )}
      </HStack>
      <HStack spacing={10} display={{ base: "none", lg: "flex" }}>
        <ControlledInput
          onEnterPress={openSearchLink}
          color="black"
          value={search}
          onChange={setSearch}
          inputBackgroundColor="#FAFAFA"
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
        <Link href="/user/login">Entrar</Link>
        <Link href="/user/register">
          <RoundedButton minWidth="150px">Cadastrar</RoundedButton>
        </Link>
      </HStack>
    </HStack>
  );
}

export default function Menu({ strapiPages = [] }) {
  const menuDisclosure = useDisclosure();
  const divRef = useRef();

  const links = {
    Dados: "/_nxt/search",
  };

  useEffect(() => {
    document.addEventListener("scroll", () => {
      if (!divRef.current || !divRef.current.style) return;

      if (window.scrollY <= 30) divRef.current.style.boxShadow = "none";
      else divRef.current.style.boxShadow = "0px 4px 4px rgba(0,0,0,0.25)";
    });
  }, [divRef.current]);

  strapiPages.map((p) => {
    links[p.MenuTitle] = "/_nxt/blog/" + p.id + "/";
  });

  links["Newsletter"] =
    "https://basedosdados.hubspotpagebuilder.com/assine-a-newsletter-da-base-dos-dados";
  links["Documentação"] = "https://basedosdados.github.io/mais/";
  links["Apoie"] = "https://apoia.se/basedosdados";

  return (
    <>
      <MenuDrawer links={links} {...menuDisclosure} />
      <Box
        ref={divRef}
        position="fixed"
        top="0px"
        width="100%"
        left="0px"
        backgroundColor="#FAFAFA"
        padding="15px 30px"
        zIndex="10000000"
        transition="0.2s"
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
                top: 27,
                color: "black",
              }}
              icon={faBars}
            />
          </Box>
          <Link href="/_nxt/">
            <Box
              transform={{ base: "translateX(-20%)", lg: "translateX(0%)" }}
              width={{ base: "120px", lg: "105px" }}
              height="50px"
              position="relative"
            >
              <Image
                priority
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
