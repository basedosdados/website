import {
  Box,
  HStack,
  VStack,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  Divider,
  Avatar,
} from "@chakra-ui/react";
import Image from "next/image";
import ControlledInput from "../atoms/ControlledInput";
import RoundedButton from "../atoms/RoundedButton";
import Link from "../atoms/Link";
import { useContext, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import UserContext from "../../context/user";

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
  const userData = useContext(UserContext);

  function openSearchLink() {
    window.open(`/dataset?q=${search}`, "_self");
  }

  return (
    <HStack
      justifyContent="space-between"
      width="100%"
      display={{ base: "none", lg: "flex" }}
      position={{ base: "relative", lg: "initial" }}
    >
      <HStack width="100%" flex="3" spacing={7}>
        {Object.entries(links).map(([k, v]) =>
          k === "Apoie" ? (
            <a href={v} target="_blank">
              <RoundedButton
                colorScheme="red"
                backgroundColor="#FF8484"
                minWidth="100px"
              >
                Apoie
              </RoundedButton>
            </a>
          ) : (
            <Link href={v} target={v.startsWith("https") ? "_blank" : null}>
              {k}
            </Link>
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
                src="/img/icon_search.png"
              />
            </Box>
          }
        />
        {userData ? (
          <HStack spacing={5}>
            <Avatar
              bg="#2B8C4D"
              name={userData?.fullname}
              src={userData.image_url}
            />
            <Link style={{ fontSize: "12px" }} href={`/user/${userData.name}`}>
              {userData.fullname}
            </Link>
          </HStack>
        ) : (
          <>
            <Link href="/user/login">Entrar</Link>
            <Link href="/user/register">
              <RoundedButton minWidth="150px">Cadastrar</RoundedButton>
            </Link>
          </>
        )}
      </HStack>
    </HStack>
  );
}

export default function Menu({ strapiPages = [] }) {
  const menuDisclosure = useDisclosure();
  const divRef = useRef();
  const userData = useContext(UserContext);

  const links = {
    Dados: "/dataset",
  };

  useEffect(() => {
    document.addEventListener("scroll", () => {
      if (!divRef.current || !divRef.current.style) return;

      if (window.scrollY <= 30) divRef.current.style.boxShadow = "none";
      else divRef.current.style.boxShadow = "0px 4px 4px rgba(0,0,0,0.25)";
    });
  }, [divRef.current]);

  links["Documentação"] = "https://basedosdados.github.io/mais/";

  strapiPages.map((p) => {
    links[p.MenuTitle] = "/blog/" + p.id + "/";
  });

  links["Newsletter"] =
    "https://basedosdados.hubspotpagebuilder.com/assine-a-newsletter-da-base-dos-dados";
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
          justifyContent={{ base: "center", lg: "flex-start" }}
          width="100%"
          spacing={10}
        >
          <Box display={{ base: "flex", lg: "none" }}>
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
          <Link href="/">
            <Box
              transform={{ base: "translateX(-20%)", lg: "translateX(0%)" }}
              width={{ base: "120px", lg: "105px" }}
              height="50px"
              position="relative"
            >
              <Image
                loading="eager"
                priority
                layout="fill"
                objectFit="contain"
                src="/img/logo.png"
              />
            </Box>
          </Link>
          <Avatar
            bg="#2B8C4D"
            position="fixed"
            right="30px"
            display={{ base: "flex", lg: "none" }}
            src={userData?.image_url}
            name={userData?.fullname}
          />
          <DesktopLinks links={links} />
        </HStack>
      </Box>
    </>
  );
}
