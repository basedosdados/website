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
import { useTranslation } from 'next-i18next';
import cookies from "js-cookie";
import MenuDropdown from "./MenuDropdown";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook"
import { ControlledInputSimple } from "../atoms/ControlledInput";
import Link from "../atoms/Link";
import Button from "../atoms/Button";
import HelpWidget from "../atoms/HelpWidget";
import { triggerGAEvent } from "../../utils";
import LabelText from "../atoms/Text/LabelText";
import BodyText from "../atoms/Text/BodyText";

import BDLogoImage from "../../public/img/logos/bd_logo";
import BDLogoProImage from "../../public/img/logos/bd_logo_pro";
import BDLogoEduImage from "../../public/img/logos/bd_logo_edu";
import BDLogoLabImage from "../../public/img/logos/bd_logo_lab";
import DBLogoImage from "../../public/img/logos/db_logo";
import DBLogoProImage from "../../public/img/logos/db_logo_pro";
import DBLogoEduImage from "../../public/img/logos/db_logo_edu";
import DBLogoLabImage from "../../public/img/logos/db_logo_lab";
import FarBarsIcon from "../../public/img/icons/farBarsIcon";
import SearchIcon from "../../public/img/icons/searchIcon";
import RedirectIcon from "../../public/img/icons/redirectIcon";
import SettingsIcon from "../../public/img/icons/settingsIcon";
import SignOutIcon from "../../public/img/icons/signOutIcon";

function useIsMobileMod() {
  return useCheckMobile();
}

function MenuDrawer({ userData, isOpen, onClose, links }) {
  const { t } = useTranslation('menu');
  const { locale } = useRouter();
  const router = useRouter();

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay backdropFilter="blur(2px)"/>
      <DrawerContent padding="24px">
        {locale === 'en' ? (
          <DBLogoImage
            widthImage="65px"
            heightImage="30px"
            marginBottom="24px"
            onClick={() => router.push('/')}
          />
        ) : (
          <BDLogoImage
            widthImage="65px"
            heightImage="30px"
            marginBottom="24px"
            onClick={() => router.push('/')}
          />
        )}
        <VStack alignItems="flex-start" width="100%" spacing="16px">
          {Object.entries(links).map(([key, elm]) => {
            if(key === "Button") {
              return elm.map(b => 
                <Button
                  key={b.name}
                  backgroundColor={b.color}
                  minWidth="100px"
                  height="38px"
                  fontSize="20px"
                  lineHeight="26px"
                  onClick={() => router.push(b.href)}
                >
                  {b.name}
                </Button>
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

        {userData ? (
          <></>
        ) : (
          <Stack display={{base: "flex", lg: "none"}} marginTop="auto" gap="16px">
            <Link
              href="/user/login"
              display="flex"
              alignItems="center"
              height="40px"
              width="fit-content"
              borderRadius="8px"
              padding="8px 4px"
              cursor="pointer"
              gap="8px"
              _hover={{
                opacity: 0.7
              }}
            >
              {t('enter', { ns: 'menu' })}
            </Link>
            
            <Link
              href="/user/register"
              display="flex"
              alignItems="center"
              height="40px"
              width="fit-content"
              borderRadius="8px"
              backgroundColor="#0D99FC"
              padding="8px 16px"
              cursor="pointer"
              color="#FFF"
              fontWeight="400"
              gap="8px"
              _hover={{
                backgroundColor: "#0B89E2"
              }}
            >
              {t('register', { ns: 'menu' })}
            </Link>
          </Stack>
        )}
      </DrawerContent>
    </Drawer>
  );
}

function MenuDrawerUser({ userData, isOpen, onClose, isUserPro}) {
  const router = useRouter();
  const { t } = useTranslation('menu');
  const { locale } = useRouter();

  const links = [
    {name: t('public_profile'), value: "profile"},
    {name: t('account'), value: "account"},
    {name: t('password'), value: "new_password"},
    {name: t('plans_and_payment'), value: "plans_and_payment"},
    isUserPro && {name: t('bigquery'), value: "big_query"},
  ]
  // {name: "Acessos", value: "accesses"},

  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      <DrawerOverlay backdropFilter="blur(2px)"/>
      <DrawerContent padding="16px">
        {locale === 'en' ? (
          <DBLogoImage
            widthImage="65px"
            heightImage="30px"
            marginBottom="24px"
            onClick={() => router.push('/')}
          />
        ) : (
          <BDLogoImage
            widthImage="65px"
            heightImage="30px"
            marginBottom="24px"
            onClick={() => router.push('/')}
          />
        )}

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
          <LabelText typography="x-small">{userData?.username || ""}</LabelText>
          <LabelText
            typography="x-small"
            color="#71757A"
          >{userData?.email || ""}</LabelText>

          <LabelText
            typography="x-small"
            as="div"
            border="1px solid #2B8C4D"
            backgroundColor={isUserPro ? "#2B8C4D" : "#FFFFFF"}
            color={isUserPro ? "#FFFFFF" : "#2B8C4D"}
            borderRadius="100px"
            padding="4px 8px"
            marginTop="10px !important"
          >
            {isUserPro
              ? (userData?.plan === "bd_pro_empresas"
                ? t('DBEnterprise')
                : userData?.plan === "bd_pro"
                  ? t('DBPro')
                  : null)
              : t('DBFree')
            }
          </LabelText>
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
                <BodyText typography="small">
                  {t('settings')}
                </BodyText>
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
                    fontWeight="400"
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
            router.push('/')
          }}
        >
          <SignOutIcon width="20px" height="20px"/>
          <BodyText
            typography="small"
            marginLeft="8px !important"
          >
            {t('exit')}
          </BodyText>
        </Stack>
      </DrawerContent>
    </Drawer>
  )
}

function MenuUser ({ userData, onOpen, onClose, isUserPro }) {
  const timerRef = useRef()
  const [isOpenMenu, setIsOpenMenu] = useState(false)
  const { t } = useTranslation('menu');
  const isMobile = useIsMobileMod();
  const router = useRouter();

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

  if(isMobile) {
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
            <LabelText typography="x-small">
              {userData?.username ? userData?.username : ""}
            </LabelText>
            <LabelText
              typography="x-small"
              color="#71757A"
            >
              {userData?.email ? userData?.email : ""}
            </LabelText>

            <LabelText
              typography="x-small"
              as="div"
              border="1px solid #2B8C4D"
              backgroundColor={isUserPro ? "#2B8C4D" : "#FFFFFF"}
              color={isUserPro ? "#FFFFFF" : "#2B8C4D"}
              borderRadius="100px"
              padding="4px 8px"
              marginTop="10px"
            >
              {isUserPro
                ? (userData?.plan === "bd_pro_empresas"
                  ? t('DBEnterprise')
                  : userData?.plan === "bd_pro"
                    ? t('DBPro')
                    : null)
                : t('DBFree')
              }
            </LabelText>
          </MenuItem>

          <MenuItem
            display="flex"
            flexDirection="row"
            alignItems="center"
            gap="8px"
            padding="16px"
            _hover={{ backgroundColor: "transparent", opacity: "0.7" }}
            onClick={() => router.push(`/user/${userData.username}`)}
          >
            <SettingsIcon fill="#D0D0D0" width="20px" height="20px"/>
            <BodyText typography="small">
              {t('settings')}
            </BodyText>
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
              router.push('/')
            }}
          >
            <SignOutIcon width="20px" height="20px" fill="#D0D0D0"/>
            <BodyText typography="small">
              {t('exit')}
            </BodyText>
          </MenuItem>
        </MenuList>
      </Menu>
    )
  }
}

