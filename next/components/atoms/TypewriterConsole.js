import { useState, useEffect, useRef } from "react";
import { Flex, Box } from "@chakra-ui/react";
import ArrowIcon from "../../public/img/icons/arrowIcon";
import Button from "../atoms/Button";
import styles from "../../styles/typewriterConsole.module.css";

export default function TypewriterConsole({
  messages = [],
  typingSpeed = 45,
  deletingSpeed = 25,
  pauseDuration = 2000,
  maxWidth = "600px",
  textBtn="",
  onClickBtn=() => {},
  isVariantBtn=false,
  targetBtn="_self",
  propsBtn={},
}) {
  const [displayText, setDisplayText] = useState("");
  const messageIndexRef = useRef(0);
  const isDeletingRef = useRef(false);
  const charIndexRef = useRef(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!messages.length) return;

    const tick = () => {
      const currentMessage = messages[messageIndexRef.current];
      const isDeleting = isDeletingRef.current;

      if (!isDeleting) {
        if (charIndexRef.current < currentMessage.length) {
          charIndexRef.current += 1;
          setDisplayText(currentMessage.slice(0, charIndexRef.current));
          timeoutRef.current = setTimeout(tick, typingSpeed);
        } else {
          timeoutRef.current = setTimeout(() => {
            isDeletingRef.current = true;
            tick();
          }, pauseDuration);
        }
      } else if (charIndexRef.current > 0) {
        charIndexRef.current -= 1;
        setDisplayText(currentMessage.slice(0, charIndexRef.current));
        timeoutRef.current = setTimeout(tick, deletingSpeed);
      } else {
        isDeletingRef.current = false;
        messageIndexRef.current = (messageIndexRef.current + 1) % messages.length;
        timeoutRef.current = setTimeout(tick, typingSpeed);
      }
    };

    timeoutRef.current = setTimeout(tick, typingSpeed);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [messages, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <Flex className={styles.console} maxWidth={maxWidth} aria-hidden="true">
      <Box className={styles.text}>
        {displayText}
        <span className={styles.cursor} />
      </Box>
      <Button
        target={targetBtn}
        onClick={onClickBtn}
        isVariant={isVariantBtn}
        position="absolute"
        bottom="24px"
        right="24px"
        marginLeft="8px"
        color="#FFFFFF"
        fill="#FFFFFF"
        {...propsBtn}
      >
        {textBtn}
        <ArrowIcon width="18px" height="18px" fill="currentColor" />
      </Button>
    </Flex>
  );
}
