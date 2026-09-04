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
import BracesIcon from "../../../public/img/icons/bracesIcon";
import FileGenericIcon from "../../../public/img/icons/fileGenericIcon";

// Per-format icon + accent for the export download card: table icon (green) for CSV,
// braces (yellow) for JSONL, generic file (blue) for AVRO/PARQUET and anything else.
const EXPORT_FORMAT_STYLES = {
  CSV: { Icon: TableChartViewIcon, color: "#3AC17C", tint: "rgba(58, 193, 124, 0.16)" },
  JSONL: { Icon: BracesIcon, color: "#F2C94C", tint: "rgba(242, 201, 76, 0.16)" },
  JSON: { Icon: BracesIcon, color: "#F2C94C", tint: "rgba(242, 201, 76, 0.16)" },
  AVRO: { Icon: FileGenericIcon, color: "#5B9DF0", tint: "rgba(91, 157, 240, 0.16)" },
  PARQUET: { Icon: FileGenericIcon, color: "#5B9DF0", tint: "rgba(91, 157, 240, 0.16)" },
};

const DEFAULT_EXPORT_FORMAT_STYLE = EXPORT_FORMAT_STYLES.AVRO;

function exportFormatStyle(format) {
  return (
    EXPORT_FORMAT_STYLES[String(format || "").toUpperCase()] ||
    DEFAULT_EXPORT_FORMAT_STYLE
  );
}

// AVRO now leads OFFERED_EXPORT_FORMATS on the backend, so `formats[0]` is no longer CSV.
// Prefer CSV when it is offered; otherwise fall back to the first offered format.
function preferredFormat(formats) {
  const list = Array.isArray(formats) ? formats : [];
  return list.find((f) => String(f).toUpperCase() === "CSV") || list[0] || "CSV";
}

function formatFileSize(bytes) {
  if (bytes == null || !Number.isFinite(bytes) || bytes < 0) return null;
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  const decimals = value >= 100 ? 0 : 1;
  const formatted = value.toLocaleString("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${formatted} ${units[unitIndex]}`;
}

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

async function downloadQueryResult({ toast, onExport, messageId, queryRef, format, fileName, t }) {
  if (!queryRef) {
    console.error("downloadQueryResult: queryRef ausente");
    return false;
  }

  const exportFormat = (format || "CSV").toUpperCase();
  const downloadName = fileName || `resultado.${exportFormat.toLowerCase()}`;
  const toastId = `chatbot-download-${queryRef}`;

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
    const url = await onExport(messageId, queryRef, exportFormat);
    if (!url) throw new Error("URL de download vazia");

    const link = document.createElement("a");
    link.href = url;
    link.download = downloadName;
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
    if (disabled || status === "loading" || !onExport || !messageId || !artifact?.query_ref) return;

    setStatus("loading");
    const format = preferredFormat(artifact.formats);
    const success = await downloadQueryResult({
      toast,
      onExport,
      messageId,
      queryRef: artifact.query_ref,
      format,
      fileName: `${artifact.slug || "resultado"}.${format.toLowerCase()}`,
      t,
    });
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

/**
 * A download card for an export artifact the agent produced on request
 * (`{ type: "export", query_ref, format, filename, size_bytes, message_id }`). The file
 * is already materialized on the backend, so the card shows the real filename and exact
 * size and downloads in a single click. The icon and accent color key off the format:
 * table/green for CSV, braces/yellow for JSONL, generic file/blue for AVRO/PARQUET.
 */
export function ExportResultCard({ messageId, artifact, onExport }) {
  const { t } = useTranslation("chatbot");
  const [status, setStatus] = useState("idle");
  const toast = useToast();

  if (!artifact?.query_ref) return null;

  const format = (artifact.format || "CSV").toUpperCase();
  const fileName = artifact.filename || `resultado.${format.toLowerCase()}`;
  const sizeLabel = formatFileSize(artifact.size_bytes);
  const { Icon, color, tint } = exportFormatStyle(format);
  // The export endpoint authorizes by (message_id, query_ref). A result exported from an
  // earlier turn belongs to the message that produced it, which the artifact carries —
  // use it so cross-turn exports resolve, falling back to the message showing the card.
  const targetMessageId = artifact.message_id || messageId;
  const isLoading = status === "loading";

  const subtitle =
    status === "error"
      ? t("ui.download.retry")
      : [format, sizeLabel].filter(Boolean).join(" · ");

  const handleDownload = async () => {
    if (isLoading || !onExport || !targetMessageId) return;

    setStatus("loading");
    const success = await downloadQueryResult({
      toast,
      onExport,
      messageId: targetMessageId,
      queryRef: artifact.query_ref,
      format,
      fileName,
      t,
    });
    setStatus(success ? "idle" : "error");
    if (!success) setTimeout(() => setStatus("idle"), 2000);
  };

  return (
    <Flex
      width="320px"
      minWidth={0}
      alignItems="center"
      gap="12px"
      padding="10px 14px"
      borderRadius="12px"
      backgroundColor="#F7F7F7"
      border="1px solid #E5E7EB"
      cursor={isLoading ? "default" : "pointer"}
      transition="border-color 0.2s ease, background-color 0.2s ease"
      onClick={handleDownload}
      _hover={{ backgroundColor: isLoading ? "#F7F7F7" : "#EFEFEF", borderColor: "#DEDFE0" }}
    >
      <Flex
        flexShrink={0}
        alignItems="center"
        justifyContent="center"
        width="40px"
        height="40px"
        borderRadius="8px"
        backgroundColor={tint}
        color={color}
      >
        <Icon width="20px" height="20px" color="currentColor" />
      </Flex>
      <Box minWidth={0} flex={1}>
        <Box
          fontFamily="Roboto"
          fontWeight="500"
          fontSize="14px"
          lineHeight="20px"
          color="#252A32"
          noOfLines={1}
          wordBreak="break-all"
        >
          {fileName}
        </Box>
        <Box
          fontFamily="Roboto"
          fontWeight="400"
          fontSize="12px"
          lineHeight="16px"
          color={status === "error" ? "#E53E3E" : "#71757A"}
          textTransform={status === "error" ? "none" : "uppercase"}
          letterSpacing="0.2px"
          noOfLines={1}
        >
          {subtitle}
        </Box>
      </Box>
      <Flex
        flexShrink={0}
        alignItems="center"
        justifyContent="center"
        width="28px"
        height="28px"
        borderRadius="8px"
        color={status === "error" ? "#E53E3E" : "#464A51"}
        fill={status === "error" ? "#E53E3E" : "#464A51"}
        transition="color 0.2s ease, background-color 0.2s ease"
        _hover={{ color: "#252A32", fill: "#252A32", backgroundColor: "#EEEEEE" }}
      >
        {isLoading ? (
          <Spinner width="14px" height="14px" thickness="2px" color="currentColor" />
        ) : (
          <DownloadIcon width="18px" height="18px" fill="currentColor" />
        )}
      </Flex>
    </Flex>
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
    const format = preferredFormat(artifact.formats);
    const success = await downloadQueryResult({
      toast,
      onExport,
      messageId,
      queryRef: artifact.query_ref,
      format,
      fileName: `${artifact.slug || "resultado"}.${format.toLowerCase()}`,
      t,
    });
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
              const format = preferredFormat(artifact.formats).toLowerCase();
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
