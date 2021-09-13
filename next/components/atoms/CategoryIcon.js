import { Image } from "@chakra-ui/react";

export function CategoryIcon({ url, active, size = "50px", ...style }) {
  return (
    <Image
      width={size}
      height={size}
      priority={true}
      border="0px"
      src={url}
      {...style}
    />
  );
}
