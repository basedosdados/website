import { createIcon } from '@chakra-ui/icons';

const CircleIcon = createIcon({
  displayName: "circle",
  viewBox: "0 0 200 200",
  path: (
    <path
      fill="current-color"
      d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
    />
  )
})

export default CircleIcon
