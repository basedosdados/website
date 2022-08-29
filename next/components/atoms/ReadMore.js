import {
  VStack,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import LinkDash from "./LinkDash";

export default function ReadMore({ children, textSize = 240 ,isMobileMod}) {
  const [isReadMore, setIsReadMore] = useState(true)
  const text = children

  useEffect(() => {
    if(text.length < textSize) setIsReadMore(false)
  }, [children])
  
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore)
  }

  return (
    <VStack width="100%" alignItems="flex-start">
      <Text
        fontFamily="Lato"
        fontSize={isMobileMod ? "14px" : "16px"}
        fontWeight="300"
        lineHeight="24px"
        letterSpacing="0.5px"
        color="#252A32"
      >
        {isReadMore ? text.slice(0, textSize)+"..." : text}
      </Text>

      {text.length > textSize && 
        <LinkDash onClick={toggleReadMore}>
          {isReadMore ? "Ler mais" : " Ler menos"}
        </LinkDash>
      }
    </VStack>
  )
}