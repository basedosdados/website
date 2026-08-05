import {
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { Fragment, useState } from "react";
import { useTranslation } from "next-i18next";

import DownloadIcon from "../../../public/img/icons/downloadIcon";
import TableChartViewIcon from "../../../public/img/icons/tableChartViewIcon";

const ActionTooltipProps = {
  hasArrow: true,
  backgroundColor: "#252A32",
  borderRadius: "8px",
  letterSpacing: "0.1px",
  lineHeight: "18px",
  fontWeight: "400",
  fontSize: "12px",
  fontFamily: "Roboto",
  color: "#FFFFFF",
  padding: "8px 12px",
  boxShadow: "0 2px 16px rgba(0, 0, 0, 0.16)",
  placement: "top-start",
};

const ActionButtonProps = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "8px",
  padding: "8px",
  minWidth: "34px",
  maxWidth: "34px",
  minHeight: "34px",
  maxHeight: "34px",
  boxSizing: "border-box",
  fill: "#464A51",
};

const MenuListProps = {
  boxShadow: "0px 1.5px 16px rgba(0, 0, 0, 0.16)",
  _focus: { boxShadow: "0px 1.5px 16px rgba(0, 0, 0, 0.16) !important" },
  padding: "8px 0",
  borderRadius: "8px",
  zIndex: "11",
  color: "#252A32",
  minWidth: "220px",
};

const MenuItemProps = {
  letterSpacing: "0.1px",
  lineHeight: "20px",
  fontWeight: "500",
  fontSize: "14px",
  fontFamily: "Roboto",
  color: "#252A32",
  backgroundColor: "#FFF",
  padding: "8px 16px",
  _focus: { backgroundColor: "transparent" },
  _hover: { backgroundColor: "transparent", opacity: "0.7" },
};

function getExportErrorInfo(error, t) {
  const status = error?.response?.status;
  const data = error?.response?.data;
  const detail =
    typeof data?.detail === "string"
      ? data.detail
      : typeof data?.error === "string"
      ? data.error
      : null;

  if (status === 410) {
    return {
      title: t("ui.download.errors.expiredTitle"),
      description: detail || t("ui.download.errors.expiredDescription"),
    };
  }

  if (status === 400) {
    const isTooLarge =
      typeof detail === "string" && detail.toLowerCase().includes("grandes demais");
    return {
      title: isTooLarge
        ? t("ui.download.errors.tooLargeTitle")
        : t("ui.download.errors.unsupportedTitle"),
      description:
        detail ||
        (isTooLarge
          ? t("ui.download.errors.tooLargeDescription")
          : t("ui.download.errors.unsupportedDescription")),
    };
  }

  if (status === 404) {
    return {
      title: t("ui.download.errors.notFoundTitle"),
      description: t("ui.download.errors.notFoundDescription"),
    };
  }

  const message =
    typeof error?.message === "string" ? error.message.replace(/^\[Chatbot\]\s*/, "") : "";

  return {
    title: t("ui.download.errors.genericTitle"),
    description: message || t("ui.download.errors.genericDescription"),
  };
}

function DownloadToastContent({ status, title, description }) {
  const dotColor =
    status === "success" ? "#3AC17C" : status === "error" ? "#E53E3E" : "#FFFFFF";

  return (
    <Flex
      width="fit-content"
      maxWidth="320px"
      alignItems="center"
      gap="10px"
      padding="12px 16px"
      backgroundColor="#252A32"
      borderRadius="8px"
      color="#FFF"
      fontFamily="Roboto"
      boxShadow="0px 1.5px 16px rgba(0, 0, 0, 0.16)"
    >
      <Box
        flexShrink={0}
        width="14px"
        height="14px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {status === "loading" ? (
          <Spinner width="14px" height="14px" thickness="2px" color="#FFF" />
        ) : (
          <Box width="8px" height="8px" borderRadius="full" backgroundColor={dotColor} />
        )}
      </Box>
      <Box>
        <Box fontWeight="500" fontSize="14px" lineHeight="20px">
          {title}
        </Box>
        {description && (
          <Box
            fontWeight="400"
            fontSize="12px"
            lineHeight="16px"
            color="rgba(255, 255, 255, 0.75)"
            marginTop="2px"
          >
            {description}
          </Box>
        )}
      </Box>
    </Flex>
  );
}

