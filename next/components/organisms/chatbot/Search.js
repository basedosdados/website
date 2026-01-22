import {
  Stack
} from "@chakra-ui/react";
import { InputForm } from "../../molecules/uiUserPage";
import BodyText from "../../atoms/Text/BodyText";
import SearchIcon from "../../../public/img/icons/searchIcon";

export default function Search() {
  return (
    <Stack
      width="100%"
      maxWidth="600px"
      margin="auto auto 0"
      spacing={0}
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
          <SearchIcon 
            width="24px"
            height="24px"
            fill="#71757A"
            _hover={{
              fill: "#2B8C4D"
            }}
          />
        }
      />
      <BodyText
        typography="small"
        color="#71757A"
      >
        O chatbot pode cometer erros. Considere verificar informações importantes.
        Todas as informações aqui enviadas são registradas para análise e melhoria do produto.
      </BodyText>
    </Stack>
  )
}
