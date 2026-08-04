import { Box } from "@chakra-ui/react";
import CheckIcon from "../../public/img/icons/checkIcon";

function AnimatedCopyIcon({ copied, icon: Icon, width = "18px", height = "18px", ...props }) {
  return (
    <Box position="relative" width={width} height={height} display="inline-block" {...props}>
      <Box
        position="absolute"
        inset="0"
        display="flex"
        alignItems="center"
        justifyContent="center"
        transition="opacity 0.2s ease, transform 0.2s ease"
        opacity={copied ? 0 : 1}
        transform={copied ? "scale(0.5) rotate(-40deg)" : "scale(1) rotate(0deg)"}
      >
        <Icon width={width} height={height} />
      </Box>
      <Box
        position="absolute"
        inset="0"
        display="flex"
        alignItems="center"
        justifyContent="center"
        transition="opacity 0.2s ease, transform 0.2s ease"
        opacity={copied ? 1 : 0}
        transform={copied ? "scale(1) rotate(0deg)" : "scale(0.5) rotate(40deg)"}
      >
        <CheckIcon width={width} height={height} />
      </Box>
    </Box>
  );
}

export default AnimatedCopyIcon;
