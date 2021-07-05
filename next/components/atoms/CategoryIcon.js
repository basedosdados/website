import { Image } from "@chakra-ui/image";

export function CategoryIcon({ url, active }) {
  return <Image width="50px" height="50px" border="0px" src={url} />;
}
