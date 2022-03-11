import { Icon, Box } from '@chakra-ui/react'

const InfoIcon = (props) => (
  <Box 
    display="flex"
    alignItems="center"
    justifyItems="center"
    position="relative"
    style={props}
  >
    <Icon
      viewBox="0 0 24 24"
      width={props.widthIcon}
      height={props.heightIcon}
      fill={props.fill}
    >
      <path d="M12 1c-6.338 0-12 4.226-12 10.007 0 2.05.739 4.063 2.047 5.625.055 1.83-1.023 4.456-1.993 6.368 2.602-.47 6.301-1.508 7.978-2.536 9.236 2.247 15.968-3.405 15.968-9.457 0-5.812-5.701-10.007-12-10.007zm1 15h-2v-6h2v6zm-1-7.75c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z"/>
    </Icon>
  </Box>
)

export default InfoIcon