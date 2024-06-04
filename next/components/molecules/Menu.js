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
import ControlledInput from "../atoms/ControlledInput";
import Link from "../atoms/Link";
import RoundedButton from "../atoms/RoundedButton";
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
            <RoundedButton
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
            </RoundedButton>
          </Stack>
        }
      </DrawerContent>
    </Drawer>
  );
}

function MenuDrawerUser({ userData, isOpen, onClose}) {
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
            fontFamily="Ubuntu"
            fontSize="14px"
            fontWeight="400"
            lineHeight="27px"
            letterSpacing="0.3px"
          >{userData?.username || ""}</Text>
          <Text
            color="#6F6F6F"
            fontFamily="Ubuntu"
            fontSize="14px"
            fontWeight="400"
            lineHeight="27px"
            letterSpacing="0.3px"
          >{userData?.email || ""}</Text>
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
          spacing={0}
          flexDirection="row"
          padding="16px 0"
          alignItems="center"
          onClick={() => {
            cookies.remove('userBD', { path: '/' })
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
              fontFamily="Ubuntu"
              fontSize="12px"
              fontWeight="400"
              lineHeight="16px"
              letterSpacing="0.3px"
            >
              {userData?.username ? userData?.username : ""}
            </Text>
            <Text
              color="#6F6F6F"
              fontFamily="Ubuntu"
              fontSize="12px"
              fontWeight="400"
              lineHeight="16px"
              letterSpacing="0.3px"
            >
              {userData?.email ? userData?.email : ""}
            </Text>
          </MenuItem>

          <MenuItem
            display="flex"
            flexDirection="row"
            alignItems="start"
            gap="8px"
            padding="16px"
            _hover={{ backgroundColor: "transparent", opacity: "0.6" }}
            onClick={() => window.open(`/user/${userData.username}`, "_self")}
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
              cookies.remove('userBD', { path: '/' })
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

function SearchInputUser ({ user }) {
  const [search, setSearch] = useState("")
  const [showInput, setShowInput] = useState(false)

  function openSearchLink() {
    if(search.trim() === "") return console.log("nada")
    triggerGAEvent("search_menu", search.trim())
    window.open(`/dataset?q=${search.trim()}`, "_self")
  }

  if (isMobileMod()) return (
    <Stack spacing={0} width="100%" marginRight={user ? "60px !important" : "0"}>
      <ControlledInput
        display={showInput ? "flex" :"none"}
        width="100%"
        value={search}
        onChange={setSearch}
        onEnterPress={openSearchLink}
        placeholder="Pesquise dados"
        alignSelf="center"
        justifyContent="center"
        autoComplete="off"
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
            fill="#9D9FA3"
            width="18px"
            height="18px"
            cursor="pointer"
            _hover={{opacity:"0.8"}}
            onClick={() => openSearchLink()}
          />
        }
      />

      <SearchIcon
        display={showInput ? "none" : "flex"}
        alt="pesquisar"
        fill="#9D9FA3"
        width="18px"
        height="18px"
        marginLeft="auto !important"
        cursor="pointer"
        _hover={{opacity:"0.8"}}
        onClick={() => setShowInput(true) }
      />
    </Stack>
  )

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
        autoComplete="off"
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
            fill="#9D9FA3"
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

function DesktopLinks({ userData, links, position = false, path, userTemplate = false }) {
  function LinkMenuDropDown ({ url, text, icon }) {
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
        {Object.entries(links).map(([k, v], i) => {
          if (k === "Button") {
            return v.map((b, j) => (
              <a key={`button-${j}`} href={b.href} target="_blank">
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
                fontFamily="Ubuntu"
                fontWeight="400"
                letterSpacing="0.3px"
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
          )
        })}
      </HStack>

      {userTemplate && !isMobileMod() && <SearchInputUser user={userData !== null}/>}

      <HStack spacing={8} display={{ base: "none", lg: "flex" }}>
        {userData ? (
          <HStack spacing="20px">
            <MenuUser userData={userData}/>
          </HStack>
        ) : (
          <>
            <Link fontSize="15px" fontFamily="Ubuntu" fontWeight="400" letterSpacing="0.3px" href="/user/login">
              Entrar
            </Link>
            <Link _hover={{ opacity:"none" }} href="/user/register">
              <RoundedButton height="35px" fontSize="15px" minWidth="110px" borderRadius="30px">
                Cadastrar
              </RoundedButton>
            </Link>
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
  };

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
        padding={isMobileMod() ? "16px 20px" : "16px 24px"}
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
            />
          }

          {userTemplate && isMobileMod() && <SearchInputUser user={userData !== null}/>}

          {useCheckMobile() && userData &&
            <MenuUser
              userData={userData}
              onOpen={menuUserMobile.onOpen}
              onClose={menuUserMobile.onClose}
            />
          }
          <MenuDrawerUser 
            userData={userData}
            isOpen={menuUserMobile.isOpen}
            onClose={menuUserMobile.onClose}
          />
        </HStack>
      </Box>
    </>
  )
}
