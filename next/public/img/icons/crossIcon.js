import { Icon, Box } from '@chakra-ui/react'

const CrossIcon = ({widthIcon, heightIcon ,fill , ...style}) => (
  <Box 
    display="flex"
    alignItems="center"
    justifyItems="center"
    position="relative"
    {...style}
  >
    <Icon
      viewBox='0 0 16 16'
      width={widthIcon}
      height={heightIcon}
      fill={fill}
    >
      <path fill-rule="evenodd" clip-rule="evenodd" d="M3.78742 11.4931C3.54259 11.7557 3.55695 12.167 3.8195 12.4118C4.08204 12.6566 4.49335 12.6423 4.73818 12.3797L8.04464 8.83398L11.3519 12.3806C11.5967 12.6431 12.008 12.6575 12.2706 12.4127C12.5331 12.1678 12.5475 11.7565 12.3027 11.494L8.9334 7.8809L12.0356 4.55424C12.2804 4.29169 12.266 3.88039 12.0035 3.63556C11.7409 3.39073 11.3296 3.4051 11.0848 3.66764L8.04464 6.92781L5.00527 3.66849C4.76044 3.40595 4.34913 3.39158 4.08659 3.63641C3.82404 3.88124 3.80968 4.29254 4.05451 4.55509L7.15587 7.8809L3.78742 11.4931Z" fill={fill}/>
    </Icon>
  </Box>
)

export default CrossIcon