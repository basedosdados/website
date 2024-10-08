import {
  Box,
  Stack,
  HStack,
  VStack,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useBoolean,
  Divider,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from "@chakra-ui/react";
import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/router"
import cookies from "js-cookie";
import MenuDropdown from "./MenuDropdown";
import { isMobileMod, useCheckMobile } from "../../hooks/useCheckMobile.hook"
import { ControlledInputSimple } from "../atoms/ControlledInput";
import Link from "../atoms/Link";
import RoundedButton from "../atoms/RoundedButton";
import HelpWidget from "../atoms/HelpWidget";
import { triggerGAEvent } from "../../utils";

import BDLogoProImage from "../../public/img/logos/bd_logo_pro";
import BDLogoEduImage from "../../public/img/logos/bd_logo_edu";
import BDLogoLabImage from "../../public/img/logos/bd_logo_lab";
import BDLogoImage from "../../public/img/logos/bd_logo";
import FarBarsIcon from "../../public/img/icons/farBarsIcon";
import SearchIcon from "../../public/img/icons/searchIcon";
import RedirectIcon from "../../public/img/icons/redirectIcon";
import SettingsIcon from "../../public/img/icons/settingsIcon";
import SignOutIcon from "../../public/img/icons/signOutIcon";

function MenuDrawer({ userData, isOpen, onClose, links }) {
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
            if(key === "Button") {
              return elm.map(b => 
                <RoundedButton
                  key={b.name}
                  backgroundColor={b.color}
                  minWidth="100px"
                  height="38px"
                  fontFamily="Roboto"
                  fontSize="20px"
                  borderRadius="30px"
                  onClick={() => window.open(b.href, "_blank")}
                >
                  {b.name}
                </RoundedButton>
              )
            }
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
                        fontFamily="Roboto"
                        letterSpacing="0.1px"
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
                    {elm.map((c) => {
                      if(c.name === undefined) return null

                      return (
                        <Link
                          key={c.name}
                          display="flex"
                          gap="16px"
                          fontSize="16px"
                          fontFamily="Roboto"
                          letterSpacing="0.1px"
                          fontWeight="400"
                          href={c.href}
                        >{c.icon && c.icon} {c.name}</Link>
                      )
                    })}
                  </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              )
            } else {
              return (
                <Link
                  key={key}
                  fontSize="20px"
                  fontFamily="Roboto"
                  letterSpacing="0.1px"
                  fontWeight="400"
                  href={elm}
                >{key}
                </Link>
              )
            }
          })}
        </VStack>

        {userData ?
          <></>
          :
          <Stack display={isMobileMod() ? "flex" : "none"} marginTop="auto" gap="16px">
            <Box
              as="a"
              href="/user/login"
              target="_self"
              display="flex"
              alignItems="center"
              height="40px"
              width="fit-content"
              borderRadius="8px"
              padding="8px 4px"
              cursor="pointer"
              color="#252A32"
              fontFamily="Roboto"
              fontWeight="400"
              fontSize="14px"
              letterSpacing="0.1px"
              lineHeight="20px"
              gap="8px"
              _hover={{
                opacity: 0.7
              }}
            >
              Entrar
            </Box>
            
            <Box
              as="a"
              href="/user/register"
              target="_self"
              display="flex"
              alignItems="center"
              height="40px"
              width="fit-content"
              borderRadius="8px"
              backgroundColor="#0D99FC"
              padding="8px 16px"
              cursor="pointer"
              color="#FFF"
              fontFamily="Roboto"
              fontWeight="400"
              fontSize="14px"
              letterSpacing="0.1px"
              gap="8px"
              lineHeight="20px"
              _hover={{
                backgroundColor: "#0B89E2"
              }}
            >
              Cadastrar
            </Box>
          </Stack>
        }
      </DrawerContent>
    </Drawer>
  );
}

