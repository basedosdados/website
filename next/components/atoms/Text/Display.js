import { Text } from "@chakra-ui/react";

const typographyStyles = {
  small: {
    fontSize: "36px",
    lineHeight: "48px",
  },
  medium: {
    fontSize: "50px",
    lineHeight: "60px",
  },
  large: {
    fontSize: "60px",
    lineHeight: "70px",
  },
};

export default function Display ({ children, typography = "medium", ...props }) {
  const { fontSize, lineHeight } = typographyStyles[typography];

  return (
    <Text
      fontFamily="Roboto"
      fontWeight="500"
      fontSize={fontSize}
      lineHeight={lineHeight}
      color="#252A32"
      {...props}
    >
      {children}
    </Text>
  );
};