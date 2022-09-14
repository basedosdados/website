import { Tag, TagLabel, TagCloseButton } from "@chakra-ui/react";

export default function TagBase({
  text,
  handleClick,
  fontWeight = "400",
  fontSize = "12px",
  ...style
}) {
  return (
    <Tag
      backgroundColor="#2B8C4D"
      color="white"
      borderRadius="8px"
      padding="2px 8px"
      letterSpacing="0.5px"
      cursor="pointer"
      fontSize={fontSize}
      fontFamily="ubuntu"
      fontWeight={fontWeight}
      {...style}
    >
      <TagLabel>{text}</TagLabel>
      <TagCloseButton onClick={() => handleClick()}/>
    </Tag>
  )
}
