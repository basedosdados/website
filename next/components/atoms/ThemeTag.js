import { Tag } from "./Tag";

export function ThemeTag({ name }) {
  return (
    <a
      href={`/dataset?tag=${name}`}
    >
      <Tag
        position="relative"
        fontSize="10px"
        whiteSpace="nowrap"
        borderRadius="7px"
        padding="5px 6px"
        color="#252A32"
        backgroundColor="#DEDFE0"
      >
        {name}
      </Tag>
    </a>
  );
}
