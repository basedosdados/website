import React, { useCallback, useState } from 'react'
import {
  Box,
  Stack,
  Flex,
  Divider,
  useMediaQuery,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import BrandLogo from './BrandLogo'
import { SidebarIcon, CrossIcon } from "./icons"
import BodyText from '../../atoms/Text/BodyText'
import ThreadList from './ThreadList'
import UserMenu from './UserMenu'

function Sidebar({
  onNewChat,
  onSelectThread,
  onAbout,
  currentThreadId,
  isMobileOpen = false,
  onMobileClose,
}) {
  const { t } = useTranslation('chatbot')
  const [isExpanded, setIsExpanded] = useState(true)
  const [isMobile] = useMediaQuery("(max-width: 767px)")

  const isOpen = isMobile ? true : isExpanded

  const handleToggle = useCallback(() => {
    if (isMobile) {
      onMobileClose?.()
      return
    }
    setIsExpanded((prev) => !prev)
  }, [isMobile, onMobileClose])

  const handleNewChat = useCallback(() => {
    onNewChat?.()
    if (isMobile) onMobileClose?.()
  }, [onNewChat, isMobile, onMobileClose])

  const handleSelectThread = useCallback((thread) => {
    onSelectThread?.(thread)
    if (isMobile) onMobileClose?.()
  }, [onSelectThread, isMobile, onMobileClose])

  return (
    <>
      <Box
        display={{ base: isMobileOpen ? "block" : "none", md: "none" }}
        position="fixed"
        inset={0}
        backgroundColor="rgba(0, 0, 0, 0.4)"
        zIndex={19}
        onClick={onMobileClose}
        aria-hidden
      />

      <Box
        as="aside"
        position={{ base: "fixed", md: "relative" }}
        top={0}
        left={0}
        zIndex={{ base: 20, md: "auto" }}
        width={{
          base: "min(288px, 85vw)",
          md: isExpanded ? "288px" : "50px",
        }}
        height="100dvh"
        maxHeight="100vh"
        backgroundColor="#F7F7F7"
        transform={{
          base: isMobileOpen ? "translateX(0)" : "translateX(-105%)",
          md: "none",
        }}
        transition="width 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease"
        overflow="hidden"
        display="flex"
        flexDirection="column"
        flexShrink={0}
        pointerEvents={{
          base: isMobileOpen ? "auto" : "none",
          md: "auto",
        }}
        boxShadow={{
          base: isMobileOpen ? "0 0 24px rgba(0, 0, 0, 0.16)" : "none",
          md: "none",
        }}
      >
        <Flex
          direction="row"
          alignItems="center"
          flexShrink={0}
          padding={isOpen ? "16px 16px 24px" : "16px 8px 24px"}
          gap="12px"
        >
          <Box
            as="a"
            href="https://basedosdados.org/"
            aria-label="Base dos Dados"
            cursor="pointer"
            display={isOpen ? "block" : "none"}
            position="relative"
            left="-2px"
          >
            <BrandLogo widthImage="58px" heightImage="25px" />
          </Box>

          <Box
            cursor="pointer"
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="34px"
            height="34px"
            borderRadius="8px"
            marginLeft="auto"
            flexShrink={0}
            _hover={{
              backgroundColor: "#EEEEEE",
            }}
            onClick={handleToggle}
            aria-label={isMobile ? t("ui.sidebar.closeMenu") : isExpanded ? t("ui.sidebar.collapseMenu") : t("ui.sidebar.expandMenu")}
          >
            <SidebarIcon
              width="18px"
              height="18px"
              transition="transform 0.5s ease-in-out"
            />
          </Box>
        </Flex>
        <Stack
          flex={1}
          minHeight={0}
          overflow="hidden"
          spacing={0}
          flexDirection="column"
        >
          <Box
            cursor="pointer"
            display="flex"
            alignItems="center"
            justifyContent={isOpen ? "flex-start" : "center"}
            flexShrink={0}
            alignSelf="stretch"
            marginX="8px"
            padding={isOpen ? "8px" : "8px 4px"}
            borderRadius="8px"
            gap={isOpen ? "10px" : "0"}
            color="#252A32"
            transition="background-color 0.2s ease"
            onClick={handleNewChat}
            _hover={{
              // Row fills grey on hover; the plus circle keeps its own (darker)
              // #DEDFE0 so it stays visible against the row instead of merging.
              backgroundColor: "#EEEEEE",
            }}
          >
            <Box
              className="new-chat-icon-surface"
              flexShrink={0}
              width="24px"
              height="24px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="50%"
              backgroundColor="#DEDFE0"
              border="1px solid #DEDFE0"
              transform="rotate(45deg)"
              transition="background-color 0.2s ease, border-color 0.2s ease"
            >
              <CrossIcon
                width="12px"
                height="12px"
                fill="currentColor"
                aria-hidden
              />
            </Box>
            <BodyText
              typography="small"
              color="currentColor"
              whiteSpace="nowrap"
              height="18px"
              lineHeight="18px"
              opacity={isOpen ? 1 : 0}
              width={isOpen ? "auto" : 0}
              minWidth={0}
              overflow="hidden"
              transition="opacity 0.2s ease, transform 0.2s ease, width 0.2s ease"
              transform={isOpen ? "translateX(0)" : "translateX(4px)"}
            >
              {t("ui.newChat")}
            </BodyText>
          </Box>
          <Box
            flex={1}
            minHeight={0}
            display="flex"
            flexDirection="column"
            overflow="hidden"
          >
            <ThreadList
              onSelectThread={handleSelectThread}
              currentThreadId={currentThreadId}
              isSidebarOpen={isOpen}
              onNewChat={handleNewChat}
            />
          </Box>
        </Stack>
        <Box flexShrink={0}>
          <Divider borderColor="#DEDFE0" />
          <UserMenu
            isSidebarOpen={isOpen}
            onAbout={onAbout}
            onMobileClose={onMobileClose}
          />
        </Box>
      </Box>
    </>
  );
}

export default React.memo(Sidebar);
