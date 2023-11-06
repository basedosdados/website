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
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router"
import cookies from "js-cookie";
import { MenuDropdown } from "./MenuDropdown";
import { isMobileMod, useCheckMobile } from "../../hooks/useCheckMobile.hook"
import ControlledInput from "../atoms/ControlledInput";
import Link from "../atoms/Link";
import RoundedButton from "../atoms/RoundedButton";

import BDLogoProImage from "../../public/img/logos/bd_logo_pro";
import BDLogoEduImage from "../../public/img/logos/bd_logo_edu";
import BDLogoImage from "../../public/img/logos/bd_logo";
import FarBarsIcon from "../../public/img/icons/farBarsIcon";
import SearchIcon from "../../public/img/icons/searchIcon";
import CrossIcon from "../../public/img/icons/crossIcon";
import RedirectIcon from "../../public/img/icons/redirectIcon";
import SettingsIcon from "../../public/img/icons/settingsIcon";
import SignOutIcon from "../../public/img/icons/signOutIcon";

function MenuDrawer({ isOpen, onClose, links }) {
  let userData = cookies.get("user") || null

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
            if(key === "Button")
              return elm.map(b => 
                <RoundedButton
                  key={b.name}
                  backgroundColor={b.color}
                  minWidth="100px"
                  height="38px"
                  fontSize="20px"
                  borderRadius="30px"
                  onClick={() => window.open(b.href, "_blank")}
                >
                  {b.name}
                </RoundedButton>
              )
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
                    {elm.map((c) => {
                      if(c.name === undefined) return null

                      return (
                        <Link
                          key={c.name}
                          display="flex"
                          gap="16px"
                          fontSize="16px"
                          fontFamily="Ubuntu"
                          fontWeight="300"
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
                  fontFamily="Ubuntu"
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
            {/* <RoundedButton
              backgroundColor="#FFF"
              border="2px solid #42B0FF"
              color="#42B0FF"
              height="38px"
              borderRadius="30px"
              fontSize="20px"
              onClick={() => window.open("/user/login", "_self")}
            >
              Entrar
            </RoundedButton>
            <RoundedButton
              backgroundColor="#42B0FF"
              height="38px"
              borderRadius="30px"
              fontSize="20px"
              onClick={() => window.open("/user/register", "_self")}
            >
              Cadastrar
            </RoundedButton> */}
          </Stack>
        }
      </DrawerContent>
    </Drawer>
  );
}

function MenuDrawerUser({ isOpen, onClose}) {
  const router = useRouter()
  let userData = cookies.get("user") || null
  if(userData !== null) userData = JSON.parse(cookies.get("user"))

  const links = [
    {name: "Perfil público", value: "profile"},
    {name: "Conta", value: "account"},
    {name: "Senha", value: "new_password"},
    {name: "Planos e pagamento", value: "plans_and_payment"},
    {name: "Acessos", value: "accesses"},
  ]

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
              src={userData?.picture ? userData?.picture : "https://basedosdados-static.s3.us-east-2.amazonaws.com/equipe/sem_foto.png"}
            />
          </Box>
          <Text
            color="#252A32"
            fontFamily="Ubuntu"
            fontSize="14px"
            fontWeight="400"
            lineHeight="27px"
            letterSpacing="0.3px"
          >{userData?.username ? userData?.username : "Dadinho"}</Text>
          <Text
            color="#6F6F6F"
            fontFamily="Ubuntu"
            fontSize="14px"
            fontWeight="400"
            lineHeight="27px"
            letterSpacing="0.3px"
          >{userData?.email ? userData?.email : "dadinho@basedosdados.org"}</Text>
        </Stack>

        <Accordion allowToggle width="100%" defaultIndex={0}>
          <AccordionItem borderWidth="0 !important">
            <AccordionButton
              padding="16px 0"
              _hover={{background: "none"}}
              justifyContent="space-between"
            >
              <Stack spacing={0} flexDirection="row" gap="8px">
                <SettingsIcon fill="#D0D0D0" width="16px" height="16px"/>
                <Text
                  fontSize="16px"
                  fontFamily="Ubuntu"
                  fontWeight="400"
                  lineHeight="16px"
                  letterSpacing="0.2px"
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
            padding="8px 0 0 24px"
          >
            {links.map((elm, index) => {
              return (
                <Link
                  key={index}
                  color="#575757"
                  fontSize="14px"
                  fontFamily="Ubuntu"
                  fontWeight="400"
                  lineHeight="27px"
                  letterSpacing="0.3px"
                  onClick={() => {
                    onClose()
                    router.push({pathname: "/user/dev", query: elm.value})}
                  }
                >{elm.name}</Link>
              )
            })}
          </AccordionPanel>
          </AccordionItem>
        </Accordion>

        <Divider margin="24px 0" borderColor="#DEDFE0"/>

        <Stack
          spacing={0}
          flexDirection="row"
          padding="16px 0"
          alignItems="center"
          onClick={() => {
            cookies.remove('user', { path: '/' })
            cookies.remove('token', { path: '/' })
            window.open("/", "_self")
          }}
        >
          <SignOutIcon width="20px" height="20px" fill="#D0D0D0"/>
          <Text
            color="#252A32"
            fontFamily="Ubuntu"
            fontSize="16px"
            fontWeight="400"
            lineHeight="16px"
            letterSpacing="0.2px"
            marginLeft="8px !important"
          >
            Sair
          </Text>
        </Stack>
      </DrawerContent>
    </Drawer>
  )
}

function MenuUser ({ userData, onOpen, onClose }) {
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
        right="24px"
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
          src={userData?.picture ? userData.picture : "https://basedosdados-static.s3.us-east-2.amazonaws.com/equipe/sem_foto.png"}
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
              src={userData?.picture ? userData.picture : "https://basedosdados-static.s3.us-east-2.amazonaws.com/equipe/sem_foto.png"}
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
                src={userData?.picture ? userData.picture : "https://basedosdados-static.s3.us-east-2.amazonaws.com/equipe/sem_foto.png"}
              />
            </Box>
            <Text
              color="#252A32"
              fontFamily="Ubuntu"
              fontSize="12px"
              fontWeight="400"
              lineHeight="16px"
              letterSpacing="0.3px"
            >
              {userData?.username ? userData?.username : "dadinho"}
            </Text>
            <Text
              color="#6F6F6F"
              fontFamily="Ubuntu"
              fontSize="12px"
              fontWeight="400"
              lineHeight="16px"
              letterSpacing="0.3px"
            >
              {userData?.email ? userData?.email : "dadinho@basedosdados.org"}
            </Text>
          </MenuItem>

          <MenuItem
            display="flex"
            flexDirection="row"
            alignItems="start"
            gap="8px"
            padding="16px"
            _hover={{ backgroundColor: "transparent", opacity: "0.6" }}
            onClick={() => window.open("/user/dev", "_self")}
          >
            <SettingsIcon fill="#D0D0D0" width="16px" height="16px"/>
            <Text
              color="#252A32"
              fontFamily="Ubuntu"
              fontSize="12px"
              fontWeight="400"
              lineHeight="16px"
              letterSpacing="0.3px"
            >
              Configurações
            </Text>
          </MenuItem>
          <Divider borderColor="#DEDFE0"/>
          <MenuItem
            display="flex"
            flexDirection="row"
            alignItems="start"
            gap="8px"
            padding="16px"
            _hover={{ backgroundColor: "transparent", opacity: "0.6" }}
            onClick={() => {
              cookies.remove('user', { path: '/' })
              cookies.remove('token', { path: '/' })
              window.open("/", "_self")}
            }
          >
            <SignOutIcon width="20px" height="20px" fill="#D0D0D0"/>
            <Text
              color="#252A32"
              fontFamily="Ubuntu"
              fontSize="12px"
              fontWeight="400"
              lineHeight="16px"
              letterSpacing="0.3px"
            >
              Sair
            </Text>
          </MenuItem>
        </MenuList>
      </Menu>
    )
  }

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

