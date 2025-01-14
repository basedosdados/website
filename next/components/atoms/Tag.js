import { Tag, TagLabel, TagCloseButton } from "@chakra-ui/react";

export function TagFilter({text, handleClick}) {
  return (
    <Tag
      minWidth="fit-content"
      padding="8px 12px"
      border="1px solid #DEDFE0"
      backgroundColor="#FFF"
      borderRadius="100px"
      fontFamily="Roboto"
      fontWeight="500"
      fontSize="12px"
      lineHeight="18px"
      letterSpacing="0.1px"
      color="#464A51"
    >
      <TagLabel>{text}</TagLabel>
      <TagCloseButton
        opacity={1}
        _focus={{
          outline: 'none',
          boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.2)'
        }}
        color="#464A51"
        onClick={() => handleClick()}
      />
    </Tag>
  )
}