function MenuDrawerUser({ userData, isOpen, onClose, isUserPro}) {
  const router = useRouter()

  const links = [
    {name: "Perfil público", value: "profile"},
    {name: "Conta", value: "account"},
    {name: "Senha", value: "new_password"},
    {name: "Planos e pagamento", value: "plans_and_payment"},
  ]
  // {name: "Acessos", value: "accesses"},

  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      <DrawerOverlay backdropFilter="blur(2px)"/>
      <DrawerContent padding="16px">
        <BDLogoImage
          widthImage="65px"
          heightImage="30px"
          marginBottom="24px"
          onClick={() => window.open("/", "_self")}
        />

        <Stack spacing={0} justifyContent="center" alignItems="center" padding="16px 0" marginBottom="24px">
          <Box
            width="48px"
            height="48px"
            borderRadius="50%"
            overflow="hidden"
            marginBottom="10px"
          >
            <Image
              display={{ base: "flex", lg: "none" }}
              alt=""
              width="100%"
              height="100%"
              src={userData?.picture ? userData?.picture : "https://storage.googleapis.com/basedosdados-website/equipe/sem_foto.png"}
            />
          </Box>
          <Text
            color="#252A32"
            fontFamily="Roboto"
            letterSpacing="0.1px"
            fontSize="12px"
            fontWeight="500"
            lineHeight="18px"
          >{userData?.username || ""}</Text>
          <Text
            color="#71757A"
            fontFamily="Roboto"
            letterSpacing="0.1px"
            fontSize="12px"
            fontWeight="500"
            lineHeight="18px"
          >{userData?.email || ""}</Text>

          <Box
            fontFamily="Roboto"
            fontWeight="500"
            fontSize="12px"
            lineHeight="18px"
            letterSpacing="0.1px"
            border="1px solid #2B8C4D"
            backgroundColor={isUserPro ? "#2B8C4D" : "#FFFFFF"}
            color={isUserPro ? "#FFFFFF" : "#2B8C4D"}
            borderRadius="100px"
            padding="4px 8px"
            marginTop="10px !important"
          >
            {isUserPro ? "Pro" : "Grátis"}
          </Box>
        </Stack>

        <Accordion allowToggle width="100%" defaultIndex={0}>
          <AccordionItem borderWidth="0 !important">
            <AccordionButton
              padding="14px 0"
              _hover={{background: "none"}}
              justifyContent="space-between"
            >
              <Stack spacing={0} flexDirection="row" alignItems="center" gap="8px">
                <SettingsIcon fill="#D0D0D0" width="20px" height="20px"/>
                <Text
                  fontSize="14px"
                  fontFamily="Roboto"
                  fontWeight="400"
                  lineHeight="20px"
                  color="#252A32"
                >
                  Configurações
                </Text>
              </Stack>
              <AccordionIcon />
            </AccordionButton>

            <AccordionPanel
              display="flex"
              flexDirection="column"
              gridGap="10px"
              padding="0 0 0 28px"
            >
              {links.map((elm, index) => {
                return (
                  <Link
                    key={index}
                    color="#71757A"
                    fontSize="14px"
                    fontFamily="Roboto"
                    letterSpacing="0.1px"
                    fontWeight="400"
                    lineHeight="20px"
                    onClick={() => {
                      onClose()
                      router.push({pathname: `/user/${userData.username}`, query: elm.value})}
                    }
                  >{elm.name}</Link>
                )
              })}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        <Divider margin="24px 0" borderColor="#DEDFE0"/>

        <Stack
          display="flex"
          cursor="pointer"
          spacing={0}
          flexDirection="row"
          padding="14px 0"
          alignItems="center"
          color="#252A32"
          fill="#D0D0D0"
          _hover={{
            opacity: 0.7
          }}
          onClick={() => {
            cookies.remove('userBD', { path: '/' })
            cookies.remove('token', { path: '/' })
            window.open("/", "_self")
          }}
        >
          <SignOutIcon width="20px" height="20px"/>
          <Text
            fontFamily="Roboto"
            fontSize="14px"
            fontWeight="400"
            lineHeight="20px"
            marginLeft="8px !important"
          >
            Sair
          </Text>
        </Stack>
      </DrawerContent>
    </Drawer>
  )
}

