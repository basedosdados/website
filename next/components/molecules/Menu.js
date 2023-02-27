import {
  Box,
  HStack,
  VStack,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  Avatar,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useBoolean
} from "@chakra-ui/react";
import { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router"
import UserContext from "../../context/user";
import { MenuDropdown } from "./MenuDropdown";
import ControlledInput from "../atoms/ControlledInput";
import Link from "../atoms/Link";
import RoundedButton from "../atoms/RoundedButton";

import BDLogoImage from "../../public/img/logos/bd_logo";
import FarBarsIcon from "../../public/img/icons/farBarsIcon";
import SearchIcon from "../../public/img/icons/searchIcon";
import CrossIcon from "../../public/img/icons/crossIcon";
import RedirectIcon from "../../public/img/icons/redirectIcon";

function MenuDrawer({ isOpen, onClose, links }) {
  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay backdropFilter="blur(2px)"/>
      <DrawerContent padding="24px">
        <BDLogoImage
          widthImage="65px"
          heightImage="30px"
          marginBottom="24px"
          onClick={() => window.open("/", "_self")}
        />
        <VStack alignItems="flex-start" width="100%" spacing="16px">
          {Object.entries(links).map(([key, elm]) => {
            if (typeof elm === "object") {
              return (
                <Accordion key={key} allowToggle width="100%">
                  <AccordionItem borderWidth="0 !important">
                    <AccordionButton
                      padding={0}
                      _hover={{background: "none"}}
                      justifyContent="space-between"
                    >
                      <Text
                        fontSize="20px"
                        fontFamily="Ubuntu"
                        fontWeight="400"
                        color="#252A32"
                      >
                        {key}
                      </Text>
                      <AccordionIcon />
                    </AccordionButton>
                  <AccordionPanel
                    display="flex"
                    flexDirection="column"
                    gridGap="13px"
                    padding="16px 0 2px"
                  >
                    {Object.entries(elm).map(([route, link]) => (
                      <Link
                        key={route}
                        fontSize="16px"
                        fontFamily="Ubuntu"
                        fontWeight="300"
                        href={link}
                      >{route}</Link>
                    ))}
                  </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              )
            } else {
              if(key === "Apoie") {
                return (
                  <RoundedButton
                    key={key}
                    backgroundColor="#FF8484"
                    minWidth="100px"
                    height="38px"
                    fontSize="20px"
                    onClick={() => window.open(elm, "_blank")}
                  >
                    {key}
                  </RoundedButton>
                )
              } else {
                return (
                  <Link
                    key={key}
                    fontSize="20px"
                    fontFamily="Ubuntu"
                    fontWeight="400"
                    href={elm}
                  >{key}
                  </Link>
                )
              }
            }
          })}
        </VStack>
      </DrawerContent>
    </Drawer>
  );
}

function SearchInput ({ status }) {
  const router = useRouter()
  const { query } = router
  const [showSearchInput, setShowSearchInput] = useState(false)

  const [showSearch, setShowSearch] = useState(false)
  const [search, setSearch] = useState("")

  const searchStatus = () => {
    const newStatus = !showSearch
    setShowSearch(newStatus)
    status({
      status: newStatus
    })
  }

  useEffect(() => {
    if(query.dataset) return setShowSearchInput(true)
  },[query])

  function openSearchLink() {
    window.open(`/dataset?q=${search}`, "_self")
  }

  if(!showSearchInput) return null
  
  return (
    <>
      {!showSearch ? 
        <SearchIcon
          alt="pesquisar"
          fill="#404245"
          width="18px"
          height="18px"
          marginRight="14px !important"
          cursor="pointer"
          _hover={{opacity:"0.8"}}
          onClick={searchStatus}
        />
      :
        <ControlledInput
          flex={2}
          maxWidth="360px"
          value={search}
          onChange={setSearch}
          onEnterPress={openSearchLink}
          placeholder="Pesquise dados"
          alignSelf="center"
          marginLeft="20px !important"
          justifyContent="center"
          marginRight="10px"
          inputStyle={{
            height: "40px",
            fontSize: "16px",
            width: "100%",
            borderRadius: "16px",
            _placeholder:{color: "#6F6F6F"}
          }}
          rightIcon={
            <CrossIcon
              alt="fecha pesquisa"
              fill="#404245"
              width="24px"
              height="24px"
              cursor="pointer"
              _hover={{opacity:"0.8"}}
              onClick={searchStatus}
            />
          }
        />
      }
    </>
  )
}

