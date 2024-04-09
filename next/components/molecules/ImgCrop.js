import {
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton
} from '@chakra-ui/react';
import { useState, useEffect, useRef } from 'react';
import ReactCrop, {
  centerCrop,
  makeAspectCrop
} from 'react-image-crop';
import cookies from 'js-cookie';
import { isMobileMod } from '../../hooks/useCheckMobile.hook';

import updatePictureProfile from '../../pages/api/user/updatePictureProfile'

import SectionTitle from '../atoms/SectionTitle';
import RoundedButton from '../atoms/RoundedButton';
import 'react-image-crop/dist/ReactCrop.css';
import styles from "../../styles/imgCrop.module.css";

export default function CropImage ({
  isOpen,
  onClose,
  src,
  id,
  username,
  email
}) {
  const imgRef = useRef(null)
  const [completedCrop, setCompletedCrop] = useState()
  const [crop, setCrop] = useState()

  function onImageLoad(e) {
    const { naturalWidth: width, naturalHeight: height } = e.currentTarget
  
    const nCrop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        1 / 1,
        width,
        height
      ),
      width,
      height
    )
  
    setCrop(nCrop)
  }

  useEffect(() => {
    setCompletedCrop()
  }, [!!isOpen])

  async function handlerUpdatePicture() {
    const image = imgRef.current

    if (!image || !completedCrop) return null

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
    )

    const ctx = offscreen.getContext("2d")

    if (!ctx) {
      throw new Error("No 2d context")
    }

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      offscreen.width,
      offscreen.height,
    )

    const maxSizeKB = 1000
    let quality = 1.0
    const maxIterations = 10

    for (let i = 0; i < maxIterations; i++) {
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = offscreen.width
      tempCanvas.height = offscreen.height
      const tempCtx = tempCanvas.getContext('2d')
      tempCtx.drawImage(offscreen, 0, 0)

      const compressedDataUrl = tempCanvas.toDataURL("image/jpeg", quality)
      const sizeKB = compressedDataUrl.length / 1024

      if (sizeKB <= maxSizeKB) {
        break;
      }

      quality -= 0.1
    }

    const picture = await new Promise((resolve) => {
      offscreen.convertToBlob({
        type: "image/jpeg",
        quality
      }).then((pic) => {
        resolve(pic)
      })
    })

    const filePic = new File([picture], `${username}.jpeg`, {type: "image/jpeg"})

    const reg = new RegExp("(?<=:).*")
    const [ uid ] = reg.exec(id)

    const res = await updatePictureProfile(uid, filePic)
    if(res?.status === 200) {
      const userData = await fetch(`/api/user/getUser?p=${btoa(email)}`, { method: "GET" })
        .then(res => res.json())
      cookies.set('userBD', JSON.stringify(userData))
      window.location.reload()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      margin="24px !important"
    >
      <ModalOverlay/>
      <ModalContent
        margin="24px"
        minWidth={isMobileMod() ? "" : "536px"}
        boxSizing="content-box"
        padding="32px"
        borderRadius="20px"
      >
        <ModalHeader padding="0">
          <Stack>
            <SectionTitle
              lineHeight="40px"
            >Corte sua nova foto de perfil</SectionTitle>
            <ModalCloseButton
              display={isMobileMod() ? "none" : "flex"}
              fontSize="14px"
              top="24px"
              right="26px"
              _hover={{backgroundColor: "transparent", color:"#42B0FF"}}
              onClick={onClose}
            />
          </Stack>
        </ModalHeader>

        <ModalBody padding="0">
          <Stack
            className={styles.containerImageCroped}
            margin="24px 0"
            overflow="hidden"
          >
            {!!src &&
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1 / 1}
                keepSelection={true}
                circularCrop
              >
                <img ref={imgRef} src={src} onLoad={onImageLoad}/>
              </ReactCrop>
            }
          </Stack>
        </ModalBody>

        <ModalFooter padding="0" width={isMobileMod() ? "100%" : "auto"}>
          <Stack
            flexDirection={isMobileMod() ? "column" : "row"}
            spacing={0}
            gap="24px"
            width={isMobileMod() ? "100%" : "fit-content"}
          >
            <RoundedButton
              borderRadius="30px"
              backgroundColor="#FFF"
              border="1px solid #42B0FF"
              color="#42B0FF"
              width={isMobileMod() ? "100%" : "fit-content"}
              _hover={{transform: "none", opacity: 0.8}}
              onClick={onClose}
            >
              Cancelar
            </RoundedButton>
            <RoundedButton
              marginTop="16px"
              borderRadius="30px"
              _hover={{transform: "none", opacity: 0.8}}
              onClick={() => handlerUpdatePicture()}
            >
              Salvar
            </RoundedButton>
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
