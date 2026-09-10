import { createIcon } from '@chakra-ui/icons';

const BracesIcon = createIcon({
  displayName: "braces",
  viewBox: "0 0 24 24",
  path: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M7 4a2 2 0 0 0 -2 2v3a2 2 0 0 1 -2 2a2 2 0 0 1 2 2v3a2 2 0 0 0 2 2" />
      <path d="M17 4a2 2 0 0 1 2 2v3a2 2 0 0 0 2 2a2 2 0 0 0 -2 2v3a2 2 0 0 1 -2 2" />
    </svg>
  ),
});

export default BracesIcon
