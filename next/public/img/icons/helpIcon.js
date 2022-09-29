import { Icon, Box } from '@chakra-ui/react'

const HelpIcon = ({
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
      viewBox='0 0 25 25'
      width={widthIcon}
      height={heightIcon}
      fill={fill}
    >
      <path d="M10.3454 17.4536V17.3173C10.3605 15.8703 10.5121 14.7188 10.7999 13.8627C11.0878 13.0067 11.4969 12.3135 12.0272 11.7832C12.5575 11.2529 13.1939 10.7643 13.9363 10.3173C14.3833 10.0446 14.7848 9.72259 15.1408 9.35138C15.4969 8.97259 15.7772 8.53699 15.9817 8.04456C16.1939 7.55214 16.2999 7.00669 16.2999 6.4082C16.2999 5.66578 16.1257 5.02184 15.7772 4.47638C15.4287 3.93093 14.9628 3.51047 14.3795 3.21502C13.7962 2.91956 13.1484 2.77184 12.4363 2.77184C11.8151 2.77184 11.2166 2.90062 10.6408 3.1582C10.0651 3.41578 9.58403 3.82108 9.19766 4.37411C8.8113 4.92714 8.58781 5.65062 8.52721 6.54456H5.66357C5.72418 5.25669 6.05751 4.15441 6.66357 3.23775C7.27721 2.32108 8.08403 1.62032 9.08403 1.13547C10.0916 0.650627 11.209 0.408203 12.4363 0.408203C13.7696 0.408203 14.9287 0.673354 15.9136 1.20365C16.906 1.73396 17.6711 2.46123 18.209 3.38547C18.7545 4.30971 19.0272 5.36275 19.0272 6.54456C19.0272 7.3779 18.8984 8.13169 18.6408 8.80593C18.3908 9.48017 18.0272 10.0824 17.5499 10.6127C17.0802 11.143 16.512 11.6127 15.8454 12.0218C15.1787 12.4385 14.6446 12.8779 14.2431 13.34C13.8416 13.7946 13.5499 14.3362 13.3681 14.965C13.1863 15.5938 13.0878 16.3779 13.0727 17.3173V17.4536H10.3454ZM11.7999 24.1809C11.2393 24.1809 10.7583 23.9802 10.3568 23.5786C9.95524 23.1771 9.75448 22.6961 9.75448 22.1355C9.75448 21.5749 9.95524 21.0938 10.3568 20.6923C10.7583 20.2908 11.2393 20.09 11.7999 20.09C12.3605 20.09 12.8416 20.2908 13.2431 20.6923C13.6446 21.0938 13.8454 21.5749 13.8454 22.1355C13.8454 22.5067 13.7507 22.8476 13.5613 23.1582C13.3795 23.4688 13.1333 23.7188 12.8227 23.9082C12.5196 24.09 12.1787 24.1809 11.7999 24.1809Z" fill={fill}/>
    </Icon>
  </Box>
)

export default HelpIcon