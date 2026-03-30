import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Stack,
  Collapse,
  Divider,
} from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";

import LabelText from "../atoms/Text/LabelText";
import CrossIcon from "../../public/img/icons/crossIcon";
import styles from "../../styles/faq.module.css";

export default function QuestionsBox({ question, answer, id, active }) {
  const [isActive, setIsActive] = useState(false)
  const router = useRouter()

  const scrollFocus = (idElement) => {
    const el = document.getElementById(idElement)
    if (!el) return;
    const targetElement = el.getBoundingClientRect()
    const heightScreen = window.innerHeight
    const positionTarget = targetElement.top

    window.scrollTo(0, positionTarget - (heightScreen/2))
  }

  useEffect(() => {
    setIsActive(false)
  },[active])

  useEffect(() => {
    if(router.asPath.split('#')[1] === id) return setIsActive(true)
  },[id, router.asPath])

  useEffect(() => {
    if(router.asPath.split('#')[1] === id) return scrollFocus(id)
  },[isActive, router.asPath])

  const OpenCloseQuestion = () => {
    setIsActive(!isActive)
  }

  return (
    <Stack
      spacing={0}
      className={styles.questionContainer}
    >
      <Box
        display="flex"
        cursor="pointer"
        paddingBottom="24px"
        gap="20px"
        alignItems="center"
        justifyContent="space-between"
        _hover={{
          opacity: 0.8
        }}
        transition="opacity 0.2s ease"
        onClick={() => OpenCloseQuestion()}
      >
        <LabelText typography="x-large">
          {question}
        </LabelText>
        <CrossIcon
          alt={isActive ? "fecha pergunta" : "abrir pergunta"}
          color="#252A32"
          transform={!isActive ? "rotate(45deg)" : "none"}
          width="20px"
          height="20px"
        />
      </Box>
      <Collapse in={isActive} animateOpacity>
        <Box
          id={id}
          as="div"
          height={isActive ? "100%" : "0"}
          marginBottom={isActive ? "32px !important" : undefined}
          overflow="hidden"
          transition="all 1s ease"
          fontFamily="Roboto"
          color="#464A51"
          fontSize="18px"
          lineHeight="28px"
          fontWeight="400"
        >
          <ReactMarkdown>{answer}</ReactMarkdown>
        </Box>
      </Collapse>
      <Divider borderColor="#DEDFE0"/>
    </Stack>
  )
}
