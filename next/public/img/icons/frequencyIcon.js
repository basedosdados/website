import { Icon, Box } from '@chakra-ui/react'

const FrequencyIcon = ({
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
      viewBox="0 0 22 22"
      width={widthIcon}
      height={heightIcon}
      fill={fill}
    >
      <path fill-rule="evenodd" clip-rule="evenodd" d="M10.8833 19.8251C15.8217 19.8251 19.8251 15.8217 19.8251 10.8833C19.8251 5.94481 15.8217 1.94141 10.8833 1.94141C5.94481 1.94141 1.94141 5.94481 1.94141 10.8833C1.94141 15.8217 5.94481 19.8251 10.8833 19.8251ZM6.31508 12.0229L9.37414 15.0819C9.55792 15.2657 9.8559 15.2657 10.0397 15.0819L15.4519 9.66975C15.6357 9.48595 15.6357 9.18797 15.4519 9.00418L14.7863 8.33862C14.6026 8.15484 14.3046 8.15484 14.1208 8.33862L9.70692 12.7524L7.64619 10.6917C7.46241 10.5079 7.16441 10.5079 6.98063 10.6917L6.31508 11.3573C6.1313 11.5411 6.1313 11.8391 6.31508 12.0229Z" fill={fill}/>
    </Icon>
  </Box>
)

export default FrequencyIcon