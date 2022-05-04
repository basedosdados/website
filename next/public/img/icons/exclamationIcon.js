import { Icon, Box } from '@chakra-ui/react'

const ExclamationIcon = ({widthIcon, heightIcon ,fill ,...style}) => (
  <Box 
    display="flex"
    alignItems="center"
    justifyItems="center"
    position="relative"
    {...style}
  >
    <Icon
      viewBox="0 0 20 20"
      width={widthIcon}
      height={heightIcon}
    >
      <circle cx="10" cy="10" r="10" fill={fill}/>
      <line x1="10.1997" y1="11" x2="10.1997" y2="5" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <circle cx="10.2" cy="14.7996" r="1.2" fill="white"/>
    </Icon>
  </Box>
)

export default ExclamationIcon