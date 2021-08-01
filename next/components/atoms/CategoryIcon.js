import Image from "next/image";

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
