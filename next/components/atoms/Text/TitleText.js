import { Text } from "@chakra-ui/react";

const typographyStyles = {
  small: {
    fontSize: "18px",
    lineHeight: "28px",
  },
  medium: {
    fontSize: "24px",
    lineHeight: "36px",
  },
  large: {
    fontSize: "28px",
    lineHeight: "42px",
  },
};

export default function TitleText({
  children,
  typography = "medium",
  ...props
}) {
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
}
