import Link from '../atoms/Link';
import { Tag } from '@chakra-ui/react';

export function ThemeTag({ slug, locale, ...props }) {
  return (
    <Tag
      position="relative"
      fontSize="10px"
      whiteSpace="nowrap"
      borderRadius="8px"
      padding="2px 8px"
      color="#252A32"
      backgroundColor="#DEDFE0"
      cursor="pointer"
      letterSpacing="0.2px"
      fontWeight="300"
      fontFamily="ubuntu"
      {...props}
    >
      <Link href={`/dataset?tag=${slug}`} locale={locale}>
        {slug}
      </Link>
    </Tag>
  );
}
