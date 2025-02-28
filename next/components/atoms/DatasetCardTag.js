import Link from "./Link";
import { Tag } from "@chakra-ui/react";

export function DatasetCardTag({ slug, name, locale, ...props }) {
  return (
    <Tag
      borderRadius="100px"
      padding="8px 12px"
      border="1px solid #DEDFE0"
      backgroundColor="#FFFFFF"
      cursor="pointer"
    >
      <Link
        href={`/search?tag=${slug}`}
        locale={locale}
        fontWeight="500"
        fontSize="12px"
        lineHeight="18px"
        letterSpacing="0.1px"
        color="#464A51"
        position="relative"
        whiteSpace="nowrap"
        {...props}
      >
        {name}
      </Link>
    </Tag>
  );
}
