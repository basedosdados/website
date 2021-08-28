import { Tag } from "./Tag";

export function ThemeTag({ name }) {
  return (
    <a
      _hover={{ textDecoration: "underline !important" }}
      href={`/search?tag=${name}`}
    >
      <Tag
        position="relative"
        zIndex="10"
        padding="5px 10px"
        minWidth="40px"
        backgroundColor="#DEDFE0"
        color="#252A32"
        whiteSpace="nowrap"
      >
        {name}
      </Tag>
    </a>
  );
}
