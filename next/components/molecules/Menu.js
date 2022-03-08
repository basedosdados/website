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
import RoundedButton from "../atoms/RoundedButton";
import Link from "../atoms/Link";
import { useContext, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import UserContext from "../../context/user";
import { MenuDropdown } from "./MenuDropdown";

function MenuDrawer({ isOpen, onClose, links }) {
  return (
    <Drawer isOpen={isOpen} placement="top" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent padding="30px 30px 30px 30px">
        <VStack alignItems="center" width="100%" spacing={5}>
          {Object.entries(links).map(([k, v]) => {
            if (typeof v === "object") {
              return Object.entries(v).map(([k, v]) => (
                <>
                  <Link href={v}>{k}</Link>
                  <Divider />
                </>
              ));
            }
            return (
              <>
                <Link href={v}>{k}</Link>
                <Divider />
              </>
            );
          })}
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
      gap="24px"
    >
      <HStack width="100%" flex="3" spacing={7}>
        {Object.entries(links).map(([k, v]) => {
          if (k === "Apoie")
            return (
              <a href={v} target="_blank">
                <RoundedButton
                  colorScheme="red"
                  backgroundColor="#FF8484"
                  minWidth="80px"
                  height="35px"
                  fontSize="14px"
                >
                  Apoie
                </RoundedButton>
              </a>
            );

          if (typeof v === "object") {
            return (
              <MenuDropdown
                title={k}
                marginLeft="-25px"
                marginTop="7px"
                minWidth="120px"
                borderColor="#DEDFE0"
                borderTopRadius="0"
                borderBottomRadius="10px"
                _first={{ paddingTop: "10px"}}
                _last={{ paddingBottom: "10px"}}
              >
                {Object.entries(v).map(([k, v]) => (
                  <Link
                    display="flex"
                    flexDirection="colunm"
                    _hover={{ opacity: "0.6" }}
                    fontSize="14px"
                    color="#252A32"
                    href={v}
                    padding="10px 24px"
                  >
                    {k}
                  </Link>
                ))}
              </MenuDropdown>
            );
          }

          return (
            <Link
              _hover={{ opacity: "0.6" }}
              fontSize="14px"
              href={v}
              target={v.startsWith("https") ? "_blank" : null}
            >
              {k}
            </Link>
          );
        })}
      </HStack>
      <HStack spacing={9} display={{ base: "none", lg: "flex" }}>
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
            <Link fontSize="14px" href="/user/login">
              Entrar
            </Link>
            <Link href="/user/register">
              <RoundedButton height="35px" fontSize="14px" minWidth="130px">
                Cadastrar
              </RoundedButton>
            </Link>
          </>
        )}
      </HStack>
    </HStack>
  );
}

export default function Menu({ pages = [] }) {
  const menuDisclosure = useDisclosure();
  const divRef = useRef();
  const userData = useContext(UserContext);

  const links = {
    Dados: "/dataset",
    Documentação: "https://basedosdados.github.io/mais/",
    Institucional: {
      "Quem Somos": "/blog/2/",
      Contato: "/blog/1/",
      Blog: "https://medium.com/basedosdados",
      Newsletter:
        "https://info.basedosdados.org/assine-newsletter",
    },
    Serviços: "/servicos",
    Apoie: "https://apoia.se/basedosdados",
  };

  useEffect(() => {
    document.addEventListener("scroll", () => {
      if (!divRef.current || !divRef.current.style) return;

      if (window.scrollY <= 30) divRef.current.style.boxShadow = "none";
      else
        divRef.current.style.boxShadow =
          "0px 2px 15px 1px rgba(64, 60, 67, 0.07)";
    });
  }, [divRef.current]);

  return (
    <>
      <MenuDrawer links={links} {...menuDisclosure} />
      <Box
        ref={divRef}
        position="fixed"
        top="0px"
        width="100%"
        left="0px"
        backgroundColor="#FFFFFF"
        padding="10px 30px"
        zIndex="999"
        transition="0.2s"
        as="nav"
      >
        <HStack
          justifyContent={{ base: "center", lg: "flex-start" }}
          width="100%"
          spacing={6}
        >
          <Box display={{ base: "flex", lg: "none" }}>
            <FontAwesomeIcon
              onClick={menuDisclosure.onOpen}
              style={{
                maxWidth: "20px",
                minWidth: "35px",
                minHeight: "35px",
                alignSelf: "flex-start",
                flex: 1,
                position: "fixed",
                left: 0,
                top: 0,
                margin: "15px 0 0 10px",
                color: "#252A32",
                cursor: "pointer",
              }}
              icon={faBars}
            />
          </Box>
          <Link href="/">
            <Box
              transform={{ base: "translateX(-20%)", lg: "translateX(0%)" }}
              width={{ base: "120px", lg: "100px" }}
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
