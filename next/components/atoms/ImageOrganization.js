import {
  Image
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

export const ImageOrganization = ({title, image}) => {
  const [urlImage, setUrlImage] = useState("")

  useEffect(() => {
    if(!image) return setUrlImage("https://basedosdados-static.s3.us-east-2.amazonaws.com/equipe/sem_foto.png")
    image.startsWith("https://") ? setUrlImage(image) : setUrlImage("https://basedosdados.org/uploads/group/" + image)
  },[])

  return (
    <Image
      alt={title || ""}
      borderRadius="32px"
      boxShadow="0px 4px 8px rgba(100, 96, 103, 0.16)"
      width={{ base: "25%", lg: "100%" }}
      minWidth="250px"
      maxWidth="250px"
      minHeight="250px"
      maxHeight="250px"
      height={{ base: "25%", lg: "100%" }}
      objectFit="contain"
      src={urlImage}
    />
  )
}

