import {
  Input,
  InputGroup,
  InputRightAddon,
  InputRightElement,
  InputLeftElement
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function ControlledInput({
  placeholder,
  value,
  onChange,
  onEnterPress,
  rightIcon = null,
  rightAddon,
  inputBackgroundColor = null,
  inputStyle,
  isBorderColor = true,
  inputElementStyle,
  autoComplete,
  ...props
}) {
  async function checkForEnter(e) {
    if (e.key === "Enter" && onEnterPress) {
      onEnterPress();
    }
  }

  return (
    <InputGroup flex="1" {...props}>
      <Input
        onKeyDown={checkForEnter}
        fontFamily="Lato"
        variant="outline"
        letterSpacing="0.5px"
        fontWeight="300"
        _placeholder={{ color: "#A3A3A3" }}
        border="1px solid #DEDFE0 !important"
        _focus={isBorderColor && { border:"2px solid #42B0FF !important" }}
        _hover={isBorderColor && { border:"2px solid #42B0FF !important" }}
        backgroundColor={inputBackgroundColor}
        borderRadius="20px"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        {...inputStyle}
      />
      <InputRightElement
        height="100%"
        padding="8px"
        marginRight="5px"
        children={rightIcon}
        {...inputElementStyle}
      />
      {rightAddon ? <InputRightAddon children={rightAddon} /> : <></>}
    </InputGroup>
  );
}

export function DebouncedControlledInput({
  placeholder,
  variant,
  value,
  onChange,
  onEnterPress,
  rightIcon = null,
  rightAddon,
  inputBackgroundColor = null,
  inputStyle,
  isBorderColor = true,
  inputElementStyle,
  ...props
}) {
  const [skipFirstDebounced, setSkipFirstDebounced] = useState(true)
  const [_value, _setValue] = useState(value);
  const [_timeout, _setTimeout] = useState(null);

  useEffect(() => {
    clearTimeout(_timeout);
    _setTimeout(setTimeout(() => {
      if(!skipFirstDebounced) onChange(_value)
      setSkipFirstDebounced(false)
    }, 1000));
  }, [_value]);

  useEffect(() => {
    _setValue(value);
  }, [value]);

  return (
    <InputGroup variant={variant} flex="1" {...props}>
      <Input
        fontFamily="Lato"
        letterSpacing="0.5px"
        fontWeight="300"
        _placeholder={{ color: "#A3A3A3" }}
        border="1px solid #DEDFE0 !important"
        _focus={isBorderColor && { border:"2px solid #42B0FF !important" }}
        _hover={isBorderColor && { border:"2px solid #42B0FF !important" }}
        backgroundColor={inputBackgroundColor}
        borderRadius="20px"
        value={_value}
        placeholder={placeholder}
        onChange={(e) => _setValue(e.target.value)}
        {...inputStyle}
      />
      <InputRightElement
        height="100%"
        padding="8px"
        marginRight="5px"
        children={rightIcon}
        {...inputElementStyle}
      />
      {rightAddon ? <InputRightAddon children={rightAddon} /> : <></>}
    </InputGroup>
  );
}

export function ControlledInputMenu({
  refInput = null,
  placeholder,
  value,
  onChange,
  onEnterPress,
  inputFocus,
  changeInputFocus,
  icon = null,
  inputStyle,
  inputElementStyle,
  fill,
  fillHover,
  ...props
}) {
  async function checkForEnter(e) {
    if (e.key === "Enter" && onEnterPress) {
      onEnterPress();
    }
  }

  return (
    <InputGroup
      maxWidth="480px"
      width="480px"
      alignSelf="center"
      justifyContent="center"
      fill={fill}
      _hover={{
        fill: inputFocus ? fill : fillHover
      }}
      {...props}
    >
      <InputLeftElement
        width="24px"
        height="24px"
        margin="8px 8px 8px 16px"
        children={icon}
        {...inputElementStyle}
      />

      <Input
        ref={refInput}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={checkForEnter}
        onFocus={() => changeInputFocus(true)}
        onBlur={() => changeInputFocus(false)}
        autoComplete="off"
        variant="outline"
        letterSpacing="0.5px"
        border="2px solid transparent !important"
        color="#464A51"
        _hover={{
          border:"2px solid transparent !important",
          backgroundColor: "#F3F3F3",
          _placeholder:{color: "#878A8E"}
        }}
        _focus={{
          border:"2px solid #0068C5 !important",
          backgroundColor: "#FFF",
          _placeholder:{color: "#464A51"}
        }}
        paddingLeft="52px !important"
        backgroundColor="#EEEEEE"
        height="40px"
        fontSize="14px"
        lineHeight="20px"
        width="100%"
        fontFamily="Roboto"
        fontWeight="400"
        borderRadius="14px"
        _placeholder={{color: "#464A51"}}
        {...inputStyle}
      />
    </InputGroup>
  )
}