function DesktopLinks({ links }) {
  const userData = useContext(UserContext)
  const [statusSearch, setStatusSearch] = useState(false)

  const searchStatus = (elm) => {
    setStatusSearch(elm.status)
  }

  const LinkMenuDropDown = ({ url, text }) => {
    const [flag, setFlag] = useBoolean()

    return (
      <Link
        display="flex"
        flexDirection="colunm"
        _hover={{ opacity: "0.6" }}
        fontSize="14px"
        target={url.slice(0,4) === "http" ? "_blank" : "_self"}
        color="#252A32"
        fontFamily="Ubuntu"
        fontWeight="400"
        letterSpacing="0.3px"
        href={url}
        padding="10px 24px"
        alignItems="center"
        justifyContent="space-between"
        onMouseEnter={setFlag.on}
        onMouseLeave={setFlag.off}
      > 
        {text}
        {flag && url.slice(0,4) === "http" && <RedirectIcon marginLeft="8px" width="16px" height="16px"/>}
      </Link>
    )
  }

  return (
    <HStack
      justifyContent="space-between"
      width="100%"
      display={{ base: "none", lg: "flex" }}
      position={{ base: "relative", lg: "initial" }}
      gap="24px"
      marginLeft="32px !important"
    >
      <HStack width="100%" flex="3" spacing={7}>
        {Object.entries(links).map(([k, v]) => {
          if (k === "Apoie")
            return (
              <a key={k} href={v} target="_blank">
                <RoundedButton
                  colorScheme="red"
                  backgroundColor="#FF8484"
                  minWidth="80px"
                  height="35px"
                  fontSize="15px"
                >
                  Apoie
                </RoundedButton>
              </a>
            );

          if (typeof v === "object") {
            return (
              <MenuDropdown
                key={k}
                title={k}
                marginLeft="-25px"
                marginTop="10px"
                minWidth="202px"
                borderColor="#FFF"
                fontFamily="Ubuntu"
                fontWeight="400"
                letterSpacing="0.3px"
                borderRadius="10px"
                _first={{ paddingTop: "10px"}}
                _last={{ paddingBottom: "10px"}}
                boxShadow= "0 1px 8px 1px rgba(64, 60, 67, 0.16)"
              >
                {Object.entries(v).map(([k, v]) => (
                  <LinkMenuDropDown
                    key={k}
                    url={v}
                    text={k}
                  />
                ))}
              </MenuDropdown>
            )
          }

          return (
            <Link
              key={k}
              _hover={{ opacity: "0.6" }}
              fontSize="15px"
              fontFamily="Ubuntu"
              fontWeight="400"
              letterSpacing="0.3px"
              href={v}
              target={v.startsWith("https") ? "_blank" : null}
            >
              {k}
            </Link>
          );
        })}
      </HStack>

      <SearchInput status={searchStatus}/>

      {!statusSearch &&
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
              <Link fontSize="15px" fontFamily="Ubuntu" fontWeight="400" letterSpacing="0.3px" href="/user/login">
                Entrar
              </Link>
              <Link _hover={{ opacity:"none" }} href="/user/register">
                <RoundedButton height="35px" fontSize="15px" minWidth="110px">
                  Cadastrar
                </RoundedButton>
              </Link>
            </>
          )}
        </HStack>
      }
    </HStack>
  );
}

export default function Menu({ pages = [] }) {
  const [isShowLogoHome, setIsShowLogoHome] = useState(false)

  const router = useRouter()
  const { route } = router

  const menuDisclosure = useDisclosure();
  const divRef = useRef();
  const userData = useContext(UserContext);

  const links = {
    Dados: "/dataset",
    Tutoriais: {
      Documentação: "https://basedosdados.github.io/mais/",
      "Vídeos no YouTube": "https://www.youtube.com/c/BasedosDados/featured",
      Blog: "https://medium.com/basedosdados",
    },
    Serviços: {
      "Conheça os serviços" : "/servicos",
      "Estudos de caso" : "/estudos-de-caso"
    },
    Institucional: {
      "Quem somos": "/quem-somos",
      Transparência: "/transparencia",
      Newsletter: "https://info.basedosdados.org/newsletter",
      Carreiras: "https://info.basedosdados.org/carreiras",
      "Perguntas frequentes": "/perguntas-frequentes",
    },
    Contato: "/contato",
    Apoie: "https://apoia.se/basedosdados",
  };

  useEffect(() => {
    document.addEventListener("scroll", () => {
      if (window.scrollY >= 425) setIsShowLogoHome(true)
      if (window.scrollY <= 425) setIsShowLogoHome(false)

      if (!divRef.current || !divRef.current.style) return;
      if (window.scrollY <= 30) divRef.current.style.boxShadow = "none";
      else
        divRef.current.style.boxShadow =
          "0px 1px 8px 1px rgba(64, 60, 67, 0.16)";
    });
  }, [divRef.current])

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
        padding="16px 28px"
        zIndex="999"
        transition="0.2s"
        as="nav"
      >
        <HStack
          justifyContent={{ base: "center", lg: "flex-start" }}
          width="100%"
          height="40px"
          maxWidth="1264px"
          margin="0 auto"
          spacing={6}
        >
          <Box display={{ base: "flex", lg: "none" }}>
            <FarBarsIcon
              alt="menu de navegação"
              position="fixed"
              top="0"
              left="0"
              margin="20px 0 0 20px"
              width="30px"
              height="30px"
              onClick={menuDisclosure.onOpen}
              fill="#616161"
              cursor="pointer"
            />
          </Box>

          <Link
            aria-label="Home"
            width={route === "/" ? isShowLogoHome ? "88px" :"0" : "88px"}
            _hover={{opacity:"none"}}
            href={route === "/" ? "/#home" : "/"}
            marginLeft="0 !important"
            transition="all 0.5s"
            overflow="hidden"
          >
            <BDLogoImage
              widthImage="80px"
            />
          </Link>

          <Avatar
            bg="#2B8C4D"
            position="fixed"
            right="24px"
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
