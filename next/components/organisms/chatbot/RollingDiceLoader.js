import { Box } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

const diceRoll = keyframes`
  0%   { transform: rotateX(0deg)   rotateY(0deg)   rotateZ(0deg); }
  25%  { transform: rotateX(100deg) rotateY(95deg)   rotateZ(10deg); }
  50%  { transform: rotateX(190deg) rotateY(200deg)  rotateZ(-10deg); }
  75%  { transform: rotateX(280deg) rotateY(300deg)  rotateZ(5deg); }
  100% { transform: rotateX(360deg) rotateY(360deg)  rotateZ(0deg); }
`;

const cubeSize = 14;
const halfCubeSize = cubeSize / 2;

const pipGridSize = cubeSize * 0.7;
const pipGap = Math.max(1, cubeSize * 0.06);
const pipDotSize = Math.max(1.5, cubeSize * 0.15);

const pipPatterns = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

const faceColors = {
  top: "#9BE092",
  front: "#4FAE5B",
  right: "#2B8C4D",
  left: "#2B8C4D",
  back: "#1F6B39",
  bottom: "#164F2B",
};

function DicePips({ value }) {
  const active = new Set(pipPatterns[value] ?? pipPatterns[5]);

  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(3, 1fr)"
      gap={`${pipGap}px`}
      width={`${pipGridSize}px`}
      height={`${pipGridSize}px`}
    >
      {Array.from({ length: 9 }, (_, index) => (
        <Box
          key={index}
          width={`${pipDotSize}px`}
          height={`${pipDotSize}px`}
          borderRadius="full"
          backgroundColor={active.has(index) ? "#FAFAFA" : "transparent"}
          boxShadow={
            active.has(index) ? "0 0 1px rgba(0, 0, 0, 0.35)" : "none"
          }
        />
      ))}
    </Box>
  );
}

function DiceFace({ transform, value, backgroundColor }) {
  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      width={`${cubeSize}px`}
      height={`${cubeSize}px`}
      borderRadius="4px"
      backgroundColor={backgroundColor}
      display="flex"
      alignItems="center"
      justifyContent="center"
      boxShadow="inset 0 0 0 1px rgba(0, 0, 0, 0.15)"
      sx={{
        transform,
        backfaceVisibility: "hidden",
      }}
    >
      <DicePips value={value} />
    </Box>
  );
}

export default function RollingDiceLoader({ marginBottom = "16px" }) {
  return (
    <Box
      width={`${cubeSize + 20}px`}
      height={`${cubeSize + 20}px`}
      marginBottom={marginBottom}
      display="flex"
      alignItems="center"
      justifyContent="flex-start"
      role="status"
      aria-label="Pensando"
      sx={{
        perspective: "160px",
      }}
    >
      <Box
        width={`${cubeSize}px`}
        height={`${cubeSize}px`}
        position="relative"
        sx={{
          transformStyle: "preserve-3d",
          willChange: "transform",
          animation: `${diceRoll} 2.6s linear infinite`,
        }}
      >
        <DiceFace
          backgroundColor={faceColors.front}
          value={5}
          transform={`rotateY(0deg) translateZ(${halfCubeSize}px)`}
        />
        <DiceFace
          backgroundColor={faceColors.back}
          value={2}
          transform={`rotateY(180deg) translateZ(${halfCubeSize}px)`}
        />
        <DiceFace
          backgroundColor={faceColors.right}
          value={4}
          transform={`rotateY(90deg) translateZ(${halfCubeSize}px)`}
        />
        <DiceFace
          backgroundColor={faceColors.left}
          value={3}
          transform={`rotateY(-90deg) translateZ(${halfCubeSize}px)`}
        />
        <DiceFace
          backgroundColor={faceColors.top}
          value={1}
          transform={`rotateX(90deg) translateZ(${halfCubeSize}px)`}
        />
        <DiceFace
          backgroundColor={faceColors.bottom}
          value={6}
          transform={`rotateX(-90deg) translateZ(${halfCubeSize}px)`}
        />
      </Box>
    </Box>
  );
}
