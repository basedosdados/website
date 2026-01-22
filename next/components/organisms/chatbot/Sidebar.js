import { useState } from 'react'
import {
  Box,
  Stack,
  VStack,
  Flex,
} from '@chakra-ui/react'
import BDLogoImage from '../../../public/img/logos/bd_logo'
import SidebarIcon from '../../../public/img/icons/sidebarIcon'
import BodyText from '../../atoms/Text/BodyText'
import PenSquareIcon from '../../../public/img/icons/penSquareIcon'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const [isHovering, setIsHovering] = useState(false)

  return (
    <Box
      as="aside"
      width={isOpen ? "260px" : "50px"}
      height="100vh"
      backgroundColor="#F7F7F7"
      transition="width 0.3s ease"
      overflow="hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <VStack
        align="stretch"
        height="100%"
        spacing={0}
      >
        <Flex
          direction="row"
          alignItems="center"
          padding={isOpen ? "16px 16px 24px" : "16px 8px 24px"}
          gap="12px"
        >
          <Box
            display={isOpen ? "block" : "none"}
            position="relative"
            left="-2px"
          >
            <BDLogoImage
              widthImage="58px"
              heightImage="25px"
            />
          </Box>

          {!isOpen && !isHovering && (
            <BDLogoImage
              display={{base: "none", md: "block"}}
              widthImage="34px"
              heightImage="34px"
            />
          )}

          <Box
            cursor="pointer"
            display={{base: "flex", md: (isOpen || isHovering) ? "flex" : "none"}}
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
              backgroundColor: "#EEEEEE"
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
          paddingX="8px"
          spacing={0}
        >
          <Box
            cursor="pointer"
            display="flex"
            alignItems="center"
            justifyContent="flex-start"
            padding="8px"
            borderRadius="8px"
            gap={isOpen ? "4px" : "0"}
            _hover={{
              color: "#2B8C4D",
              fill: "#2B8C4D",
              backgroundColor: "#EEEEEE"
            }}
          >
            <PenSquareIcon
              width="18px"
              height="18px"
            />
            <BodyText
              typography="small"
              color="currentColor"
              whiteSpace="nowrap"
              height="18px"
              lineHeight="18px"
              width={isOpen ? "auto" : "0"}
              opacity={isOpen ? 1 : 0}
              transition="opacity 0.2s ease, transform 0.2s ease, width 0.2s ease"
              transform={isOpen ? "translateX(0)" : "translateX(4px)"}
            >
              Nova conversa
            </BodyText>
          </Box>
        </Stack>
      </VStack>
    </Box>
  )
}
