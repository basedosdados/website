import { Button } from "@chakra-ui/button";
import { Flex, VStack } from "@chakra-ui/layout";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import Link from "../atoms/Link";
import Title from "../atoms/Title";
import UserContext from "../../context/user";

export function BaseResourcePage({
  title,
  children,
  onClick,
  buttonText,
  buttonRightIcon = <></>,
}) {
  const userData = useContext(UserContext);
  return (
    <VStack
      width="100%"
      border="1px solid #DEDFE0"
      borderRadius="20px"
      padding="20px"
      alignItems="flex-start"
      spacing={7}
    >
      <Flex
        flexDirection={{ base: "column", lg: "row" }}
        width="100%"
        alignItems={{ base: "flex-start", lg: "flex-start" }}
      >
        <Title wordBreak="break-all">{title}</Title>
        {userData?.is_admin && onClick ? (
          <Button
            marginLeft={{ base: null, lg: "auto" }}
            colorScheme="blue"
            backgroundColor="#3AA1EB"
            marginTop={{ base: "20px", lg: "0px" }}
            height="35px"
            borderRadius="13px"
            fontFamily="Lato"
            alignContent="center"
            justifyContent="center"
            letterSpacing="0.1em"
            boxShadow="0px 4px 4px 0px #00000040"
            rightIcon={buttonRightIcon}
            onClick={onClick}
          >
            {buttonText}
          </Button>
        ) : (
          <></>
        )}
      </Flex>
      {children}
    </VStack>
  );
}
