import React, { useCallback, useState } from 'react'
import {
  Box,
  Stack,
  Flex,
  Divider,
  HStack,
} from '@chakra-ui/react'
import cookies from 'js-cookie'
import BDLogoImage from '../../../public/img/logos/bd_logo'
import SidebarIcon from '../../../public/img/icons/sidebarIcon'
import CrossIcon from '../../../public/img/icons/crossIcon'
import BodyText from '../../atoms/Text/BodyText'
import SignOutIcon from '../../../public/img/icons/signOutIcon'
import ThreadList from './ThreadList'

function Sidebar({ onNewChat, onSelectThread, currentThreadId, isGenerating }) {
  const [isOpen, setIsOpen] = useState(true)
  const [isHovering, setIsHovering] = useState(false)

  const handleLogout = useCallback(() => {
    cookies.remove('userBD', { path: '/' })
    cookies.remove('token', { path: '/' })
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

  return (
    <Box
      as="aside"
      width={isOpen ? "296px" : "50px"}
      height="100vh"
      backgroundColor="#F7F7F7"
      transition="width 0.3s ease"
      overflow="hidden"
      display="flex"
      flexDirection="column"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
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
            md: isOpen || isHovering ? "flex" : "none",
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
          onClick={() => setIsOpen(!isOpen)}
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
          opacity={isGenerating ? 0.5 : 1}
          onClick={!isGenerating ? onNewChat : undefined}
          pointerEvents={isGenerating ? "none" : "auto"}
          sx={
            isGenerating
              ? undefined
              : {
                  '&:hover .new-chat-icon-surface': {
                    backgroundColor: '#F4F4F4',
                    borderColor: '#C8CACF',
                  },
                }
          }
          _hover={
            isGenerating
              ? undefined
              : {
                  color: '#2B8C4D',
                }
          }
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
            backgroundColor="#FFFFFF"
            border="1px solid #DEDFE0"
            transform="rotate(45deg)"
            color="inherit"
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
        <Box flex={1} minHeight={0} overflowY="auto" overflowX="hidden">
          <ThreadList
            onSelectThread={onSelectThread}
            currentThreadId={currentThreadId}
            isSidebarOpen={isOpen}
            isGenerating={isGenerating}
            onNewChat={onNewChat}
          />
        </Box>
      </Stack>
      <Box flexShrink={0} paddingBottom="8px">
        <Divider borderColor="#DEDFE0" />
        <Box padding="8px">
          <HStack
            as="button"
            type="button"
            spacing="8px"
            align="center"
            justifyContent={isOpen ? "flex-start" : "center"}
            width="100%"
            padding="8px"
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
    </Box>
  );
}

export default React.memo(Sidebar);