function SearchInputUser () {
  const [search, setSearch] = useState("")
  const [showSearch, setShowSearch] = useState(false)

  function openSearchLink() {
    window.open(`/dataset?q=${search}`, "_self")
  }

  // if(isMobileMod()) return (
  //   <Stack spacing={0} marginLeft="auto !important" paddingRight="60px">
  //     <SearchIcon
  //       display={showSearch ? "none" : "flex"}
  //       right="100px"
  //       alt="pesquisar"
  //       fill="#D0D0D0"
  //       width="18px"
  //       height="18px"
  //       cursor="pointer"
  //       _hover={{opacity:"0.8"}}
  //       onClick={() => setShowSearch(true)}
  //     />
  //     <Box transition="1s" overflow="hidden" width={showSearch ? "100%" : "0"} maxWidth="160px">
  //       <ControlledInput
  //         maxWidth="480px"
  //         width="480px"
  //         value={search}
  //         onChange={setSearch}
  //         onEnterPress={openSearchLink}
  //         placeholder="Pesquise dados"
  //         alignSelf="center"
  //         justifyContent="center"
  //         inputStyle={{
  //           height: "40px",
  //           fontSize: "16px",
  //           width: "100%",
  //           fontFamily: "Lato",
  //           borderRadius: "14px",
  //           _placeholder:{color: "#6F6F6F"}
  //         }}
  //         rightIcon={
  //           <SearchIcon
  //             alt="pesquisar"
  //             fill="#D0D0D0"
  //             width="18px"
  //             height="18px"
  //             cursor="pointer"
  //             _hover={{opacity:"0.8"}}
  //             onClick={() => openSearchLink()}
  //           />
  //         }
  //       />
  //     </Box>
  //   </Stack>
  // )

  if(isMobileMod()) return null

  return (
    <Stack spacing={0}>
      <ControlledInput
        maxWidth="480px"
        width="480px"
        value={search}
        onChange={setSearch}
        onEnterPress={openSearchLink}
        placeholder="Pesquise dados"
        alignSelf="center"
        justifyContent="center"
        inputStyle={{
          height: "40px",
          fontSize: "16px",
          width: "100%",
          fontFamily: "Lato",
          borderRadius: "14px",
          _placeholder:{color: "#6F6F6F"}
        }}
        rightIcon={
          <SearchIcon
            alt="pesquisar"
            fill="#D0D0D0"
            width="18px"
            height="18px"
            cursor="pointer"
            _hover={{opacity:"0.8"}}
            onClick={() => openSearchLink()}
          />
        }
      />
    </Stack>
  )
}

