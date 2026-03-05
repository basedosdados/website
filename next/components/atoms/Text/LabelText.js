import { forwardRef } from "react";
import { Text } from "@chakra-ui/react";

const typographyStyles = {
  "x-small": {
    fontSize: "12px",
    lineHeight: "18px",
  },
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
    lineHeight: "28px",
  },
  "x-large": {
    fontSize: "20px",
    lineHeight: "30px",
  }
};

const LabelText = forwardRef(({ children, typography = "medium", ...props }, ref) => {
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

export default LabelText;