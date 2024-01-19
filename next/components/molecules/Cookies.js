import { 
  Box,
  Text,
  CloseButton, 
  HStack
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import cookies from "js-cookie";
import RoundedButton from "../atoms/RoundedButton";
import Link from "../atoms/Link";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";

export default function ConfirmCookies() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const res = cookies.get("cookieAccepted")

    if(res === undefined) setIsOpen(true)
  }, [])

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleConfirm = () => {
    cookies.set("cookieAccepted", "true",{ expires: 366 })
    setIsOpen(false)
  }

  if(!isOpen) return null

  return (
    <Box
      bottom={0}
      left={0}
      position="fixed"
      margin={useCheckMobile() ? "0 auto" :"0 0 40px 40px"}
      zIndex={10000}
      backgroundColor="#FFF"
      maxWidth="400px"
      boxShadow="0 1.6px 16px 0 rgba(100, 96, 103, 0.16)"
      padding="16px"
      borderRadius="30px"
    >
      <HStack spacing={0} marginBottom="16px" justifyContent="space-between">
        <Text
          width="fit-content"
          fontFamily="Ubuntu"
          fontSize="18px"
          lineHeight="40px"
          fontWeight="500"
          color="#252A32"
        >Nossos Cookies</Text>

        <CloseButton
          _hover={{backgroundColor: "transparent", color:"#42B0FF"}}
          onClick={() => handleClose()}
        />
      </HStack>

      <Text
        fontFamily="ubuntu"
        marginBottom="8px"
        color="#252A42"
      >
        Os cookies são essenciais para a funcionalidade completa de nossa plataforma. Ao continuar, você concorda com o uso desses cookies para garantir uma experiência de usuário eficaz. Veja mais sobre nossas <Link color="#42B0FF" href="/termos-e-privacidade" target="_blank">Política de Cookies</Link>
      </Text>

      <Box width="100%" display="flex" >
        <RoundedButton
          borderRadius="30px"
          width={useCheckMobile() ? "100%" : "fit-content"}
          _hover={{transform: "none", opacity: 0.8}}
          onClick={() => handleConfirm()}
          marginLeft="auto"
        >
          Concordo
        </RoundedButton>
      </Box>
    </Box>
  )
}
