import React, { useRef, useState } from "react";
import { Box, Menu, MenuButton, MenuList, Button } from "@chakra-ui/react";
import ChevronIcon from "../../public/img/icons/chevronIcon";

export default function MenuDropdown({ title, children, ...style }) {
  const timerRef = useRef();
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const btnMouseEnterEvent = () => {
    setIsOpenMenu(true);
  };
  const btnMouseLeaveEvent = () => {
    timerRef.current = setTimeout(() => {
      setIsOpenMenu(false);
    }, 100);
  };
  const menuListMouseEnterEvent = () => {
    clearTimeout(timerRef.current);
    timerRef.current = undefined;
    setIsOpenMenu(true);
  };
  const menuListMouseLeaveEvent = () => {
    setIsOpenMenu(false);
  };

  return (
    <Menu isOpen={isOpenMenu}>
      <MenuButton
        backgroundColor="transparent"
        _hover={{ backgroundColor: "transparent", opacity: "0.7" }}
        onMouseEnter={btnMouseEnterEvent}
        onMouseLeave={btnMouseLeaveEvent}
        as={Button}
        fontFamily="Roboto"
        fontSize="14px"
        _active={{ backgroundColor: "transparent" }}
        padding="0px"
        color="#252A32"
        fontWeight="400"
      >
        <Box display="flex">
          {title}
          <ChevronIcon
            alt=""
            width="12px"
            marginLeft="6px"
            transform={"rotate(90deg)"}
          />
        </Box>
      </MenuButton>

      <MenuList
        onMouseEnter={menuListMouseEnterEvent}
        onMouseLeave={menuListMouseLeaveEvent}
        padding="0px"
        color="#252A32"
        {...style}
      >
        {children}
      </MenuList>
    </Menu>
  );
}
