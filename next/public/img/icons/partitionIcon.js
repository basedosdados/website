import { Icon, Box } from '@chakra-ui/react'

const PartitionIcon = ({
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
      <path d="M15.7809 2.99706C17.1303 3.70633 18.2691 4.75835 19.0828 6.04734C19.8966 7.33633 20.3567 8.81686 20.4168 10.3401L11.7412 10.6824L15.7809 2.99706Z" fill={fill}/>
      <mask id="path-2-inside-1_5901_517" fill="white">
      <path d="M19.3647 11.3171C19.3647 13.2061 18.7486 15.0436 17.6099 16.5508C16.4712 18.0581 14.8721 19.1528 13.0549 19.669C11.2378 20.1852 9.30195 20.0947 7.54092 19.4112C5.77989 18.7278 4.28981 17.4886 3.2967 15.8817C2.30359 14.2748 1.86163 12.3879 2.03787 10.5071C2.2141 8.62633 2.99891 6.85435 4.27326 5.45992C5.5476 4.0655 7.24194 3.12473 9.09929 2.78031C10.9566 2.43588 12.8756 2.7066 14.5652 3.55139L10.6824 11.3171H19.3647Z"/>
      </mask>
      <path d="M19.3647 11.3171C19.3647 13.2061 18.7486 15.0436 17.6099 16.5508C16.4712 18.0581 14.8721 19.1528 13.0549 19.669C11.2378 20.1852 9.30195 20.0947 7.54092 19.4112C5.77989 18.7278 4.28981 17.4886 3.2967 15.8817C2.30359 14.2748 1.86163 12.3879 2.03787 10.5071C2.2141 8.62633 2.99891 6.85435 4.27326 5.45992C5.5476 4.0655 7.24194 3.12473 9.09929 2.78031C10.9566 2.43588 12.8756 2.7066 14.5652 3.55139L10.6824 11.3171H19.3647Z" fill={fill} stroke="white" stroke-width="1.4" mask="url(#path-2-inside-1_5901_517)"/>
      <mask id="path-3-inside-2_5901_517" fill="white">
      <path d="M15.1924 18.7362C13.2247 19.9323 10.8625 20.2978 8.62533 19.7523C6.38819 19.2067 4.4594 17.7948 3.26326 15.8271C2.06713 13.8595 1.70164 11.4972 2.24719 9.2601C2.79275 7.02296 4.20466 5.09416 6.17232 3.89803L10.6824 11.3171L15.1924 18.7362Z"/>
      </mask>
      <path d="M15.1924 18.7362C13.2247 19.9323 10.8625 20.2978 8.62533 19.7523C6.38819 19.2067 4.4594 17.7948 3.26326 15.8271C2.06713 13.8595 1.70164 11.4972 2.24719 9.2601C2.79275 7.02296 4.20466 5.09416 6.17232 3.89803L10.6824 11.3171L15.1924 18.7362Z" fill={fill} stroke="white" stroke-width="1.4" mask="url(#path-3-inside-2_5901_517)"/>
      <mask id="path-4-inside-3_5901_517" fill="white">
      <path d="M6.61427 18.9874C5.20791 18.2416 4.03368 17.1234 3.21997 15.7551C2.40625 14.3869 1.98437 12.8213 2.00044 11.2295L10.6824 11.3171L6.61427 18.9874Z"/>
      </mask>
      <path d="M6.61427 18.9874C5.20791 18.2416 4.03368 17.1234 3.21997 15.7551C2.40625 14.3869 1.98437 12.8213 2.00044 11.2295L10.6824 11.3171L6.61427 18.9874Z" fill={fill} stroke="white" stroke-width="1.4" mask="url(#path-4-inside-3_5901_517)"/>
    </Icon>
  </Box>
)

export default PartitionIcon