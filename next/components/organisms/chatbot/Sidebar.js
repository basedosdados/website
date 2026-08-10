import React, { useCallback, useState } from 'react'
import {
  Box,
  Stack,
  Flex,
  Divider,
  HStack,
  useMediaQuery,
} from '@chakra-ui/react'
import BDLogoImage from '../../../public/img/logos/bd_logo'
import { clearClientSession } from '../../../utils'
import SidebarIcon from '../../../public/img/icons/sidebarIcon'
import CrossIcon from '../../../public/img/icons/crossIcon'
import BodyText from '../../atoms/Text/BodyText'
import SignOutIcon from '../../../public/img/icons/signOutIcon'
import ThreadList from './ThreadList'

function Sidebar({
  onNewChat,
  onSelectThread,
  currentThreadId,
  isMobileOpen = false,
  onMobileClose,
}) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isHovering, setIsHovering] = useState(false)
  const [isMobile] = useMediaQuery("(max-width: 767px)")

  const isOpen = isMobile ? true : isExpanded

  const handleLogout = useCallback(async () => {
    await clearClientSession()
    if (typeof window === 'undefined') return
    if (window.location.pathname.includes('/user/')) {
      window.location.href = '/'
      return
    }
    if (window.location.pathname.includes('/chatbot')) {
      window.location.href = '/user/login'
      return
    }
    window.location.reload()
  }, [])

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
          base: "min(296px, 85vw)",
          md: isExpanded ? "296px" : "50px",
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
        onMouseEnter={() => !isMobile && setIsHovering(true)}
        onMouseLeave={() => !isMobile && setIsHovering(false)}
      >
        <Flex
          direction="row"
          alignItems="center"
          flexShrink={0}
          padding={isOpen ? "16px 16px 24px" : "16px 8px 24px"}
          gap="12px"
        >
          <Box
            display={isOpen ? "block" : "none"}
            position="relative"
            left="-2px"
          >
            <BDLogoImage widthImage="58px" heightImage="25px" />
          </Box>

          {!isOpen && !isHovering && (
            <BDLogoImage
              display={{ base: "none", md: "block" }}
              widthImage="34px"
              heightImage="34px"
            />
          )}

          <Box
            cursor="pointer"
            display={{
              base: "flex",
              md: isExpanded || isHovering ? "flex" : "none",
            }}
            alignItems="center"
            justifyContent="center"
            width="34px"
            height="34px"
            borderRadius="8px"
            marginLeft="auto"
            flexShrink={0}
            _hover={{
              color: "#2B8C4D",
              fill: "#2B8C4D",
              backgroundColor: "#EEEEEE",
            }}
            onClick={handleToggle}
            aria-label={isMobile ? "Fechar menu" : isExpanded ? "Recolher menu" : "Expandir menu"}
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
          paddingX="8px"
          spacing={0}
          flexDirection="column"
        >
          <Box
            cursor="pointer"
            display="flex"
            alignItems="center"
            justifyContent={isOpen ? "flex-start" : "center"}
            flexShrink={0}
            width="100%"
            padding={isOpen ? "8px" : "8px 4px"}
            borderRadius="8px"
            gap={isOpen ? "10px" : "0"}
            color="#252A32"
            onClick={handleNewChat}
            sx={{
              "&:hover .new-chat-icon-surface": {
                backgroundColor: "#F4F4F4",
                borderColor: "#C8CACF",
              },
            }}
            _hover={{
              color: "#2B8C4D"
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
              Nova conversa
            </BodyText>
          </Box>
          <Box
            flex={1}
            minHeight={0}
            overflowY={isOpen ? "auto" : "hidden"}
            overflowX="hidden"
            sx={{
              "&::-webkit-scrollbar": { width: "4px" },
              "&::-webkit-scrollbar-track": { background: "transparent" },
              "&::-webkit-scrollbar-thumb": {
                background: "#C4C4C4",
                borderRadius: "24px",
              },
              scrollbarWidth: "thin",
              scrollbarColor: "#C4C4C4 transparent",
            }}
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
          <HStack
            as="button"
            type="button"
            spacing="8px"
            align="center"
            justifyContent={isOpen ? "flex-start" : "center"}
            width="100%"
            padding="16px"
            borderRadius="8px"
            cursor="pointer"
            background="transparent"
            border="none"
            color="#252A32"
            fill="#D0D0D0"
            onClick={handleLogout}
            _hover={{
              backgroundColor: "#EEEEEE",
              opacity: 0.9,
            }}
          >
            <SignOutIcon width="18px" height="18px" fill="currentColor" />
            <BodyText
              typography="small"
              color="currentColor"
              opacity={isOpen ? 1 : 0}
              width={isOpen ? "auto" : 0}
              overflow="hidden"
              whiteSpace="nowrap"
              transition="opacity 0.2s ease, width 0.2s ease"
            >
              Sair
            </BodyText>
          </HStack>
        </Box>
      </Box>
    </>
  );
}

export default React.memo(Sidebar);