function MenuUser ({ userData, onOpen, onClose, isUserPro }) {
  const timerRef = useRef()
  const [isOpenMenu, setIsOpenMenu] = useState(false)

  const btnMouseEnterEvent = () => {
    setIsOpenMenu(true)
  }
  const btnMouseLeaveEvent = () => {
    timerRef.current = setTimeout(() => {
      setIsOpenMenu(false)
    }, 100)
  }
  const menuListMouseEnterEvent = () => {
    clearTimeout(timerRef.current)
    timerRef.current = undefined
    setIsOpenMenu(true)
  }
  const menuListMouseLeaveEvent = () => {
    setIsOpenMenu(false)
  }

  if(useCheckMobile()) {
    return (
      <Box
        cursor="pointer"
        position="fixed"
        right="20px"
        height="40px"
        width="40px"
        borderRadius="50%"
        overflow="hidden"
        onClick={() => onOpen()}
      >
        <Image
          alt=""
          width="100%"
          height="100%"
          src={userData?.picture ? userData.picture : "https://storage.googleapis.com/basedosdados-website/equipe/sem_foto.png"}
        />
      </Box>
    )
  } else {
    return (
      <Menu
        isOpen={isOpenMenu}
        autoSelect={false}
        placement="bottom"
      >
        <MenuButton
          onClick={btnMouseEnterEvent}
          onMouseLeave={btnMouseLeaveEvent}
        >
          <Box
            height="40px"
            width="40px"
            borderRadius="50%"
            overflow="hidden"
          >
            <Image
              alt=""
              width="100%"
              height="100%"
              src={userData?.picture ? userData.picture : "https://storage.googleapis.com/basedosdados-website/equipe/sem_foto.png"}
            />
          </Box>
        </MenuButton>
        <MenuList
          width="260px"
          borderWidth={0}
          padding={0}
          boxShadow="0 1.6px 16px 0 rgba(100, 96, 103, 0.16)"
          onMouseEnter={menuListMouseEnterEvent}
          onMouseLeave={menuListMouseLeaveEvent}
        >
          <MenuItem
            display="flex"
            flexDirection="column"
            cursor="default"
            width="100%"
            textAlign="center"
            alignItems="center"
            padding="16px"
            _hover={{ backgroundColor: "transparent"}}
          >
            <Box
              height="48px"
              width="48px"
              borderRadius="50%"
              overflow="hidden"
              marginBottom="10px"
            >
              <Image
                alt=""
                width="100%"
                height="100%"
                display={{ base: "none", lg: "flex" }}
                src={userData?.picture ? userData.picture : "https://storage.googleapis.com/basedosdados-website/equipe/sem_foto.png"}
              />
            </Box>
            <Text
              color="#252A32"
              fontFamily="Roboto"
              letterSpacing="0.1px"
              fontSize="12px"
              fontWeight="500"
              lineHeight="18px"
            >
              {userData?.username ? userData?.username : ""}
            </Text>
            <Text
              color="#71757A"
              fontFamily="Roboto"
              fontSize="12px"
              fontWeight="500"
              lineHeight="18px"
              letterSpacing="0.1px"
            >
              {userData?.email ? userData?.email : ""}
            </Text>

            <Box
              fontFamily="Roboto"
              fontWeight="500"
              fontSize="12px"
              lineHeight="18px"
              letterSpacing="0.1px"
              border="1px solid #2B8C4D"
              backgroundColor={isUserPro ? "#2B8C4D" : "#FFFFFF"}
              color={isUserPro ? "#FFFFFF" : "#2B8C4D"}
              borderRadius="100px"
              padding="4px 8px"
              marginTop="10px"
            >
              {isUserPro ? "Pro" : "Grátis"}
            </Box>
          </MenuItem>

          <MenuItem
            display="flex"
            flexDirection="row"
            alignItems="center"
            gap="8px"
            padding="16px"
            _hover={{ backgroundColor: "transparent", opacity: "0.7" }}
            onClick={() => window.open(`/user/${userData.username}`, "_self")}
          >
            <SettingsIcon fill="#D0D0D0" width="20px" height="20px"/>
            <Text
              color="#252A32"
              fontFamily="Roboto"
              fontSize="14px"
              fontWeight="400"
              lineHeight="20px"
            >
              Configurações
            </Text>
          </MenuItem>
          <Divider borderColor="#DEDFE0"/>
          <MenuItem
            display="flex"
            flexDirection="row"
            alignItems="center"
            gap="8px"
            padding="16px"
            _hover={{ backgroundColor: "transparent", opacity: "0.7" }}
            onClick={() => {
              cookies.remove('userBD', { path: '/' })
              cookies.remove('token', { path: '/' })
              window.open("/", "_self")}
            }
          >
            <SignOutIcon width="20px" height="20px" fill="#D0D0D0"/>
            <Text
              color="#252A32"
              fontFamily="Roboto"
              fontSize="14px"
              fontWeight="400"
              lineHeight="20px"
            >
              Sair
            </Text>
          </MenuItem>
        </MenuList>
      </Menu>
    )
  }

}