async function downloadQueryResult({ toast, onExport, messageId, artifact, t }) {
  if (!artifact?.query_ref) {
    console.error("downloadQueryResult: artifact sem query_ref", artifact);
    return false;
  }

  const format = artifact.formats?.[0] || "CSV";
  const toastId = `chatbot-download-${artifact.query_ref}`;

  if (toast.isActive(toastId)) {
    toast.close(toastId);
  }

  toast({
    id: toastId,
    duration: null,
    position: "bottom",
    render: () => (
      <DownloadToastContent
        status="loading"
        title={t("ui.download.preparing")}
      />
    ),
  });

  try {
    const url = await onExport(messageId, artifact.query_ref, format);
    if (!url) throw new Error("URL de download vazia");

    const link = document.createElement("a");
    link.href = url;
    link.download = `${artifact.slug || "resultado"}.${format.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    link.remove();

    toast.update(toastId, {
      duration: 2500,
      render: () => (
        <DownloadToastContent status="success" title={t("ui.download.started")} />
      ),
    });

    return true;
  } catch (error) {
    console.error("Erro ao exportar resultado da consulta:", error);
    const { title, description } = getExportErrorInfo(error, t);

    toast.update(toastId, {
      duration: 6000,
      isClosable: true,
      render: () => (
        <DownloadToastContent status="error" title={title} description={description} />
      ),
    });

    return false;
  }
}

export function DownloadResultButton({ messageId, artifact, onExport, disabled }) {
  const { t } = useTranslation("chatbot");
  const [status, setStatus] = useState("idle");
  const toast = useToast();

  const handleDownload = async (e) => {
    e.stopPropagation();
    if (disabled || status === "loading" || !onExport || !messageId || !artifact) return;

    setStatus("loading");
    const success = await downloadQueryResult({ toast, onExport, messageId, artifact, t });
    setStatus(success ? "idle" : "error");
    if (!success) {
      setTimeout(() => setStatus("idle"), 2000);
    }
  };

  const label = disabled
    ? t("ui.download.availableWhenDone")
    : status === "error"
    ? t("ui.download.retry")
    : t("ui.download.csv");

  return (
    <Tooltip {...ActionTooltipProps} label={label}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="16px"
        height="16px"
        flexShrink={0}
        cursor={disabled ? "not-allowed" : "pointer"}
        opacity={disabled ? 0.4 : 1}
        fill={status === "error" ? "#E53E3E" : "#252A32"}
        onClick={handleDownload}
      >
        {status === "loading" ? (
          <Spinner width="14px" height="14px" thickness="2px" />
        ) : (
          <DownloadIcon width="18px" height="18px" />
        )}
      </Box>
    </Tooltip>
  );
}

export function DownloadResultsButton({ messageId, downloads, onExport }) {
  const { t } = useTranslation("chatbot");
  const [statusByRef, setStatusByRef] = useState({});
  const toast = useToast();

  if (!Array.isArray(downloads) || downloads.length === 0) return null;

  const handleDownload = async (artifact) => {
    if (!artifact?.query_ref || !onExport || !messageId || statusByRef[artifact.query_ref] === "loading") {
      return;
    }

    setStatusByRef((prev) => ({ ...prev, [artifact.query_ref]: "loading" }));
    const success = await downloadQueryResult({ toast, onExport, messageId, artifact, t });
    setStatusByRef((prev) => ({ ...prev, [artifact.query_ref]: success ? null : "error" }));
    if (!success) {
      setTimeout(() => {
        setStatusByRef((prev) => ({ ...prev, [artifact.query_ref]: null }));
      }, 2000);
    }
  };

  return (
    <Menu placement="top-start">
      {({ isOpen }) => (
        <>
          <Tooltip
            {...ActionTooltipProps}
            label={t("ui.download.label")}
            isDisabled={isOpen}
          >
            <MenuButton
              as={Box}
              {...ActionButtonProps}
              cursor="pointer"
              position="relative"
              _hover={{
                backgroundColor: "#EEEEEE",
              }}
            >
              <DownloadIcon width="18px" height="18px" position="absolute" top="8px"/>
            </MenuButton>
          </Tooltip>
          <MenuList {...MenuListProps}>
            {downloads.map((artifact, index) => {
              const status = statusByRef[artifact.query_ref];
              const format = (artifact.formats?.[0] || "CSV").toLowerCase();
              const fileName = `${artifact.slug || "resultado"}.${format}`;
              return (
                <Fragment key={artifact.query_ref}>
                  {index > 0 && (
                    <MenuDivider margin="0" borderColor="#DEDFE0" />
                  )}
                  <MenuItem
                    {...MenuItemProps}
                    onClick={() => handleDownload(artifact)}
                    isDisabled={status === "loading"}
                  >
                    <Flex
                      alignItems="center"
                      justifyContent="space-between"
                      width="100%"
                      gap="8px"
                    >
                      <Flex alignItems="center" gap="8px" minWidth={0} flex={1}>
                        <TableChartViewIcon
                          width="16px"
                          height="16px"
                          flexShrink={0}
                          color="#464A51"
                        />
                        <Box as="span" noOfLines={1} color="#252A32">
                          {fileName}
                        </Box>
                      </Flex>
                      {status === "loading" && (
                        <Spinner width="12px" height="12px" thickness="2px" />
                      )}
                      {status === "error" && (
                        <Box as="span" color="#E53E3E">
                          {t("ui.error")}
                        </Box>
                      )}
                    </Flex>
                  </MenuItem>
                </Fragment>
              );
            })}
          </MenuList>
        </>
      )}
    </Menu>
  );
}
