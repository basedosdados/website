import { Button } from "@chakra-ui/button";
import { Menu, MenuButton, MenuList } from "@chakra-ui/menu";
import React, { useState } from "react";

export function MenuDropdown({ title, children, ...style }) {
  const [open, setOpen] = useState(false);

  return (
    <Menu onMouseExit={() => setOpen(false)} isOpen={open}>
      <MenuButton
        backgroundColor="transparent"
        _hover={{ backgroundColor: "transparent", opacity: "0.6" }}
        onMouseOver={() => setOpen(true)}
        as={Button}
        fontFamily="Ubuntu"
        fontSize="14px"
        letterSpacing="0.3px"
        _active={{ backgroundColor: "transparent" }}
        padding="0px"
        color="#252A32"
        fontWeight="400"
      >
        {title}
      </MenuButton>

        <MenuList
          padding="0px"
          color="#252A32"
          {...style}
          onMouseLeave={() => setOpen(false)}
        >
          {children}
        </MenuList>
      
    </Menu>
  );
}
