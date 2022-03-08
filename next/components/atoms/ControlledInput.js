import {
  Input,
  InputGroup,
  InputRightAddon,
  InputRightElement,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function ControlledInput({
  placeholder,
  variant,
  value,
  onChange,
  onEnterPress,
  rightIcon = null,
  rightAddon,
  inputBackgroundColor = null,
  inputStyle,
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
        border="1px solid #DEDFE0"
        _hover={{ borderColor: "#42B0FF" }}
        focusBorderColor="#42B0FF"
        backgroundColor={inputBackgroundColor}
        borderRadius="20px"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        {...inputStyle}
      />
      <InputRightElement
        height="100%"
        padding="8px"
        marginRight="5px"
        children={rightIcon}
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
  ...props
}) {
  const [_value, _setValue] = useState(value);
  const [_timeout, _setTimeout] = useState(null);

  useEffect(() => {
    clearTimeout(_timeout);
    _setTimeout(setTimeout(() => onChange(_value), 200));
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
        _hover={{ borderColor: "#42B0FF" }}
        _placeholder={{ color: "#BDBDBD" }}
        border="1px solid #DEDFE0"
        focusBorderColor="#42B0FF"
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
      />
      {rightAddon ? <InputRightAddon children={rightAddon} /> : <></>}
    </InputGroup>
  );
}
