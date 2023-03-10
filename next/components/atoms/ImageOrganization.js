import {
  Image
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import ImageDefault from "../../public/img/imageDefault";

export const ImageOrganization = ({title, image}) => {
  const [urlImage, setUrlImage] = useState("")

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
  }

  useEffect(() => {
    if(!image) return 
    image.startsWith("https://") ? setUrlImage(image) : setUrlImage("https://basedosdados.org/uploads/group/" + image)
  },[])

  if(!urlImage) return <ImageDefault {...settingsImage} overflow="hidden"/>

  return (
    <Image
      src={urlImage}
      {...settingsImage}
    />
  )
}

