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
import { InfoIcon, SignOutIcon } from "./icons";
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

// Full name from the email's local part: "joao.silva@..." -> "Joao Silva",
// "joao@..." -> "Joao". Each dot/underscore/hyphen segment is capitalized.
function nameFromEmail(email) {
  const local = (email || "").split("@")[0];
  if (!local) return "";
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function UserMenu({ isSidebarOpen = true, onAbout, onMobileClose }) {
  const { t } = useTranslation("chatbot");
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getUserFromCookie());
  }, []);

  const email = user?.email || "";
  // Prefer the profile's real name; fall back to a name derived from the email
  // (then the raw email) only when both first and last name are missing.
  const fullName = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  const displayName = fullName || nameFromEmail(email) || email;
  const hasPicture = Boolean(user?.picture);
  const initial = (displayName || email).trim().charAt(0).toUpperCase() || "?";

  const handleLogout = useCallback(async () => {
    await clearClientSession();
    if (typeof window === "undefined") return;
    window.location.href = "/user/login";
  }, []);

  const handleAbout = useCallback(() => {
    onMobileClose?.();
    onAbout?.();
  }, [onAbout, onMobileClose]);

  return (
    <Menu
      placement="top-start"
      autoSelect={false}
      // Nudge the popover right by the avatar's left inset so it left-aligns
      // with the avatar rather than the full-width button edge.
      offset={[isSidebarOpen ? 16 : 8, 8]}
    >
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
        transition="background-color 0.2s ease"
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
            display="flex"
            alignItems="center"
            justifyContent="center"
            backgroundColor={hasPicture ? "#DEDFE0" : "#2B8C4D"}
            color="#FFFFFF"
          >
            {hasPicture ? (
              <Image
                alt=""
                width="100%"
                height="100%"
                objectFit="cover"
                src={user.picture}
                fallbackSrc={FallbackUserPicture}
              />
            ) : (
              <Box
                as="span"
                fontFamily="Roboto"
                fontSize="13px"
                fontWeight="600"
                lineHeight="1"
              >
                {initial}
              </Box>
            )}
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
          <MenuItem {...MenuItemProps} onClick={handleAbout}>
            <HStack spacing="8px" align="center">
              <InfoIcon
                width="16px"
                height="16px"
                fill="currentColor"
              />
              <Box as="span">{t("ui.learnMore")}</Box>
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
