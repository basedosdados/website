import { Tag } from "./Tag";

export function ThemeTag({ name }) {
  return (
    <a
      _hover={{ textDecoration: "underline !important" }}
      href={`/dataset?tag=${name}`}
    >
      <Tag
        position="relative"
        fontSize="10px"
        whiteSpace="nowrap"
        borderRadius="7px"
        padding="4px 6px"
        backgroundColor="#DEDFE0"
      >
        {name}
      </Tag>
    </a>
  );
}
