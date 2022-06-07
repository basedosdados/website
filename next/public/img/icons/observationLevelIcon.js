import { Icon, Box } from '@chakra-ui/react'

const ObservationLevelIcon = ({
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
      <path fill-rule="evenodd" clip-rule="evenodd" d="M17.9999 2.5C17.9999 2.22386 18.2238 2 18.4999 2H19.4999C19.776 2 19.9999 2.22386 19.9999 2.5V13H17.9999V2.5ZM6.65 12.8C8.66584 12.8 10.3 11.1658 10.3 9.15C10.3 7.13416 8.66584 5.5 6.65 5.5C4.63416 5.5 3 7.13416 3 9.15C3 11.1658 4.63416 12.8 6.65 12.8ZM6.65 14.8C7.98761 14.8 9.21665 14.3352 10.1844 13.5583C10.2198 13.6108 10.2607 13.6607 10.3072 13.7071L14.1963 17.5962C14.5868 17.9867 15.22 17.9867 15.6105 17.5962C16.001 17.2057 16.001 16.5725 15.6105 16.182L11.7214 12.2929C11.6443 12.2157 11.5576 12.1538 11.4653 12.1072C11.9946 11.247 12.3 10.2341 12.3 9.15C12.3 6.02959 9.77041 3.5 6.65 3.5C3.52959 3.5 1 6.02959 1 9.15C1 12.2704 3.52959 14.8 6.65 14.8ZM13.4999 7C13.2238 7 12.9999 7.22386 12.9999 7.5V13H14.9999V7.5C14.9999 7.22386 14.776 7 14.4999 7H13.4999ZM15.9999 4.5C15.7238 4.5 15.4999 4.72386 15.4999 5V13H17.4999V5C17.4999 4.72386 17.276 4.5 16.9999 4.5H15.9999Z" fill={fill}/>
    </Icon>
  </Box>
)

export default ObservationLevelIcon