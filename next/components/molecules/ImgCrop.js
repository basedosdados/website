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
import ReactCrop from 'react-image-crop';
import { isMobileMod } from '../../hooks/useCheckMobile.hook';
import SectionTitle from '../atoms/SectionTitle';
import RoundedButton from '../atoms/RoundedButton';
import 'react-image-crop/dist/ReactCrop.css';

export default function CropImage ({
  isOpen,
  onClose,
  src,
}) {
  const imgRef = useRef(null)
  const blobUrlRef = useRef(null)
  const hiddenAnchorRef = useRef(null)

  const [completedCrop, setCompletedCrop] = useState()
  const [crop, setCrop] = useState()

  useEffect(() => {
    setCrop()
    setCompletedCrop()
  }, [!!isOpen])

  async function onDownloadCropClick() {
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

    const blob = await offscreen.convertToBlob({
      type: "image/png",
    })

    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }
    blobUrlRef.current = URL.createObjectURL(blob)
    hiddenAnchorRef.current.href = blobUrlRef.current
    hiddenAnchorRef.current.click()
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
                <img ref={imgRef} src={src}/>
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
              border="1px solid #FF8484"
              color="#FF8484"
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
              onClick={() => onDownloadCropClick()}
            >
              Salvar
            </RoundedButton>
            <a
              download
              ref={hiddenAnchorRef}
              style={{ display: 'none' }}
            >
              Hidden download
            </a>
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