function SearchInputUser ({ user }) {
  const { t } = useTranslation('menu');
  const inputMobileRef = useRef(null)
  const [search, setSearch] = useState("")
  const [showInput, setShowInput] = useState(false)
  const [inputFocus, setInputFocus] = useState(false)
  const isMobile = useIsMobileMod();
  const router = useRouter();

  function openSearchLink() {
    if(search.trim() === "") return
    triggerGAEvent("search", search.trim())
    triggerGAEvent("search_menu", search.trim())
    router.push(`/search?q=${search.trim()}`);
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

  if (isMobile) return (
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
          placeholder={t('search_data')}
          fill="#464A51"
          icon={
            <Link
              href={`/search?q=${search.trim()}`}
              onClick={(e) => {
                e.preventDefault();
                openSearchLink();
              }}
            >
              <SearchIcon
                alt="pesquisar"
                width="16.8px"
                height="16.8px"
                cursor="pointer"
              />
            </Link>
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
        placeholder={t('search_data')}
        fill="#464A51"
        icon={
          <Link
            href={`/search?q=${search.trim()}`}
            onClick={(e) => {
              e.preventDefault();
              openSearchLink();
            }}
          >
            <SearchIcon
              alt="pesquisar"
              width="16.8px"
              height="16.8px"
              cursor="pointer"
            />
          </Link>
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
  const isMobile = useIsMobileMod();
  const { t } = useTranslation('common', 'menu');
  const { locale } = useRouter();

  function LinkMenuDropDown ({ url, text, icon }) {
    const [flag, setFlag] = useBoolean()

    if(url === undefined && text === undefined) return <Divider marginBottom="10px" padding="10px 0 0" borderColor="#DEDFE0"/>

    return (
      <Link
        flexDirection="colunm"
        _hover={{ opacity: "0.7" }}
        target={url.slice(0,4) === "http" ? "_blank" : "_self"}
        color="#252A32"
        fontWeight="400"
        href={url}
        padding="10px 0"
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
                <Button
                  onClick={() => {}}
                  backgroundColor={b.color}
                  minWidth="80px"
                  height="35px"
                  fontWeight="400"
                >
                  {b.name}
                </Button>
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
              fontWeight="400"
              href={v}
              target={v.startsWith("https") ? "_blank" : null}
            >
              {k}
            </Link>
          )
        })}
      </HStack>

      {userTemplate && !isMobile &&
        <SearchInputUser
          user={userData !== null}
        />
      }

      <HStack spacing="21px" display={{ base: "none", lg: "flex" }}>
        {(path === "/search" || path === "/dataset/[dataset]" || path === "/user/[username]") &&
          <HelpWidget
            tooltip={t('tooltip.helpAndResources')}
            options={[
              {name: t('tooltip.faq'), component: <Link href="/faq">{t('tooltip.faq')}</Link>},
              {name: t('tooltip.documentation'), url: 
                locale === "en" ? "https://basedosdados.github.io/sdk/en" :
                locale === "es" ? "https://basedosdados.github.io/sdk/es" :
                "https://basedosdados.github.io/sdk"
              },
              {name: t('tooltip.youtubeVideos'), url: "https://www.youtube.com/c/BasedosDados/featured"},
              {name: t('tooltip.installPackages'), url: 
                locale === "en" ? "https://basedosdados.github.io/sdk/en/access_data_packages/" :
                locale === "es" ? "https://basedosdados.github.io/sdk/es/access_data_packages/" :
                "https://basedosdados.github.io/sdk/access_data_packages/"
              },
              {name: t('tooltip.howToCite'), component: <Link href="/faq#reference">{t('tooltip.howToCite')}</Link>},
              {name: t('tooltip.whatAreDirectories'), component: <Link href="/faq#directories">{t('tooltip.whatAreDirectories')}</Link>},
              {},
              {name: t('tooltip.discordCommunity'), url: "https://discord.gg/huKWpsVYx4"},
              {name: t('tooltip.contactUs'), component: <Link href="/contact">{t('tooltip.contactUs')}</Link>},
            ]}
          />
        }

        {userData ? (
          <HStack spacing="20px">
            <MenuUser userData={userData} isUserPro={isUserPro}/>
          </HStack>
        ) : (
          <>
            <Link
              href="/user/login"
              height="40px"
              width="fit-content"
              borderRadius="8px"
              padding="8px 4px"
              color="#252A32"
              fontWeight="400"
              gap="8px"
              _hover={{
                opacity: 0.7
              }}
            >
              {t('enter', { ns: 'menu' })}
            </Link>
            
            <Link
              href="/user/register"
              height="40px"
              width="fit-content"
              borderRadius="8px"
              backgroundColor="#0D99FC"
              padding="8px 16px"
              color="#FFF"
              fontWeight="400"
              gap="8px"
              _hover={{
                backgroundColor: "#0B89E2"
              }}
            >
              {t('register', { ns: 'menu' })}
            </Link>
          </>
        )}
      </HStack>
    </HStack>
  )
}

export default function MenuNav({ simpleTemplate = false, userTemplate = false }) {
  const { t } = useTranslation('menu');
  const router = useRouter()
  const { locale } = router
  const [userBD, setUserBD] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const isMobile = useIsMobileMod();

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

  useEffect(() => {
    const cookieUserBD = cookies.get("userBD")
    setUserBD(cookieUserBD || null)
    setIsLoading(false)
  }, [])

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
    if(router.pathname !== "/dataset/[dataset]") return
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [lastScrollY, router.pathname])

  useEffect(() => {
    if(isLoading) return
    if(userBD !== null && userBD !== "undefined") {
      try {
        const res = JSON.parse(userBD)

        setUserData({
          email: res.email,
          username: res.username,
          picture: res.picture || "",
          plan: res?.internalSubscription?.edges?.[0]?.node?.stripeSubscription
        })
      } catch (error) {
        console.error("Error parsing user data:", error)
        setUserData(null)
      }
    } else {
      setUserData(null)
    }
  }, [userBD, isLoading])

  let links;

  if (locale === "pt") {
    links = {
      [t('data')]: `/search`,
      [t('solutions')]: [
        {
          icon: <BDLogoProImage widthImage="54px"/>,
          name: [t('exclusive_data')],
          href: "https://info.basedosdados.org/bd-pro"
        },
        {
          icon: <BDLogoEduImage widthImage="54px"/>,
          name: [t('data_courses')],
          href: "https://info.basedosdados.org/bd-edu-cursos"
        },
        {
          icon: <BDLogoLabImage widthImage="54px"/>,
          name: [t('services')],
          href: "/services"
        },
      ],
      [t('prices')]: "/prices",
      [t('resources')]: [
        {name: [t('documentation')], href: "https://basedosdados.github.io/sdk"},
        {name: [t('youtube_videos')], href: "https://www.youtube.com/c/BasedosDados/featured"},
        {name: "Blog", href: "/blog"},
        {name: [t('faq')], href: "/faq"}
      ],
      [t('institutional')]: [
        {name: [t('about_us')], href: "/about-us"},
        {name: [t('transparency')], href: "/transparency"},
        {name: [t('newsletter')], href: "https://info.basedosdados.org/newsletter"},
        {name: [t('jobs')], href: "https://info.basedosdados.org/carreiras"},
      ],
      [t('contact')]: "/contact",
      Button: []
    }
  } else if (locale === "en") {
    links = {
      [t('data')]: `/search`,
      [t('solutions')]: [
        {
          icon: <DBLogoProImage widthImage="54px"/>,
          name: [t('exclusive_data')],
          href: "https://info.basedosdados.org/en/bd-pro"
        }
      ],
      [t('prices')]: "/prices",
      [t('resources')]: [
        {name: [t('documentation')], href: "https://basedosdados.github.io/sdk/en"},
        {name: [t('youtube_videos')], href: "https://www.youtube.com/c/BasedosDados/featured"},
        {name: "Blog", href: "/blog"},
        {name: [t('faq')], href: "/faq"}
      ],
      [t('institutional')]: [
        {name: [t('about_us')], href: "/about-us"},
        {name: [t('transparency')], href: "/transparency"},
      ],
      [t('contact')]: "/contact",
      Button: []
    }
  } else if (locale === "es") {
    links = {
      [t('data')]: `/search`,
      [t('solutions')]: [
        {
          icon: <BDLogoProImage widthImage="54px"/>,
          name: [t('exclusive_data')],
          href: "https://info.basedosdados.org/es/bd-pro"
        }
      ],
      [t('prices')]: "/prices",
      [t('resources')]: [
        {name: [t('documentation')], href: "https://basedosdados.github.io/sdk/es"},
        {name: [t('youtube_videos')], href: "https://www.youtube.com/c/BasedosDados/featured"},
        {name: "Blog", href: "/blog"},
        {name: [t('faq')], href: "/faq"}
      ],
      [t('institutional')]: [
        {name: [t('about_us')], href: "/about-us"},
        {name: [t('transparency')], href: "/transparency"},
      ],
      [t('contact')]: "/contact",
      Button: []
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 225) setIsScrollDown(true)
      if (window.scrollY <= 225) setIsScrollDown(false)

      if (!divRef.current || !divRef.current.style) return;
      if (window.scrollY <= 30) divRef.current.style.boxShadow = "none";
      else
        divRef.current.style.boxShadow =
          "0px 1px 8px 1px rgba(64, 60, 67, 0.16)";
    };

    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [])

  if (isLoading) {
    return null;
  }

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
        padding={{base: "15px 20px", lg: "15px 24px"}}
        zIndex="99"
        transition="0.5s"
        as="nav"
        transform={menuVisible ? 'translateY(0)' : 'translateY(-100%)'}
      >
        <HStack
          justifyContent={simpleTemplate || userTemplate ? "flex-start" : { base: "center", lg: "flex-start" }}
          width="100%"
          height="40px"
          maxWidth="1440px"
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
              router.pathname === "/" ?
              isScrollDown ? "80px" : "0"
              : "80px"
            }
            minWidth={
              router.pathname === "/" ?
              isScrollDown ? "80px" : "0"
              : "80px"
            }
            _hover={{opacity:"none"}}
            href={router.pathname === "/" ? "/#home" : "/"}
            marginLeft="0 !important"
            transition="0.5s"
            overflow="hidden"
          >
            {locale === 'en' ? (
              <DBLogoImage
                widthImage="80px"
              />
            ) : (
              <BDLogoImage
                widthImage="80px"
              />
            )}
          </Link>

          {simpleTemplate ?
            <></>  
            :
            <DesktopLinks
              userData={userData}
              links={links}
              position={isScrollDown}
              path={router.pathname}
              userTemplate={userTemplate}
              isUserPro={isUserPro()}
            />
          }

          {userTemplate && isMobile &&
            <SearchInputUser
              user={userData !== null}
            />
          }

          {isMobile && userData &&
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
