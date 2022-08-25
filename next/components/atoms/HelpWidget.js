import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider
} from "@chakra-ui/react";

export default function HelpWidget({options}) {

  return (
    <Menu>
      <MenuButton
        width="50px"
        height="50px"
        background="#2B8C4D"
        borderRadius="50%"
        zIndex="11"
        position="fixed"
        bottom="40px"
        right="40px"
        fontSize="26px"
        color="#FFF"
      >
        ?
      </MenuButton>
      <MenuList
        // boxShadow="0px 1.5px 16px rgba(0, 0, 0, 0.16)"
        zIndex="11"
      >
        {options.map((option) => {
          if(option.name) {return <MenuItem>{option.name}</MenuItem>}
          else {return <MenuDivider/>}
        })}
      </MenuList>
    </Menu>
  )
}