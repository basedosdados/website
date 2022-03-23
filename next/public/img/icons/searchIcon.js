import { Icon, Box } from '@chakra-ui/react'

const SearchIcon = ({widthIcon, heightIcon ,fill , ...style}) => (
  <Box 
    display="flex"
    alignItems="center"
    justifyItems="center"
    position="relative"
    {...style}
  >
    <Icon
      viewBox='0 0 22 21'
      width={widthIcon}
      height={heightIcon}
      fill={fill}
    >
      <path fill-rule="evenodd" clip-rule="evenodd" d="M13.7954 8.04539C13.7954 11.0955 11.3228 13.5681 8.27268 13.5681C5.22256 13.5681 2.74996 11.0955 2.74996 8.04539C2.74996 4.99527 5.22256 2.52266 8.27268 2.52266C11.3228 2.52266 13.7954 4.99527 13.7954 8.04539ZM12.9322 14.5211C11.6213 15.466 10.012 16.0227 8.27268 16.0227C3.86696 16.0227 0.29541 12.4511 0.29541 8.04539C0.29541 3.63966 3.86696 0.0681152 8.27268 0.0681152C12.6784 0.0681152 16.25 3.63966 16.25 8.04539C16.25 9.82597 15.6666 11.4703 14.6805 12.7977L20.9181 18.8878C21.4031 19.3613 21.4124 20.1383 20.9389 20.6233C20.4654 21.1083 19.6884 21.1176 19.2034 20.6441L12.9322 14.5211Z"/>
    </Icon>
  </Box>
)

export default SearchIcon