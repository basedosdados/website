import {
  VStack,
  Stack
} from "@chakra-ui/react";
import { InputForm } from "../../molecules/uiUserPage";
import BodyText from "../../atoms/Text/BodyText";
import SendIcon from "../../../public/img/icons/sendIcon";

export default function Search() {
  return (
    <Stack
      width="100%"
      maxWidth="600px"
      margin="auto auto 0"
      spacing="8px"
    >
      <InputForm
        placeholder="Faça sua pergunta"
        width="100%"
        height="48px"
        borderRadius="8px"
        fontSize="14px"
        color="#71757A"
        fill="#71757A"
        backgroundColor="#F7F7F7"
        _placeholder={{
          color: "#71757A",
          fontSize: "14px"
        }}
        icon={
          <SendIcon 
            cursor="pointer"
            width="18px"
            height="18px"
            fill="#71757A"
            _hover={{
              fill: "#2B8C4D"
            }}
          />
        }
      />
      <VStack
        display={{base: "inline", md: "flex"}}
        spacing={0}
      >
        <BodyText
          display="inline"
          typography="small"
          color="#ACAEB1"
        >
          O chatbot pode cometer erros. Considere verificar informações importantes.
        </BodyText>
        <BodyText
          display="inline"
          typography="small"
          color="#ACAEB1"
        >
          Todas as informações aqui enviadas são registradas para análise e melhoria do produto.
        </BodyText>
      </VStack>
    </Stack>
  )
}
