import { forwardRef } from "react";
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
  }
};

const TitleText = forwardRef(({ children, typography = "medium", ...props }, ref) => {
  const { fontSize, lineHeight } = typographyStyles[typography];

  return (
    <Text
      ref={ref}
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
});

export default TitleText;