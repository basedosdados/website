import {
  Flex,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from 'next-i18next';
import BodyText from "./Text/BodyText";

export default function ReadMore({ children, id, ...props}) {
  const [isReadMore, setIsReadMore] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const textRef = useRef(null)
  const { t } = useTranslation('dataset');

  const modifiedChildren = `
    ${children.trim()}

    <span
      id="${id}"
      style="
        cursor: pointer;
        color: #0068C5;
        font-family: Roboto;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        background-color: #FFF;
        margin-left: 4px;
      "
      onmouseover="this.style.color='#0057A4'"
      onmouseout="this.style.color='#0068C5'"
    >${t('readLess')}</span>`

  useEffect(() => {
    if (textRef.current) {
      const { clientHeight, scrollHeight } = textRef.current
      setIsOverflowing(scrollHeight > clientHeight)
    }
  }, [children])

  useEffect(() => {
    const readLess = document.getElementById(id)
    if (readLess) readLess.addEventListener('click', toggleReadMore)
    return () => { if (readLess) readLess.removeEventListener('click', toggleReadMore)}
  }, [isReadMore])

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore)
  }

  return (
    <Flex position="relative" {...props} >
      <Text
        ref={textRef}
        display="-webkit-box"
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace={isReadMore ? "break-spaces" : "normal"}
        sx={{
          WebkitLineClamp: isReadMore ? "unset" : 3,
          WebkitBoxOrient: "vertical",
        }}
        fontFamily="Roboto"
        fontSize="14px"
        fontWeight="400"
        lineHeight="20px"
        color="#464A51"
      >
        {isOverflowing ?
          <span dangerouslySetInnerHTML={{ __html: modifiedChildren.trim() }}/>
          :
          children
        }
      </Text>
      {isOverflowing &&
        <BodyText
          typography="small"
          display={isReadMore ? "none" : "flex"}
          onClick={toggleReadMore}
          cursor="pointer"
          _hover={{color: "#0057A4"}}
          color="#0068C5"
          backgroundColor="#FFF"
          position="absolute"
          bottom="0"
          right="0"
        >
          <Text as="span" color="#464A51" marginRight="4px">...</Text>{t('readMore')}
        </BodyText>
      }
    </Flex>
  )
}
