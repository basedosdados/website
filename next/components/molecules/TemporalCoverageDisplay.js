import {
  Stack,
  HStack,
  Box,
  Tooltip,
  useDisclosure,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import cookies from "js-cookie";
import { useTranslation } from "next-i18next";
import { SectionPrice } from "../../pages/prices";
import { ModalGeneral } from "./uiUserPage";
import TitleText from "../atoms/Text/TitleText";
import BodyText from "../atoms/Text/BodyText";
import RedirectIcon from "../../public/img/icons/redirectIcon";
import CheckIcon from "../../public/img/icons/checkIcon";

export function TemporalCoverageBar({ value }) {
  const { t } = useTranslation(["dataset", "prices"]);
  const [values, setValues] = useState({});
  const plansModal = useDisclosure();

  const isUserPro = () => {
    let user;
    if (cookies.get("userBD")) user = JSON.parse(cookies.get("userBD"));

    if (user?.isSubscriber) return user?.isSubscriber;
    return false;
  };

  const TextData = ({ string, ...style }) => {
    return (
      <BodyText typography="small" color="#464A51" {...style}>
        {string}
      </BodyText>
    );
  };

  useEffect(() => {
    if (value === null || value === undefined) return setValues(null);

    let newValue = {};

    if (value["2"]?.type === "closed") newValue["3"] = value["2"].date;

    if (value["0"]?.type === "open") newValue["0"] = value["0"].date;
    if (value["0"]?.type === "closed") newValue["2"] = value["0"].date;

    if (value["1"]?.type === "open") newValue["1"] = value["1"].date;
    if (value["1"]?.type === "closed") newValue["3"] = value["1"].date;

    setValues(newValue);
  }, [value]);

  if (values === null)
    return <TextData string={t("temporalCoverageBar.notProvided")} />;

  return (
    <HStack
      position="relative"
      width="100%"
      maxWidth="325px"
      height="65px"
      alignItems="normal"
      spacing={0}
    >
      <ModalGeneral
        isOpen={plansModal.isOpen}
        onClose={plansModal.onClose}
        propsModalContent={{
          minWidth: "fit-content",
          overflow: "auto",
        }}
        isCentered={false}
      >
        <Stack spacing={0} marginBottom="16px">
          <TitleText width="100%" fontWeight="400" textAlign="center">
            {t("temporalCoverageBar.comparePlans")}
          </TitleText>
          <ModalCloseButton
            fontSize="14px"
            top="34px"
            right="26px"
            _hover={{ backgroundColor: "transparent", color: "#0B89E2" }}
          />
        </Stack>

        <SectionPrice />
      </ModalGeneral>

      <Tooltip
        hasArrow
        padding="16px"
        backgroundColor="#252A32"
        boxSizing="border-box"
        borderRadius="8px"
        fontFamily="Roboto"
        fontWeight="400"
        fontSize="14px"
        lineHeight="20px"
        textAlign="center"
        color="#FFFFFF"
        placement="top"
        maxWidth="160px"
        label={t("temporalCoverageBar.accessGranted")}
      >
        <Box
          flex={3}
          marginRight={
            values?.["3"] ? "" : { base: "24px !important", lg: "0" }
          }
          display={values?.["0"] ? "" : "none"}
        >
          <Box
            width="100%"
            height="24px"
            backgroundColor="#D5E8DB"
            fontFamily="Roboto"
            fontWeight="500"
            fontSize="12px"
            lineHeight="20px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            letterSpacing="0.2px"
            color="#2B8C4D"
            marginBottom="10px"
            padding="6px 16px"
          >
            {t("temporalCoverageBar.free")}
          </Box>
          <Box
            position="relative"
            width="100%"
            borderBottom="solid 3px #2B8C4D"
            marginBottom="10px"
          >
            <Box position="absolute" width="100%">
              <Box
                position="absolute"
                display="flex"
                alignItems="start"
                flexDirection="column"
                left={0}
                top="-3px"
              >
                <Box
                  width="8px"
                  height="8px"
                  backgroundColor="#2B8C4D"
                  borderRadius="50%"
                />
                <TextData
                  position="absolute"
                  top="14px"
                  width="max-content"
                  string={values?.["0"]}
                />
              </Box>
            </Box>

            <Box position="absolute" width="100%">
              <Box
                position="absolute"
                display="flex"
                alignItems="center"
                flexDirection="column"
                right={values?.["3"] ? "-4px" : "0"}
                top="-3px"
                zIndex={1}
              >
                <Box
                  width="8px"
                  height="8px"
                  backgroundColor="#2B8C4D"
                  borderRadius="50%"
                />
                <TextData
                  position="absolute"
                  top="14px"
                  width="max-content"
                  string={values?.["1"]}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Tooltip>

      <Tooltip
        hasArrow
        padding="16px"
        backgroundColor="#252A32"
        boxSizing="border-box"
        borderRadius="8px"
        fontFamily="Roboto"
        fontWeight="400"
        fontSize="14px"
        lineHeight="20px"
        textAlign="center"
        color="#FFFFFF"
        placement="top"
        maxWidth="160px"
        label={
          isUserPro()
            ? t("temporalCoverageBar.accessGranted")
            : t("temporalCoverageBar.upgradeRequired")
        }
      >
        <Box
          flex={2}
          marginRight={{ base: "24px !important", lg: "0" }}
          display={values?.["3"] ? "" : "none"}
        >
          <Box
            as="a"
            cursor={isUserPro() ? "default" : "pointer"}
            width="100%"
            height="24px"
            backgroundColor={isUserPro() ? "#D5E8DB" : "#E4F2FF"}
            fontFamily="Roboto"
            fontWeight="500"
            fontSize="12px"
            lineHeight="20px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            letterSpacing="0.2px"
            color={isUserPro() ? "#2B8C4D" : "#0068C5"}
            fill={isUserPro() ? "#2B8C4D" : "#0068C5"}
            gap="10px"
            marginBottom="10px"
            padding="6px 16px"
            marginLeft="2px"
            _hover={{
              color: isUserPro() ? "#2B8C4D" : "#0057A4",
              fill: isUserPro() ? "#2B8C4D" : "#0057A4",
              backgroundColor: isUserPro() ? "#D5E8DB" : "#E4F2FF",
            }}
            onClick={() => {
              if (isUserPro()) return;
              plansModal.onOpen();
            }}
          >
            {t("temporalCoverageBar.paid")}
            {isUserPro() ? (
              <CheckIcon width="20px" height="20px" />
            ) : (
              <RedirectIcon width="12px" height="12px" />
            )}
          </Box>

          <Box
            position="relative"
            width="100%"
            borderBottom="solid 3px"
            borderColor={isUserPro() ? "#22703E" : "#0068C5"}
            marginBottom="10px"
          >
            <Box
              position="absolute"
              width="100%"
              display={values?.["2"] ? "" : "none"}
            >
              <Box
                position="absolute"
                display="flex"
                alignItems="start"
                flexDirection="column"
                left={0}
                top="-3px"
              >
                <Box
                  width="8px"
                  height="8px"
                  backgroundColor="#0068C5"
                  borderRadius="50%"
                />
                <TextData
                  position="absolute"
                  top="14px"
                  width="max-content"
                  string={values?.["2"]}
                />
              </Box>
            </Box>

            <Box position="absolute" width="100%">
              <Box
                position="absolute"
                display="flex"
                alignItems="center"
                flexDirection="column"
                top="-3px"
                right="-4px"
              >
                <Box
                  width="8px"
                  height="8px"
                  backgroundColor={isUserPro() ? "#22703E" : "#0068C5"}
                  borderRadius="50%"
                />
                <TextData
                  position="absolute"
                  top="14px"
                  width="max-content"
                  string={values?.["3"]}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Tooltip>
    </HStack>
  );
}
