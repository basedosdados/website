import { Icon, Box } from '@chakra-ui/react'

const EmailIcon = ({
  widthIcon,
  heightIcon,
  fill,
  ...style
}) => (
  <Box 
    display="flex"
    alignItems="center"
    justifyItems="center"
    position="relative"
    {...style}
  >
    <Icon
      viewBox="0 0 14 14"
      width={widthIcon}
      height={heightIcon}
      fill={fill}
    >
      <path fill-rule="evenodd" clip-rule="evenodd" d="M2.41798 12.5993L12.3001 1.5V12.5993H2.41798ZM1.80005 12.5507V2.2882L6.55113 7.13443L1.80005 12.5507ZM11.5874 1.54473L1.80033 1.54434L6.93137 6.75592L11.5874 1.54473Z" fill={fill}/>
    </Icon>
  </Box>
)

export default EmailIcon