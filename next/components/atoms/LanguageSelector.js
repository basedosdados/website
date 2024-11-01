import { Menu, MenuButton, MenuList, MenuItem, Box, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import GlobeIcon from "../../public/img/icons/globeIcon";
import { ChevronDownIcon } from "@chakra-ui/icons";

export default function LanguageSelector({ theme = "light" }) {
  const { locale } = useRouter();
  const router = useRouter();

  const styles = {
    light: {
      colors: {
        text: "#464A51",
        icon: "#464A51"
      },
      text: {
        fontSize: "12px",
        lineHeight: "18px",
        ml: "6px",
        mr: "4px",
        fontFamily: "Roboto"
      },
      icon: {
        width: "16px",
        height: "16px"
      },
      chevron: {
        w: 3,
        h: 3
      }
    },
    dark: {
      colors: {
        text: "#FFFFFF",
        icon: "#FFFFFF"
      },
      text: {
        fontSize: "16px",
        fontWeight: "300",
        lineHeight: "20px",
        ml: "8px",
        mr: "4px",
        fontFamily: "Ubuntu"
      },
      icon: {
        width: "20px",
        height: "20px"
      },
      chevron: {
        w: 4,
        h: 4
      }
    }
  };

  const changeLanguage = (locale) => {
    router.push(router.pathname, router.asPath, { locale });
  };

  const getCurrentLanguage = () => {
    switch(locale) {
      case 'pt':
        return 'Português';
      case 'en':
        return 'English';
      case 'es':
        return 'Español';
      default:
        return 'Português';
    }
  };

  return (
    <Menu>
      {({ isOpen }) => (
        <>
          <MenuButton
            aria-label="Language selector"
            position="relative"
            display="inline-flex"
            alignItems="center"
            width="auto"
            padding="4px 0px"
            height="36px"
            borderRadius="18px"
            zIndex="11"
            _hover={{ opacity: 0.8 }}
          >
            <Box display="flex" alignItems="center">
              <GlobeIcon
                alt="language selector"
                width={styles[theme].icon.width}
                height={styles[theme].icon.height}
                fill={styles[theme].colors.icon}
              />
              <Text
                ml={styles[theme].text.ml}
                mr={styles[theme].text.mr}
                color={styles[theme].colors.text}
                fontSize={styles[theme].text.fontSize}
                lineHeight={styles[theme].text.lineHeight}
                fontFamily={styles[theme].text.fontFamily}
              >
                {getCurrentLanguage()}
              </Text>
              <ChevronDownIcon 
                color={styles[theme].colors.text}
                w={styles[theme].chevron.w} 
                h={styles[theme].chevron.h} 
              />
            </Box>
          </MenuButton>
          <MenuList
            boxShadow="0px 1.5px 16px rgba(0, 0, 0, 0.16)"
            _focus={{boxShadow: "0px 1.5px 16px rgba(0, 0, 0, 0.16) !important"}}
            padding="16px 0 6px"
            borderRadius="8px"
            zIndex="11"
            color="#252A32"
            minW="100px"
          >
            <MenuItem 
              onClick={() => changeLanguage('pt')}
              letterSpacing="0.1px"
              lineHeight="18px"
              fontWeight="400"
              fontSize="12px"
              fontFamily="Roboto"
              color="#252A32"
              backgroundColor="#FFF"
              padding="0 16px 10px"
              _focus={{backgroundColor: "transparent"}}
              _hover={{backgroundColor: "transparent", opacity: "0.7"}}
            >
              Português
            </MenuItem>
            <MenuItem 
              onClick={() => changeLanguage('en')}
              letterSpacing="0.1px"
              lineHeight="18px"
              fontWeight="400"
              fontSize="12px"
              fontFamily="Roboto"
              color="#252A32"
              backgroundColor="#FFF"
              padding="0 16px 10px"
              _focus={{backgroundColor: "transparent"}}
              _hover={{backgroundColor: "transparent", opacity: "0.7"}}
            >
              English
            </MenuItem>
            <MenuItem 
              onClick={() => changeLanguage('es')}
              letterSpacing="0.1px"
              lineHeight="18px"
              fontWeight="400"
              fontSize="12px"
              fontFamily="Roboto"
              color="#252A32"
              backgroundColor="#FFF"
              padding="0 16px 10px"
              _focus={{backgroundColor: "transparent"}}
              _hover={{backgroundColor: "transparent", opacity: "0.7"}}
            >
              Español
            </MenuItem>
          </MenuList>
        </>
      )}
    </Menu>
  );
}