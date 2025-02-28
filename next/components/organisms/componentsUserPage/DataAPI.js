import {
  Stack,
  Box,
  Grid,
  GridItem,
  Badge,
  Tooltip,
  useClipboard,
  Link,
  Button,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import TitleText from "../../atoms/Text/TitleText";
import BodyText from "../../atoms/Text/BodyText";
import { CopySolidIcon } from "../../../public/img/icons/copyIcon";
import CheckIcon from "../../../public/img/icons/checkIcon";

export default function DataAPI({ userInfo }) {
  const { t } = useTranslation("user");
  const [apiKeys, setApiKeys] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    if (userInfo?.keys?.edges) {
      setApiKeys(userInfo.keys.edges.map((edge) => edge.node));
    }
  }, [userInfo]);

  if (!apiKeys.length) {
    return null;
  }

  const handleCopyClick = (prefix, index) => {
    navigator.clipboard.writeText(prefix);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  return (
    <Stack spacing={6}>
      <Box
        p={4}
        mb={4}
        bg="yellow.100"
        borderRadius="md"
        borderLeft="4px solid"
        borderColor="yellow.400"
      >
        <BodyText typography="small" fontWeight="bold" marginBottom={2}>
          {t("dataAPI.earlyRelease")} 🚧
        </BodyText>
        <BodyText typography="small">
          {t("dataAPI.earlyReleaseDescription")}
        </BodyText>
      </Box>
      <Box>
        <TitleText typography="small" marginBottom={4}>
          {t("dataAPI.keys")}
        </TitleText>
        <BodyText typography="small" color="#464A51">
          {t("dataAPI.description")}
        </BodyText>
      </Box>

      <Grid templateColumns="1fr" gap={4}>
        {apiKeys.map((key, index) => (
          <GridItem
            key={index}
            p={4}
            borderWidth="1px"
            borderColor="#DEDFE0"
            borderRadius="8px"
          >
            <Stack spacing={4}>
              <Stack direction="row" alignItems="center">
                <Stack direction="row" alignItems="center" spacing={2}>
                  <BodyText fontWeight="500">
                    {t("dataAPI.prefix")}: {key.prefix}
                  </BodyText>
                  {key.name && (
                    <>
                      <BodyText fontWeight="500" color="#71757A">
                        |
                      </BodyText>
                      <BodyText fontWeight="500">
                        {t("dataAPI.name")}: {key.name}
                      </BodyText>
                    </>
                  )}
                  <Box
                    cursor="pointer"
                    onClick={() => handleCopyClick(key.prefix, index)}
                  >
                    {copiedIndex === index ? (
                      <CheckIcon width="20px" height="20px" fill="#2B8C4D" />
                    ) : (
                      <CopySolidIcon width="20px" height="20px" />
                    )}
                  </Box>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Badge
                    colorScheme={key.isActive ? "green" : "red"}
                    borderRadius="4px"
                    px={2}
                  >
                    {key.isActive ? t("dataAPI.active") : t("dataAPI.inactive")}
                  </Badge>
                  {key.isActive && (
                    <Button
                      size="sm"
                      color="#2B8C4D"
                      backgroundColor="#FFF"
                      border="1px solid #2B8C4D"
                      _hover={{
                        backgroundColor: "#FFF",
                        color: "#22703E",
                        borderColor: "#22703E",
                      }}
                      onClick={() => window.open("", "_blank")}
                    >
                      {t("dataAPI.addCredits")}
                    </Button>
                  )}
                </Stack>
              </Stack>

              <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                <Box>
                  <BodyText color="#71757A" typography="small">
                    {t("dataAPI.balance")}
                  </BodyText>
                  <BodyText typography="small">
                    {key.balance || 0} {t("dataAPI.reais")}
                  </BodyText>
                </Box>
                <Box>
                  <BodyText color="#71757A" typography="small">
                    {t("dataAPI.created")}
                  </BodyText>
                  <BodyText typography="small">
                    {formatDate(key.createdAt)}
                  </BodyText>
                </Box>
                <Box>
                  <BodyText color="#71757A" typography="small">
                    {t("dataAPI.expires")}
                  </BodyText>
                  <BodyText typography="small">
                    {key.expiresAt
                      ? formatDate(key.expiresAt)
                      : t("dataAPI.never")}
                  </BodyText>
                </Box>
              </Grid>
            </Stack>
          </GridItem>
        ))}
      </Grid>

      <Box borderTop="1px solid #DEDFE0" paddingTop={6}>
        <BodyText typography="small" color="#464A51">
          {t("dataAPI.needMoreKeys")}{" "}
          <Link
            display="inline"
            fontWeight="500"
            color="#0068C5"
            _hover={{
              color: "#0057A4",
            }}
            href="/contact"
          >
            {t("dataAPI.contactUs")}
          </Link>{" "}
          {t("dataAPI.weWillHelpYou")}
        </BodyText>
      </Box>
    </Stack>
  );
}
