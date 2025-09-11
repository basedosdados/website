import React from 'react';
import { useRouter } from "next/router";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import PenIcon from "../../public/img/icons/penIcon"

export default function AdminEdit() {
  const router = useRouter();
  const { dataset, table } = router.query;

  const menuItemProps = {
    letterSpacing: "0.1px",
    lineHeight: "18px",
    fontWeight: "400",
    fontSize: "12px",
    fontFamily: "Roboto",
    color: "#252A32",
    backgroundColor: "#FFF",
    padding: "0 16px 10px",
    _focus: {backgroundColor: "transparent"},
    _hover: {backgroundColor: "transparent", opacity: "0.7"},
  };

  if (!dataset) {
    return null;
  }

  const datasetAdminUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/v1/dataset/${dataset}/change/`;
  const tableAdminUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/v1/table/${table}/change/`;

  return (
    <Menu>
      <MenuButton
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        position="fixed"
        aria-label="Editar"
        width="28px"
        height="28px"
        borderRadius="50%"
        zIndex="11"
        backgroundColor="#2B8C4D"
        padding="25px"
        bottom="20px"
        right="20px"
      >
        <PenIcon
          alt="editar"
          justifyContent="center"
          width="28px"
          height="28px"
          fill="#FFF"
        />
      </MenuButton>
      <MenuList
        boxShadow="0px 1.5px 16px rgba(0, 0, 0, 0.16)"
        _focus={{boxShadow: "0px 1.5px 16px rgba(0, 0, 0, 0.16) !important"}}
        padding="16px 0 6px"
        borderRadius="8px"
        zIndex="11"
        color="#252A32"
      >
        <MenuItem
          {...menuItemProps}
          onClick={() => window.open(datasetAdminUrl, "_blank")}
        >
          Editar Dataset
        </MenuItem>
        {table && (
          <MenuItem
            {...menuItemProps}
            onClick={() => window.open(tableAdminUrl, "_blank")}
          >
            Editar Table
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  )
}