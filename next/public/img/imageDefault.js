import { Icon, Box } from '@chakra-ui/react'

const ImageDefault = ({widthImage = "250px", heightImage="250px", ...style}) => (
  <Box 
    display="flex"
    alignItems="center"
    justifyItems="center"
    position="relative"
    borderRadius="16px"
    {...style}
  >
    <Icon
      alt="apoiador database"
      viewBox='0 0 250 250'
      width={widthImage}
      height={heightImage}
    >
      <rect width="250" height="250" fill="#F0F0F0"/>
      <path d="M50.24 53C33.5389 53 20 66.5389 20 83.24C20 99.9411 33.5389 113.48 50.24 113.48C66.9411 113.48 80.48 99.9411 80.48 83.24C80.48 66.5389 66.9411 53 50.24 53ZM22.32 196.56H229.68V136.08L182.422 88.8219C179.891 86.2915 175.789 86.2915 173.258 88.8219L100.08 162L70.1019 132.022C67.5715 129.491 63.4685 129.491 60.9376 132.022L22.32 170.64V196.56Z" fill="#BCBCBC"/>
    </Icon>
  </Box>
)

export default ImageDefault