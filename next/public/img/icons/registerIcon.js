import { Icon, Box } from '@chakra-ui/react'

const RegisterIcon = ({
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
      <path d="M14.7782 5.49301L17.4842 8.19901C17.5982 8.31301 17.5982 8.49901 17.4842 8.61301L10.9322 15.165L8.14821 15.474C7.77621 15.516 7.46121 15.201 7.50321 14.829L7.81221 12.045L14.3642 5.49301C14.4782 5.37901 14.6642 5.37901 14.7782 5.49301ZM19.6382 4.806L18.1742 3.342C17.7182 2.886 16.9772 2.886 16.5182 3.342L15.4562 4.404C15.3422 4.518 15.3422 4.704 15.4562 4.818L18.1622 7.52401C18.2762 7.63801 18.4622 7.63801 18.5762 7.52401L19.6382 6.46201C20.0942 6.00301 20.0942 5.26201 19.6382 4.806ZM14.2202 13.383V16.437H4.6202V6.83701H11.5142C11.6102 6.83701 11.7002 6.79801 11.7692 6.73201L12.9692 5.53201C13.1972 5.30401 13.0352 4.917 12.7142 4.917H4.1402C3.3452 4.917 2.7002 5.56201 2.7002 6.35701V16.917C2.7002 17.712 3.3452 18.357 4.1402 18.357H14.7002C15.4952 18.357 16.1402 17.712 16.1402 16.917V12.183C16.1402 11.862 15.7532 11.703 15.5252 11.928L14.3252 13.128C14.2592 13.197 14.2202 13.287 14.2202 13.383Z" fill={fill}/>
    </Icon>
  </Box>
)

export default RegisterIcon