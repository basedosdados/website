import { Icon, Box } from '@chakra-ui/react'

const TrashIcon = ({
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
      <path d="M3 4.87878V3.91919C3 3.46338 3.3667 3.09668 3.82251 3.09668H7.66089L7.98304 2.45581C8.12012 2.17478 8.40457 2 8.71644 2H12.6336C12.9455 2 13.23 2.17478 13.3705 2.45581L13.6926 3.09668H17.531C17.9868 3.09668 18.3535 3.46338 18.3535 3.91919V4.87878C18.3535 5.10497 18.1685 5.29004 17.9423 5.29004H3.41125C3.18506 5.29004 3 5.10497 3 4.87878ZM17.2294 6.82196L16.5303 18.0047C16.4755 18.8717 15.7558 19.5469 14.8887 19.5469H6.46482C5.59776 19.5469 4.87806 18.8717 4.82323 18.0047L4.1241 6.82196C4.11039 6.58549 4.29888 6.38672 4.53535 6.38672H16.8216C17.0546 6.38672 17.2431 6.58549 17.2294 6.82196Z" fill={fill}/>
    </Icon>
  </Box>
)

export default TrashIcon