import { forwardRef } from "react";
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

const BodyText = forwardRef(({ children, typography = "medium", ...props }, ref) => {
  const { fontSize, lineHeight } = typographyStyles[typography];

  return (
    <Text
      ref={ref}
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
});

export default BodyText;