import { Icon, Box } from '@chakra-ui/react';

const PointsIcon = ({widthImage, heightImage, ...style}) => (
  <Box 
    display="flex"
    alignItems="center"
    justifyItems="center"
    position="relative"
    {...style}
  >
    <Icon
      alt="points"
      viewBox="0 0 25 22"
      width={widthImage}
      height={heightImage}
    >
      <g clip-path="url(#clip0_20480_1858)">
      <path d="M10.32 0.919983V5.83997C8.39997 5.83997 7.11997 6.27997 6.47997 7.15998C5.91997 7.95998 5.63997 9.51998 5.63997 11.84H10.32V21.08H0.719971V13.28C0.719971 9.03998 1.43997 5.91997 2.87997 3.91998C4.31997 1.91998 6.79997 0.919983 10.32 0.919983ZM24.12 0.919983V5.83997C22.2 5.83997 20.92 6.27997 20.28 7.15998C19.72 7.95998 19.44 9.51998 19.44 11.84H24.12V21.08H14.52V13.28C14.52 9.03998 15.24 5.91997 16.68 3.91998C18.12 1.91998 20.6 0.919983 24.12 0.919983Z" fill="current-color"/>
      </g>
      <defs>
      <clipPath id="clip0_20480_1858">
      <rect width="25" height="22" fill="white"/>
      </clipPath>
      </defs>
    </Icon>
  </Box>
)

export default PointsIcon
