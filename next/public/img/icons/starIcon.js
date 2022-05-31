import { Icon, Box } from '@chakra-ui/react'

const StarIcon = ({
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
      <g clip-path="url(#clip0_5901_501)">
      <path d="M9.61228 2.38047C9.85573 1.6312 10.9158 1.6312 11.1592 2.38048L12.7594 7.3054C12.8683 7.64048 13.1805 7.86735 13.5329 7.86735H18.7112C19.4991 7.86735 19.8266 8.87549 19.1893 9.33857L14.9999 12.3823C14.7148 12.5894 14.5956 12.9565 14.7044 13.2916L16.3047 18.2165C16.5481 18.9658 15.6905 19.5889 15.0532 19.1258L10.8638 16.082C10.5787 15.8749 10.1928 15.8749 9.90772 16.082L5.71832 19.1258C5.08095 19.5889 4.22338 18.9658 4.46683 18.2165L6.06704 13.2916C6.17591 12.9565 6.05664 12.5894 5.7716 12.3823L1.58221 9.33857C0.944841 8.87549 1.27241 7.86735 2.06024 7.86735H7.23861C7.59094 7.86735 7.9032 7.64049 8.01207 7.3054L9.61228 2.38047Z" fill={fill}/>
      </g>
      <defs>
      <clipPath id="clip0_5901_501">
      <rect width="22" height="22" fill="white"/>
      </clipPath>
      </defs>
    </Icon>
  </Box>
)

export default StarIcon