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
import RoundedButton from "../atoms/RoundedButton";
import Link from "../atoms/Link";
import { useContext, useEffect, useRef, useState } from "react";
import FarBarsIcon from "../../public/img/icons/farBarsIcon";
import UserContext from "../../context/user";
import { MenuDropdown } from "./MenuDropdown";
import BDLogoImage from "../../public/img/logos/bd_logo";

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
                  <Link fontFamily="Ubuntu" fontWeigth="400" href={v}>{k}</Link>
                  <Divider />
                </>
              ));
            }
            return (
              <>
                <Link fontFamily="Ubuntu" fontWeigth="400" href={v}>{k}</Link>
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
                marginTop="10px"
                minWidth="180px"
                borderColor="#FFF"
                fontFamily="Ubuntu"
                fontWeigth="400"
                letterSpacing="0.3px"
                borderRadius="10px"
                _first={{ paddingTop: "10px"}}
                _last={{ paddingBottom: "10px"}}
                boxShadow= "0 1px 8px 1px rgba(64, 60, 67, 0.16)"
              >
                {Object.entries(v).map(([k, v]) => (
                  <Link
                    display="flex"
                    flexDirection="colunm"
                    _hover={{ opacity: "0.6" }}
                    fontSize="14px"
                    target={k === "Transparência" ? null : "_blank"}
                    color="#252A32"
                    fontFamily="Ubuntu"
                    fontWeigth="400"
                    letterSpacing="0.3px"
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
              fontFamily="Ubuntu"
              fontWeigth="400"
              letterSpacing="0.3px"
              href={v}
              target={v.startsWith("https") ? "_blank" : null}
            >
              {k}
            </Link>
          );
        })}
      </HStack>
      <HStack spacing={8} display={{ base: "none", lg: "flex" }}>
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
            <Link fontSize="14px" fontFamily="Ubuntu" fontWeigth="400" letterSpacing="0.3px" href="/user/login">
              Entrar
            </Link>
            <Link _hover={{ opacity:"none" }} href="/user/register">
              <RoundedButton height="35px" fontSize="14px" minWidth="110px">
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
    Tutoriais: {
      Documentação: "https://basedosdados.github.io/mais/",
      Blog: "https://medium.com/basedosdados",
      YouTube: "https://www.youtube.com/c/BasedosDados/featured"
    },
    Serviços: "/servicos",
    Institucional: {
      Newsletter: "https://info.basedosdados.org/newsletter",
      Transparência: "/transparencia",
      Carreiras: "https://info.basedosdados.org/carreiras"
    },
    "Quem somos": "/quem-somos",
    Contato: "/contato",
    Apoie: "https://apoia.se/basedosdados",
  };

  useEffect(() => {
    document.addEventListener("scroll", () => {
      if (!divRef.current || !divRef.current.style) return;

      if (window.scrollY <= 30) divRef.current.style.boxShadow = "none";
      else
        divRef.current.style.boxShadow =
          "0px 1px 8px 1px rgba(64, 60, 67, 0.16)";
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
        padding="16px 30px"
        zIndex="999"
        transition="0.2s"
        as="nav"
      >
        <HStack
          justifyContent={{ base: "center", lg: "flex-start" }}
          width="100%"
          maxWidth="1264px"
          margin="0 auto"
          spacing={6}
        >
          <Box display={{ base: "flex", lg: "none" }}>
            <FarBarsIcon
              position="fixed"
              top="0"
              left="0"
              margin="20px 0 0 20px"
              widthIcon="30px"
              heightIcon="30px"
              onClick={menuDisclosure.onOpen}
              fill="#616161"
              cursor="pointer"
            />
          </Box>
          <Link _hover={{opacity:"none"}} href="/">
            <BDLogoImage
              transform="translateX(-27%)"
              height="40px"
              widthImage="80px"
            />
          </Link>
          <Avatar
            bg="#2B8C4D"
            position="fixed"
            right="30px"
            height="40px"
            width="40px"
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
