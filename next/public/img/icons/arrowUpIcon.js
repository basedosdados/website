import { createIcon } from '@chakra-ui/icons';

const ArrowUpIcon = createIcon({
  displayName: "arrowUp",
  viewBox: "0 0 24 24",
  path: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M12 19V5" />
      <path d="M5 12l7-7 7 7" />
    </svg>
  ),
});

export default ArrowUpIcon
