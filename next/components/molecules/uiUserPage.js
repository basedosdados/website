import {
  Text,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Skeleton,
} from "@chakra-ui/react";
import { isMobileMod } from "../../hooks/useCheckMobile.hook";

export function LabelTextForm ({ text, ...props }) {
  return (
    <FormLabel
      color="#252A32"
      fontFamily="ubuntu"
      letterSpacing="0.2px"
      fontSize="16px"
      fontWeight="400"
      lineHeight="16px"
      {...props}
    >{text}</FormLabel>
  )
}

export function TitleTextForm ({ children, ...props }) {
  return (
    <Text
      color="#252A32"
      fontFamily="ubuntu"
      letterSpacing="0.2px"
      fontSize="16px"
      fontWeight="400"
      lineHeight="16px"
      marginBottom="8px"
      {...props}
    >{children}</Text>
  )
}

export  function SkStack ({ isLoaded, children, ...props }) {
  return (
    <Skeleton
      height="40px"
      width="100%"
      borderRadius="12px"
      startColor="#F0F0F0"
      endColor="#F3F3F3"
      isLoaded={isLoaded}
      fadeDuration={2}
      {...props}
    >
      {children}
    </Skeleton>
  )
}

export function ExtraInfoTextForm ({children, ...props}) {
  return (
    <Text
      color="#7D7D7D"
      fontFamily="ubuntu"
      letterSpacing="0.3px"
      fontSize="12px"
      fontWeight="400"
      lineHeight="16px"
      {...props}
    >{children}</Text>
  )
}

export function ModalGeneral ({
  children,
  isOpen,
  onClose,
  isCentered = true,
  propsModal,
  propsModalContent,
  classNameBody
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered={isCentered}
      margin="24px !important"
      {...propsModal}
    >
      <ModalOverlay/>
      <ModalContent
        margin="24px"
        minWidth={isMobileMod() ? "auto" : "536px"}
        boxSizing="content-box"
        padding="32px"
        borderRadius="20px"
        {...propsModalContent}
      >
        <ModalHeader padding="0">
          {children[0]}
        </ModalHeader>

        <ModalBody padding="0" className={classNameBody}>
          {children[1]}
        </ModalBody>

        <ModalFooter padding="0" width={isMobileMod() ? "100%" : "auto"}>
          {children[2]}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