function DesktopLinks({ links, position = false, path, userTemplate = false }) {
  const [statusSearch, setStatusSearch] = useState(false)

  let userData = cookies.get("user") || null
  if(userData !== null) userData = JSON.parse(cookies.get("user"))

  const searchStatus = (elm) => {
    setStatusSearch(elm.status)
  }

  const LinkMenuDropDown = ({ url, text, icon }) => {
    const [flag, setFlag] = useBoolean()

    if(url === undefined && text === undefined) return <Divider marginBottom="10px" padding="10px 0 0" borderColor="#DEDFE0"/>

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
        padding="10px 0"
        alignItems="center"
        gap="16px"
        onMouseEnter={setFlag.on}
        onMouseLeave={setFlag.off}
      > 
        {icon && icon}
        {text}
        <RedirectIcon fill={flag && url.slice(0,4) === "http" ? "#A3A3A3" : "transparent"} marginLeft="auto" width="16px" height="16px"/>
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
        !position ? "0 !important" : "32px !important"
        : "32px !important"
      }
    >
      <HStack display={userTemplate ? "none" : "flex"} width="100%" flex="3" spacing={7}>
        {Object.entries(links).map(([k, v]) => {
          if (k === "Button")
            return v.map(b => (
              <a key={b.name} href={b.href} target="_blank">
                <RoundedButton
                  colorScheme="red"
                  backgroundColor={b.color}
                  minWidth="80px"
                  height="35px"
                  fontSize="15px"
                  borderRadius="30px"
                >
                  {b.name}
                </RoundedButton>
              </a>
            ))

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
                padding="32px"
                _first={{ paddingTop: "10px"}}
                _last={{ paddingBottom: "10px"}}
                boxShadow= "0 1px 8px 1px rgba(64, 60, 67, 0.16)"
              >
                {v.map((elm) => (
                  <LinkMenuDropDown
                    key={elm.name}
                    url={elm?.href}
                    text={elm.name}
                    icon={elm?.icon}
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
      {userTemplate && !isMobileMod() && <SearchInputUser />}

      {!statusSearch &&
        <HStack spacing={8} display={{ base: "none", lg: "flex" }}>
          {userData ? (
            <HStack spacing="20px">
              <RoundedButton
                display={isMobileMod() ? "none" : "flex"}
                backgroundColor="#FFF"
                border="2px solid #42B0FF"
                color="#42B0FF"
                height="40px"
                fontWeight="700"
                borderRadius="30px"
                fontSize="15px"
                onClick={() => window.open("/precos", "_self")}
              >
                BD Pro
              </RoundedButton>
              <MenuUser userData={userData}/>
            </HStack>
          ) : (
            <>
              {/* <Link fontSize="15px" fontFamily="Ubuntu" fontWeight="400" letterSpacing="0.3px" href="/user/login">
                Entrar
              </Link>
              <Link _hover={{ opacity:"none" }} href="/user/register">
                <RoundedButton height="35px" fontSize="15px" minWidth="110px" borderRadius="30px">
                  Cadastrar
                </RoundedButton>
              </Link> */}
            </>
          )}
        </HStack>
      }
    </HStack>
  );
}

export default function MenuNav({ simpleTemplate = false, userTemplate = false }) {
  const router = useRouter()
  const { route } = router
  const menuDisclosure = useDisclosure()
  const menuUserMobile = useDisclosure()
  const divRef = useRef()
  const bannerRef = useRef()
  const [isScrollDown, setIsScrollDown] = useState(false)
  const [menuMobileMargin, setMenuMobileMargin] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  let userData = cookies.get("user") || null
  if(userData !== null) userData = JSON.parse(cookies.get("user"))

  const links = {
    Dados: "/dataset",
    Soluções: [
      {icon: <BDLogoProImage widthImage="54px"/>, name: "Dados exclusivos", href: "https://info.basedosdados.org/bd-pro"},
      {icon: <BDLogoEduImage widthImage="54px"/>, name: "Curso de dados", href: "https://info.basedosdados.org/bd-edu"},
      {},
      {name: "Serviço", href: "/servicos"},
      {},
      {name: "Estudos de caso", href: "/estudos-de-caso"}
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
  };

  useEffect(() => {
    document.addEventListener("scroll", () => {
      if (window.scrollY >= 425) setIsScrollDown(true)
      if (window.scrollY <= 425) setIsScrollDown(false)

      if (!divRef.current || !divRef.current.style) return;
      if (window.scrollY <= 30) divRef.current.style.boxShadow = "none";
      else
        divRef.current.style.boxShadow =
          "0px 1px 8px 1px rgba(64, 60, 67, 0.16)";
    });
  }, [divRef.current])

  useEffect(() => {
    const marginTopMenuMobile = bannerRef.current.clientHeight
    if(useCheckMobile()) setIsMobile(true)
    setMenuMobileMargin(marginTopMenuMobile)
  }, [bannerRef.current])

  return (
    <>
      <Box
        display={simpleTemplate || userTemplate ? "none" : "block"}
        ref={bannerRef}
        position="fixed"
        backgroundColor="#252A32"
        width="100%"
        height={isScrollDown ? "0" : "fit-content"}
        padding={{ base: isMobile ? "12px 24px" : "12px 45px", lg: "12px 28px" }}
        overflow="hidden"
        zIndex={98}
      >
        <Text
          width="100%"
          transition="0.5s"
          fontSize="15px"
          letterSpacing="0.3px"
          color="#FFF"
          fontWeight="400"
          fontFamily="ubuntu"
          _hover={{opacity: 1}}
          lineHeight={useCheckMobile() ? "20px" : "16px"}
          onClick={() => window.open("https://info.basedosdados.org/bd-pro", "_blank")}
        >
          <Box
            maxWidth="1264px"
            cursor="pointer"
            margin="0 auto"
            _hover={{opacity: 0.7}}
          >
            Assine a BD Pro e tenha acesso a conjuntos exclusivos e dados com alta frequência de atualização. Versão Beta já disponível <RedirectIcon position="relative" top="-2px" left="4px" fill="#FFF"/>
          </Box>
        </Text>
      </Box>

      <MenuDrawer links={links} {...menuDisclosure} />

      <Box
        ref={divRef}
        position="fixed"
        top="0px"
        width="100%"
        left="0px"
        backgroundColor="#FFFFFF"
        padding="16px 28px"
        marginTop={simpleTemplate || userTemplate ? "0" : isScrollDown ? "0" : { base: `${menuMobileMargin}px` , lg: "40px" }}
        zIndex="99"
        transition="0.5s"
        as="nav"
      >
        <HStack
          justifyContent={simpleTemplate || userTemplate ? "flex-start" : { base: "center", lg: "flex-start" }}
          width="100%"
          height="40px"
          maxWidth="1264px"
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
              isScrollDown ? "88px" : "0"
              : "88px"
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
            <DesktopLinks links={links} position={isScrollDown} path={route} userTemplate={userTemplate}/>
          }

          {userTemplate && isMobileMod() && <SearchInputUser />}

          {useCheckMobile() && userData &&
            <MenuUser userData={userData} onOpen={menuUserMobile.onOpen} onClose={menuUserMobile.onClose}/>
          }
          <MenuDrawerUser isOpen={menuUserMobile.isOpen} onClose={menuUserMobile.onClose}/>
        </HStack>
      </Box>
    </>
  )
}
