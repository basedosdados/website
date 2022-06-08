import { Icon, Box } from '@chakra-ui/react'

const DisplayIcon = ({
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
      <path d="M18.5 3H3.5C2.67188 3 2 3.67188 2 4.5V14.5C2 15.3281 2.67188 16 3.5 16H9.5L9 17.5H6.75C6.33437 17.5 6 17.8344 6 18.25C6 18.6656 6.33437 19 6.75 19H15.25C15.6656 19 16 18.6656 16 18.25C16 17.8344 15.6656 17.5 15.25 17.5H13L12.5 16H18.5C19.3281 16 20 15.3281 20 14.5V4.5C20 3.67188 19.3281 3 18.5 3ZM18 14H4V5H18V14Z" fill={fill}/>
    </Icon>
  </Box>
)

export default DisplayIcon