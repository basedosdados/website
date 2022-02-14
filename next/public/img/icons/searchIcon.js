import { Icon, Box } from '@chakra-ui/react'

const SearchIcon = (props) => (
  <Box 
    display="flex"
    alignItems="center"
    justifyItems="center"
    position="relative"
    width={props.width}
    height={props.height}
  >
    <Icon
      viewBox='0 0 24 24'
      width={props.widthIcon}
      height={props.heightIcon}
      >
      <path
        fill={props.color}
        d="M17.1527 15.5943H16.0686L15.6844 15.2238C17.0292 13.6595 17.8388 11.6286 17.8388 9.41938C17.8388 4.49314 13.8456 0.5 8.91938 0.5C3.99314 0.5 0 4.49314 0 9.41938C0 14.3456 3.99314 18.3388 8.91938 18.3388C11.1286 18.3388 13.1595 17.5292 14.7238 16.1844L15.0943 16.5686V17.6527L21.9554 24.5L24 22.4554L17.1527 15.5943ZM8.91938 15.5943C5.50257 15.5943 2.74443 12.8362 2.74443 9.41938C2.74443 6.00257 5.50257 3.24443 8.91938 3.24443C12.3362 3.24443 15.0943 6.00257 15.0943 9.41938C15.0943 12.8362 12.3362 15.5943 8.91938 15.5943Z"
      />
    </Icon>
  </Box>
)

export default SearchIcon