import { Button } from "@chakra-ui/button";
import { Menu, MenuButton, MenuList } from "@chakra-ui/menu";
import React, { useState } from "react";

export function MenuDropdown({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <Menu onMouseExit={() => setOpen(false)} isOpen={open}>
      <MenuButton
        backgroundColor="transparent"
        _hover={{ backgroundColor: "transparent" }}
        onMouseOver={() => setOpen(true)}
        as={Button}
        fontFamily="Lato"
        fontSize="14px"
        letterSpacing="0.15em"
        _active={{ backgroundColor: "transparent" }}
        padding="0px"
        color="black"
        fontWeight="700"
      >
        {title}
      </MenuButton>
      <MenuList
        maxW="30px"
        padding="0px"
        marginLeft="-13px"
        marginTop="-10px"
        onMouseLeave={() => setOpen(false)}
      >
        {children}
      </MenuList>
    </Menu>
  );
}
