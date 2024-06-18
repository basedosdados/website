import {
  Stack,
  Box,
  Text,
} from "@chakra-ui/react";
import SectionText from "../atoms/SectionText";
import InfoIcon from "../../public/img/icons/infoIcon";
import WarningIcon from "../../public/img/icons/warningIcon";
import ExclamationIcon from "../../public/img/icons/exclamationIcon";
import { SolidSuccessIcon } from "../../public/img/icons/successIcon";

export function DisclaimerBox({ title, text, children, ...style }) {
  return (
    <Stack
      display="flex"
      flexDirection="row"
      padding="10px 12px"
      boxShadow="0 1px 4px 0 rgba(0,0,0, 0.15)"
      borderLeft="3px solid #42B0FF"
      borderEndRadius="6px"
      marginTop="24px"
      alignItems="center"
      {...style}
    > 
      {!children &&
        <SectionText
          width="100%"
        >
          <b>{title}</b>
          <br />{text}
        </SectionText>
      }
      {children}
    </Stack>
  )
}

export function AlertDiscalimerBox({ type = "info", text, children, ...props }) {
  const backgroundColor = {
    info: "#E4F2FF",
    warning: "#FFF8DF",
    error: "#F6E3E3",
    success: "#D5E8DB"
  }
  const borderColor = {
    info: "#0068C5",
    warning: "#F9C50B",
    error: "#BF3434",
    success: "#2B8C4D"
  }

  return (
    <Box
      position="relative"
      display="flex"
      flexDirection="row"
      height="100%"
    >
      <Box
        position="absolute"
        left={0}
        width="40px"
        height="100%"
        borderRadius="10px"
        backgroundColor={borderColor[type] || "#252A32"}
      />
      <Stack
        flexDirection="row"
        spacing={0}
        gap="16px"
        width="100%"
        padding="16px 24px"
        marginLeft="4px"
        borderRadius="8px"
        backgroundColor={backgroundColor[type] || "#FFF"}
        zIndex="10"
        {...props}
      >
        {type === "info" &&
          <InfoIcon
            width="20px"
            height="20px"
            padding="2px"
            fill={borderColor[type]}
          />
        }

        {type === "warning" &&
          <WarningIcon 
            width="20px"
            height="20px"
            padding="2px"
            fill={borderColor[type]}
          />
        }

        {type === "error" &&
          <ExclamationIcon
            width="20px"
            height="20px"
            padding="2px"
            fill={borderColor[type]}
          />
        }

        {type === "success" &&
          <SolidSuccessIcon
            width="20px"
            height="20px"
            padding="2px"
            fill={borderColor[type]}
          />
        }

        <Text
          fontFamily="Roboto"
          fontWeight="400"
          fontSize="14px"
          lineHeight="20px"
          color="#252A32"
          whiteSpace={{base: "normal", lg:"break-spaces"}}
        >
          {text}
          {children}
        </Text>
      </Stack>
    </Box>
  )
}