function SearchInputUser ({ user }) {
  const inputMobileRef = useRef(null)
  const [search, setSearch] = useState("")
  const [showInput, setShowInput] = useState(false)
  const [inputFocus, setInputFocus] = useState(false)

  function openSearchLink() {
    if(search.trim() === "") return
    triggerGAEvent("search_menu", search.trim())
    window.open(`/dataset?q=${search.trim()}`, "_self")
  }

  const handleClickOutside = (event) => {
    if (inputMobileRef.current && !inputMobileRef.current.contains(event.target)) {
      setShowInput(false);
    }
  }

  useEffect(() => {
    if (showInput) {
      document.addEventListener('click', handleClickOutside)
    } else {
      document.removeEventListener('click', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [showInput])

  if (isMobileMod()) return (
    <Stack spacing={0} width="100%" marginRight={user ? "60px !important" : "0"}>
      <Stack
        display={showInput ? "flex" :"none"}
        position="absolute"
        top="0"
        left="0"
        backgroundColor="#FFF"
        width="100vw"
        height="70px"
        padding="16px 20px"
        zIndex={99}
      >
        <ControlledInputSimple
          width="100%"
          value={search}
          onChange={setSearch}
          onEnterPress={openSearchLink}
          refInput={inputMobileRef}
          inputFocus={showInput}
          changeInputFocus={setShowInput}
          placeholder="Pesquisar dados"
          fill="#464A51"
          icon={
            <SearchIcon
              alt="pesquisar"
              width="16.8px"
              height="16.8px"
              cursor="pointer"
              onClick={() => openSearchLink()}
            />
          }
        />
      </Stack>

      <SearchIcon
        display={showInput ? "none" : "flex"}
        alt="pesquisar"
        fill="#464A51"
        width="18px"
        height="18px"
        marginLeft="auto !important"
        cursor="pointer"
        onClick={() => {
          setShowInput(true)
          setTimeout(() => {
            inputMobileRef.current.focus()
          }, 0)
        }}
      />
    </Stack>
  )

  return (
    <Stack spacing={0}>
      <ControlledInputSimple
        value={search}
        onChange={setSearch}
        onEnterPress={openSearchLink}
        inputFocus={inputFocus}
        changeInputFocus={setInputFocus}
        placeholder="Pesquisar dados"
        fill="#464A51"
        icon={
          <SearchIcon
            alt="pesquisar"
            width="16.8px"
            height="16.8px"
            cursor="pointer"
            onClick={() => openSearchLink()}
          />
        }
      />
    </Stack>
  )
}

function DesktopLinks({
  userData,
  links,
  position = false,
  path,
  userTemplate = false,
  isUserPro
}) {
  function LinkMenuDropDown ({ url, text, icon }) {
    const [flag, setFlag] = useBoolean()

    if(url === undefined && text === undefined) return <Divider marginBottom="10px" padding="10px 0 0" borderColor="#DEDFE0"/>

    return (
      <Link
        display="flex"
        flexDirection="colunm"
        _hover={{ opacity: "0.7" }}
        target={url.slice(0,4) === "http" ? "_blank" : "_self"}
        color="#252A32"
        fontSize="14px"
        fontFamily="Roboto"
        fontWeight="400"
        lineHeight="20px"
        letterSpacing="0.1px"
        href={url}
        padding="10px 0"
        alignItems="center"
        gap="16px"
        onMouseEnter={setFlag.on}
        onMouseLeave={setFlag.off}
      > 
        {icon && icon}
        {text}
        <RedirectIcon fill={flag && url.slice(0,4) === "http" ? "#A3A3A3" : "transparent"} marginLeft="auto" width="12px" height="12px"/>
      </Link>
    )
  }

  return (
    <HStack
      display={{ base: "none", lg: "flex" }}
      justifyContent="space-between"
      width="100%"
      position={{ base: "relative", lg: "initial" }}
      gap="24px"
      transition="1s"
      marginLeft={
        path === "/" ?
        !position ? "0 !important" : "28px !important"
        : "28px !important"
      }
    >
      <HStack display={userTemplate ? "none" : "flex"} width="100%" flex="3" spacing={7}>
        {Object.entries(links).map(([k, v], i) => {
          if (k === "Button") {
            return v.map((b, j) => (
              <a key={`button-${j}`} href={b.href} target="_blank">
                <RoundedButton
                  colorScheme="red"
                  backgroundColor={b.color}
                  minWidth="80px"
                  height="35px"
                  fontSize="14px"
                  fontFamily="Roboto"
                  letterSpacing="0.1px"
                  fontWeight="400"
                  lineHeight="20px"
                  borderRadius="30px"
                >
                  {b.name}
                </RoundedButton>
              </a>
            ))
          }

          if (typeof v === "object") {
            return (
              <MenuDropdown
                key={i}
                title={k}
                marginLeft="-25px"
                marginTop="10px"
                minWidth="202px"
                borderColor="#FFF"
                fontSize="14px"
                fontFamily="Roboto"
                letterSpacing="0.1px"
                fontWeight="400"
                lineHeight="20px"
                borderRadius="10px"
                padding="32px"
                _first={{ paddingTop: "10px"}}
                _last={{ paddingBottom: "10px"}}
                boxShadow= "0 1px 8px 1px rgba(64, 60, 67, 0.16)"
              >
                {v.map((elm, j) => (
                  <LinkMenuDropDown
                    key={`link-${i}-${j}`}
                    url={elm?.href}
                    text={elm?.name}
                    icon={elm?.icon}
                  />
                ))}
              </MenuDropdown>
            )
          }

          return (
            <Link
              key={`link-${i}`}
              _hover={{ opacity: "0.7" }}
              fontSize="14px"
              fontFamily="Roboto"
              letterSpacing="0.1px"
              fontWeight="400"
              lineHeight="20px"
              href={v}
              target={v.startsWith("https") ? "_blank" : null}
            >
              {k}
            </Link>
          )
        })}
      </HStack>

      {userTemplate && !isMobileMod() &&
        <SearchInputUser
          user={userData !== null}
        />
      }

      <HStack spacing="21px" display={{ base: "none", lg: "flex" }}>
        {(path === "/dataset" || path === "/dataset/[dataset]") &&
          <HelpWidget
            tooltip="Ajuda e recursos"
            options={[
              {name:"Perguntas frequentes", url: "/perguntas-frequentes"},
              {name:"Documentação", url: "https://basedosdados.github.io/mais/"},
              {name:"Vídeos no YouTube", url: "https://www.youtube.com/c/BasedosDados/featured"},
              {},
              {name:"Instale os nossos pacotes", url: "https://basedosdados.github.io/mais/access_data_packages/"},
              {},
              {name:"Como citar a BD?",  url: "/perguntas-frequentes/#reference"},
              {name:"O que são diretórios?", url: "/perguntas-frequentes/#directories"},
              {},
              {name:"Fale com nossa comunidade no Discord", url: "https://discord.gg/huKWpsVYx4"},
              {name:"Entre em contato", url: "/contato"},
            ]}
          />
        }

        {userData ? (
          <HStack spacing="20px">
            <MenuUser userData={userData} isUserPro={isUserPro}/>
          </HStack>
        ) : (
          <>
            <Box
              as="a"
              href="/user/login"
              target="_self"
              display="flex"
              alignItems="center"
              height="40px"
              width="fit-content"
              borderRadius="8px"
              padding="8px 4px"
              cursor="pointer"
              color="#252A32"
              fontFamily="Roboto"
              fontWeight="400"
              fontSize="14px"
              letterSpacing="0.1px"
              lineHeight="20px"
              gap="8px"
              _hover={{
                opacity: 0.7
              }}
            >
              Entrar
            </Box>
            
            <Box
              as="a"
              href="/user/register"
              target="_self"
              display="flex"
              alignItems="center"
              height="40px"
              width="fit-content"
              borderRadius="8px"
              backgroundColor="#0D99FC"
              padding="8px 16px"
              cursor="pointer"
              color="#FFF"
              fontFamily="Roboto"
              fontWeight="400"
              fontSize="14px"
              letterSpacing="0.1px"
              gap="8px"
              lineHeight="20px"
              _hover={{
                backgroundColor: "#0B89E2"
              }}
            >
              Cadastrar
            </Box>
          </>
        )}
      </HStack>
    </HStack>
  )
}

export default function MenuNav({ simpleTemplate = false, userTemplate = false }) {
  const router = useRouter()
  const { route } = router
  const userBD = useMemo(() => cookies.get("userBD") || null, [cookies])

  const menuDisclosure = useDisclosure()
  const menuUserMobile = useDisclosure()
  const divRef = useRef()
  const [isScrollDown, setIsScrollDown] = useState(false)
  const [userData, setUserData] = useState(null)

  const [lastScrollY, setLastScrollY] = useState(0)
  const [menuVisible, setMenuVisible] = useState(true)

  const isUserPro = () => {
    let user
    if(cookies.get("userBD")) user = JSON.parse(cookies.get("userBD"))

    if(user?.internalSubscription?.edges?.[0]?.node?.isActive === true) return true
    return false
  }

  const handleScroll = () => {
    const currentScrollY = window.scrollY
    if (currentScrollY > lastScrollY) {
      setMenuVisible(false)
    } else {
      setMenuVisible(true)
    }
    setLastScrollY(currentScrollY)
  }

  useEffect(() => {
    if(route !== "/dataset/[dataset]") return
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [lastScrollY])

  function maxWidthDataset() {
    if (route === "/dataset" || route === "/dataset/[dataset]") return "1440px"
    return "1264px"
  }

  useEffect(() => {
    let userInfo = userBD
    if(userInfo !== null && userInfo !== "undefined") {
      const res = JSON.parse(userInfo)
      setUserData({
        email: res.email,
        username: res.username,
        picture: res.picture || "",
      })
    } else {
      setUserData(null)
    }
  }, [userBD])

  const links = {
    Dados: "/dataset",
    Soluções: [
      {icon: <BDLogoProImage widthImage="54px"/>, name: "Dados exclusivos", href: "https://info.basedosdados.org/bd-pro"},
      {icon: <BDLogoEduImage widthImage="54px"/>, name: "Curso de dados", href: "https://info.basedosdados.org/bd-edu-sql"},
      {icon: <BDLogoLabImage widthImage="54px"/>, name: "Serviços", href: "/servicos"},
    ],
    "Preços": "/precos",
    Tutoriais: [
      {name: "Documentação", href: "https://basedosdados.github.io/mais/"},
      {name: "Vídeos no YouTube", href: "https://www.youtube.com/c/BasedosDados/featured"},
      {name: "Blog", href: "https://medium.com/basedosdados"}
    ],
    Institucional: [
      {name: "Quem somos", href: "/quem-somos"},
      {name: "Transparência", href: "/transparencia"},
      {name: "Newsletter", href: "https://info.basedosdados.org/newsletter"},
      {name: "Carreiras", href: "https://info.basedosdados.org/carreiras"},
      {name: "Perguntas frequentes", href: "/perguntas-frequentes"},
    ],
    Contato: "/contato",
    Button: []
  }

  useEffect(() => {
    document.addEventListener("scroll", () => {
      if (window.scrollY >= 225) setIsScrollDown(true)
      if (window.scrollY <= 225) setIsScrollDown(false)

      if (!divRef.current || !divRef.current.style) return;
      if (window.scrollY <= 30) divRef.current.style.boxShadow = "none";
      else
        divRef.current.style.boxShadow =
          "0px 1px 8px 1px rgba(64, 60, 67, 0.16)";
    });
  }, [divRef.current])

  return (
    <>
      <MenuDrawer
        userData={userData}
        links={links}
        {...menuDisclosure}
      />

      <Box
        ref={divRef}
        position="fixed"
        top="0px"
        width="100%"
        left="0px"
        backgroundColor="#FFFFFF"
        padding={isMobileMod() ? "15px 20px" : "15px 24px"}
        zIndex="99"
        transition="0.5s"
        as="nav"
        transform={menuVisible ? 'translateY(0)' : 'translateY(-100%)'}
      >
        <HStack
          justifyContent={simpleTemplate || userTemplate ? "flex-start" : { base: "center", lg: "flex-start" }}
          width="100%"
          height="40px"
          maxWidth={maxWidthDataset()}
          margin="0 auto"
          spacing={6}
        >
          <Box display={simpleTemplate || userTemplate ? "none" : { base: "flex", lg: "none" }}>
            <FarBarsIcon
              alt="menu de navegação"
              position="absolute"
              top="0"
              left="0"
              margin="20px 0 0 20px"
              marginRight="auto"
              width="30px"
              height="30px"
              onClick={menuDisclosure.onOpen}
              fill="#616161"
              cursor="pointer"
            />
          </Box>

          <Link
            aria-label="Home"
            width={
              route === "/" ?
              isScrollDown ? "80px" : "0"
              : "80px"
            }
            minWidth={
              route === "/" ?
              isScrollDown ? "80px" : "0"
              : "80px"
            }
            _hover={{opacity:"none"}}
            href={route === "/" ? "/#home" : "/"}
            marginLeft="0 !important"
            transition="0.5s"
            overflow="hidden"
          >
            <BDLogoImage
              widthImage="80px"
            />
          </Link>

          {simpleTemplate ?
            <></>  
            :
            <DesktopLinks
              userData={userData}
              links={links}
              position={isScrollDown}
              path={route}
              userTemplate={userTemplate}
              isUserPro={isUserPro()}
            />
          }

          {userTemplate && isMobileMod() &&
            <SearchInputUser
              user={userData !== null}
            />
          }

          {useCheckMobile() && userData &&
            <MenuUser
              userData={userData}
              onOpen={menuUserMobile.onOpen}
              onClose={menuUserMobile.onClose}
              isUserPro={isUserPro()}
            />
          }
          <MenuDrawerUser 
            userData={userData}
            isOpen={menuUserMobile.isOpen}
            onClose={menuUserMobile.onClose}
            isUserPro={isUserPro()}
          />
        </HStack>
      </Box>
    </>
  )
}
