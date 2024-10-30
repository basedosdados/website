import Link from './Link';
import { Tag } from '@chakra-ui/react';

export function DatasetCardTag({ slug, name, locale, ...props }) {
  return (
    <Tag
      borderRadius="8px"
      padding="2px 8px"
      backgroundColor="#DEDFE0"
      cursor="pointer"
    >
      <Link
        href={`/search?tag=${slug}`}
        locale={locale}
        fontWeight="300"
        fontFamily="ubuntu"
        fontSize="10px"
        color="#252A32"
        letterSpacing="0.2px"
        position="relative"
        whiteSpace="nowrap"
        {...props}
      >
        {name}
      </Link>
    </Tag>
  );
}
