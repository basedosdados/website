import {
  Image
} from "@chakra-ui/react";
import ImageDefault from "../../public/img/imageDefault";

export const ImageOrganization = ({title, image, ...props}) => {
  const settingsImage = {
    alt: title || "",
    borderRadius:"32px",
    boxShadow:"0px 4px 8px rgba(100, 96, 103, 0.16)",
    width:{ base: "25%", lg: "100%" },
    minWidth:"250px",
    maxWidth:"250px",
    minHeight:"250px",
    maxHeight:"250px",
    height:{ base: "25%", lg: "100%" },
    objectFit:"contain",
    widthImage:"100%",
    heightImage:"100%"
  }

  if(!image) return <ImageDefault {...settingsImage} {...props} overflow="hidden"/>

  return (
    <Image
      src={image.startsWith("https://") ? image : `https://basedosdados.org/uploads/group/${image}`}
      {...settingsImage}
      {...props}
    />
  )
}

