import { Icon, Box } from '@chakra-ui/react'

const StatusIcon = ({
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
      viewBox='0 0 22 22'
      width={widthIcon}
      height={heightIcon}
      fill={fill}
    >
      <path d="M10.9975 3.30078C7.29845 3.30078 4.2998 6.29943 4.2998 9.99847C4.2998 13.6975 7.29845 16.6962 10.9975 16.6962C14.6965 16.6962 17.6952 13.6975 17.6952 9.99847C17.6952 6.29943 14.6965 3.30078 10.9975 3.30078ZM13.158 9.99847C13.158 11.1898 12.1888 12.159 10.9975 12.159C9.80617 12.159 8.83695 11.1898 8.83695 9.99847C8.83695 8.80715 9.80617 7.83793 10.9975 7.83793C12.1888 7.83793 13.158 8.80715 13.158 9.99847Z" fill={fill}/>
    </Icon>
  </Box>
)

export default StatusIcon