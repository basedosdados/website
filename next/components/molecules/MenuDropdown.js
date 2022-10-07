import React, { useRef, useState } from "react";
import { Button } from "@chakra-ui/button";
import { Menu, MenuButton, MenuList } from "@chakra-ui/menu";
import { Box } from "@chakra-ui/react"
import ArrowIcon from "../../public/img/icons/arrowIcon"

export function MenuDropdown({ title, children, ...style }) {
  const timerRef = useRef();
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const btnMouseEnterEvent = () => {
    setIsOpenMenu(true)
  }
  const btnMouseLeaveEvent = () => {
    timerRef.current = setTimeout(() => {
      setIsOpenMenu(false)
    }, 100)
  }
  const menuListMouseEnterEvent = () => {
    clearTimeout(timerRef.current)
    timerRef.current = undefined
    setIsOpenMenu(true)
  }
  const menuListMouseLeaveEvent = () => {
    setIsOpenMenu(false)
  }

  return (
    <Menu isOpen={isOpenMenu}>
      <MenuButton
        backgroundColor="transparent"
        _hover={{ backgroundColor: "transparent", opacity: "0.6" }}
        onMouseEnter={btnMouseEnterEvent}
        onMouseLeave={btnMouseLeaveEvent}
        as={Button}
        fontFamily="Ubuntu"
        fontSize="14px"
        letterSpacing="0.3px"
        _active={{ backgroundColor: "transparent" }}
        padding="0px"
        color="#252A32"
        fontWeight="400"
      >
        <Box display="flex">
          {title}
          <ArrowIcon
            widthIcon="12px"
            marginLeft="6px"
            chevron={true}
            rotation={"rotate(90deg)"}
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
  )
}