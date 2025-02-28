import { Text } from "@chakra-ui/react";

const typographyStyles = {
  small: {
    fontSize: "14px",
    lineHeight: "20px",
  },
  medium: {
    fontSize: "16px",
    lineHeight: "24px",
  },
  large: {
    fontSize: "18px",
    lineHeight: "26px",
  },
};

export default function BodyText({
  children,
  typography = "medium",
  ...props
}) {
  const { fontSize, lineHeight } = typographyStyles[typography];

  return (
    <Text
      fontFamily="Roboto"
      fontWeight="400"
      fontSize={fontSize}
      lineHeight={lineHeight}
      color="#252A32"
      {...props}
    >
      {children}
    </Text>
  );
}
