import {
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";

import DownloadIcon from "../../../public/img/icons/downloadIcon";

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
  padding: "16px 0 6px",
  borderRadius: "8px",
  zIndex: "11",
  color: "#252A32",
  minWidth: "180px",
};

const MenuItemProps = {
  letterSpacing: "0.1px",
  lineHeight: "18px",
  fontWeight: "400",
  fontSize: "12px",
  fontFamily: "Roboto",
  color: "#252A32",
  backgroundColor: "#FFF",
  padding: "0 16px 10px",
  _focus: { backgroundColor: "transparent" },
  _hover: { backgroundColor: "transparent", opacity: "0.7" },
};

function getExportErrorInfo(error) {
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
      title: "Resultado expirado",
      description:
        detail || "Estes resultados não estão mais disponíveis para download.",
    };
  }

  if (status === 400) {
    const isTooLarge =
      typeof detail === "string" && detail.toLowerCase().includes("grandes demais");
    return {
      title: isTooLarge ? "Resultado muito grande" : "Formato não suportado",
      description:
        detail ||
        (isTooLarge
          ? "Estes resultados são grandes demais para baixar em um único arquivo."
          : "O formato solicitado não está disponível para download."),
    };
  }

  if (status === 404) {
    return {
      title: "Resultado não encontrado",
      description:
        "Não encontramos esse resultado. Ele pode ter expirado ou pertencer a outra conversa.",
    };
  }

  const message =
    typeof error?.message === "string" ? error.message.replace(/^\[Chatbot\]\s*/, "") : "";

  return {
    title: "Falha ao baixar",
    description: message || "Não foi possível baixar o resultado. Tente novamente.",
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

async function downloadQueryResult({ toast, onExport, messageId, artifact }) {
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
      <DownloadToastContent status="loading" title="Preparando o download..." />
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
      render: () => <DownloadToastContent status="success" title="Download iniciado" />,
    });

    return true;
  } catch (error) {
    console.error("Erro ao exportar resultado da consulta:", error);
    const { title, description } = getExportErrorInfo(error);

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
  const [status, setStatus] = useState("idle");
  const toast = useToast();

  const handleDownload = async (e) => {
    e.stopPropagation();
    if (disabled || status === "loading" || !onExport || !messageId || !artifact) return;

    setStatus("loading");
    const success = await downloadQueryResult({ toast, onExport, messageId, artifact });
    setStatus(success ? "idle" : "error");
    if (!success) {
      setTimeout(() => setStatus("idle"), 2000);
    }
  };

  const label = disabled
    ? "Disponível assim que a resposta terminar"
    : status === "error"
    ? "Falha ao baixar. Tente novamente."
    : "Baixar CSV";

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
  const [statusByRef, setStatusByRef] = useState({});
  const toast = useToast();

  if (!Array.isArray(downloads) || downloads.length === 0) return null;

  const handleDownload = async (artifact) => {
    if (!artifact?.query_ref || !onExport || !messageId || statusByRef[artifact.query_ref] === "loading") {
      return;
    }

    setStatusByRef((prev) => ({ ...prev, [artifact.query_ref]: "loading" }));
    const success = await downloadQueryResult({ toast, onExport, messageId, artifact });
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
            label="Baixar resultados"
            isDisabled={isOpen}
          >
            <MenuButton
              as={Box}
              {...ActionButtonProps}
              cursor="pointer"
              _hover={{
                backgroundColor: "#EEEEEE",
              }}
            >
              <DownloadIcon width="18px" height="18px" />
            </MenuButton>
          </Tooltip>
          <MenuList {...MenuListProps}>
            {downloads.map((artifact) => {
              const status = statusByRef[artifact.query_ref];
              return (
                <MenuItem
                  key={artifact.query_ref}
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
                    <Box as="span" noOfLines={1}>
                      {artifact.slug || "resultado"}
                    </Box>
                    {status === "loading" && (
                      <Spinner width="12px" height="12px" thickness="2px" />
                    )}
                    {status === "error" && (
                      <Box as="span" color="#E53E3E">
                        Erro
                      </Box>
                    )}
                  </Flex>
                </MenuItem>
              );
            })}
          </MenuList>
        </>
      )}
    </Menu>
  );
}
