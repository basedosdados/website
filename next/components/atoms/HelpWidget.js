import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Tooltip
} from "@chakra-ui/react";
import HelpIcon from "../../public/img/icons/helpIcon"

export default function HelpWidget({options, tooltip}) {
  const optionsRender = (options) => {
    return options.map((option, i) => {
      if(option.name){ return (
        <MenuItem
          key={i}
          letterSpacing="0.1px"
          lineHeight="18px"
          fontWeight="400"
          fontSize="12px"
          fontFamily="Roboto"
          color="#252A32"
          backgroundColor="#FFF"
          padding="0 16px 10px"
          _focus={{backgroundColor: "transparent"}}
          _hover={{backgroundColor: "transparent", opacity: "0.6"}}
          onClick={() => window.open(option.url, "_blank")}
        >
          {option.name}
        </MenuItem>)
      } else { return <MenuDivider key={i} margin="0 0 14px"/> }
    })
  }

  return (
    <Menu>
      {({ isOpen }) => (
        <>
          <Tooltip 
            backgroundColor="#FFF"
            borderRadius="8px"
            letterSpacing="0.1px"
            lineHeight="18px"
            fontWeight="400"
            fontSize="12px"
            fontFamily="Roboto"
            color="#252A32"
            padding="8px 12px"
            boxShadow="0 2px 16px rgba(0, 0, 0, 0.16)"
            placement="top-start"
            label={tooltip}
            isDisabled={isOpen && true}
          >
            <MenuButton
              aria-label="Menu de ajuda"
              width="50px"
              height="50px"
              background="#2B8C4D"
              borderRadius="50%"
              zIndex="11"
              boxShadow="0 1.6px 16px rgba(100, 96, 103, 0.3)"
              position="fixed"
              bottom={{ base: "20px", lg: "40px" }}
              right={{ base: "20px", lg: "40px" }}
            >
              <HelpIcon alt="menu de ajuda" justifyContent="center" width="25px" height="25px" fill="white"/>
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