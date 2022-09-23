import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Tooltip
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";

export default function HelpWidget({options, tooltip}) {
  const { isOpen } = useDisclosure()

  const optionsRender = (options) => {
    return options.map((option) => {
      if(option.name){ return (
        <MenuItem
          letterSpacing="0.3px"
          lineHeight="16px"
          fontWeight="400"
          fontSize="12px"
          fontFamily="ubuntu"
          backgroundColor="#FFF"
          color="#252A32"
          padding="0 16px 10px"
          _focus={{backgroundColor: "transparent"}}
          _hover={{backgroundColor: "transparent", opacity: "0.6"}}
          onClick={() => window.open(option.url, "_blank")}
        >
          {option.name}
        </MenuItem>)
      } else { return <MenuDivider margin="0 0 14px"/> }
    })
  }

  return (
    <Menu>
      {({ isOpen }) => (
        <>
          <Tooltip 
            backgroundColor="#FFF"
            borderRadius="8px"
            color="#252A32"
            fontSize="12px"
            fontWeight="400"
            fontFamily="ubuntu"
            lineHeight="16px"
            letterSpacing="0.3px"
            padding="8px 12px"
            boxShadow="0 2px 16px rgba(0, 0, 0, 0.16)"
            placement="top-start"
            label={tooltip}
            isDisabled={isOpen && true}
          >
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
              isActive={isOpen}
            >
              ?
            </MenuButton>
          </Tooltip>
          <MenuList
            boxShadow="0px 1.5px 16px rgba(0, 0, 0, 0.16)"
            _focus={{boxShadow: "0px 1.5px 16px rgba(0, 0, 0, 0.16) !important"}}
            padding="16px 0 6px"
            borderRadius="8px"
            zIndex="11"
            color="#252A32"
          >
            {optionsRender(options)}
          </MenuList>
        </>
      )}
    </Menu>
  )
}