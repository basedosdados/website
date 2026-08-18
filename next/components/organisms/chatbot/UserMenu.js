import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  HStack,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
} from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import cookies from "js-cookie";
import BodyText from "../../atoms/Text/BodyText";
import HelpIcon from "../../../public/img/icons/helpIcon";
import SignOutIcon from "../../../public/img/icons/signOutIcon";
import { clearClientSession } from "../../../utils";

const FallbackUserPicture =
  "https://storage.googleapis.com/basedosdados-website/equipe/sem_foto.png";

const MenuItemProps = {
  lineHeight: "20px",
  fontWeight: "400",
  fontSize: "14px",
  fontFamily: "Roboto",
  color: "#252A32",
  backgroundColor: "#FFF",
  padding: "8px 12px",
  borderRadius: "8px",
  _focus: { backgroundColor: "transparent" },
  _hover: { backgroundColor: "#EEEEEE" },
};

function getUserFromCookie() {
  try {
    const raw = cookies.get("userBD");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function UserMenu({ isSidebarOpen = true, onHelp, onMobileClose }) {
  const { t } = useTranslation("chatbot");
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getUserFromCookie());
  }, []);

  const displayName = user?.firstName || user?.username || "";
  const picture = user?.picture || FallbackUserPicture;

  const handleLogout = useCallback(async () => {
    await clearClientSession();
    if (typeof window === "undefined") return;
    window.location.href = "/user/login";
  }, []);

  const handleHelp = useCallback(() => {
    onMobileClose?.();
    onHelp?.();
  }, [onHelp, onMobileClose]);

  return (
    <Menu placement="top-start" autoSelect={false}>
      <MenuButton
        variant="unstyled"
        width="100%"
        minWidth={0}
        height="auto"
        padding={isSidebarOpen ? "12px 16px" : "12px 8px"}
        borderRadius="8px"
        background="transparent"
        border="none"
        display="flex"
        overflow="hidden"
        color="#252A32"
        _hover={{ backgroundColor: "#EEEEEE" }}
        _active={{ backgroundColor: "#EEEEEE" }}
        _focus={{ boxShadow: "none" }}
        aria-label={t("ui.userMenu")}
      >
        <HStack
          spacing={isSidebarOpen ? "10px" : "0"}
          align="center"
          justifyContent={isSidebarOpen ? "flex-start" : "center"}
          width="100%"
        >
          <Box
            flexShrink={0}
            width="28px"
            height="28px"
            borderRadius="50%"
            overflow="hidden"
            backgroundColor="#DEDFE0"
          >
            <Image
              alt=""
              width="100%"
              height="100%"
              objectFit="cover"
              src={picture}
              fallbackSrc={FallbackUserPicture}
            />
          </Box>
          <BodyText
            typography="small"
            color="currentColor"
            flex={isSidebarOpen ? 1 : undefined}
            opacity={isSidebarOpen ? 1 : 0}
            width={isSidebarOpen ? "auto" : 0}
            minWidth={0}
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
            textAlign="left"
            textTransform="capitalize"
            transition="opacity 0.2s ease, width 0.2s ease"
          >
            {displayName}
          </BodyText>
        </HStack>
      </MenuButton>
      <Portal>
        <MenuList
          minWidth="184px"
          borderWidth={0}
          padding="6px"
          borderRadius="8px"
          boxShadow="0px 1.5px 16px rgba(0, 0, 0, 0.16)"
          zIndex={30}
        >
          <MenuItem {...MenuItemProps} onClick={handleHelp}>
            <HStack spacing="8px" align="center">
              <HelpIcon
                width="16px"
                height="16px"
                fill="currentColor"
              />
              <Box as="span">{t("ui.help")}</Box>
            </HStack>
          </MenuItem>
          <MenuItem {...MenuItemProps} onClick={handleLogout}>
            <HStack spacing="8px" align="center">
              <SignOutIcon
                width="16px"
                height="16px"
                fill="currentColor"
              />
              <Box as="span">{t("ui.signOut")}</Box>
            </HStack>
          </MenuItem>
        </MenuList>
      </Portal>
    </Menu>
  );
}

export default React.memo(UserMenu);
