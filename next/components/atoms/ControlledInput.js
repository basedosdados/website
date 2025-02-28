import {
  Input,
  InputGroup,
  InputRightAddon,
  InputRightElement,
  InputLeftElement,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

export function ControlledInput({
  placeholder,
  value,
  onChange,
  onEnterPress,
  rightIcon = null,
  rightAddon,
  inputStyle,
  inputElementStyle,
  ...props
}) {
  async function checkForEnter(e) {
    if (e.key === "Enter" && onEnterPress) {
      onEnterPress();
    }
  }

  return (
    <InputGroup
      width="100%"
      alignSelf="center"
      justifyContent="center"
      {...props}
    >
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={checkForEnter}
        variant="outline"
        padding={{ base: "24px 48px 24px 20px", lg: "24px 64px 24px 32px" }}
        height={{ base: "50px", lg: "80px" }}
        backgroundColor="#FFFFFF"
        borderRadius={{ base: "18px", lg: "25px" }}
        placeholder={placeholder}
        _placeholder={{
          color: "#717571",
        }}
        boxShadow="0 1px 8px 1px rgba(64, 60, 67, 0.16) !important"
        border="0"
        fontFamily="Roboto"
        fontWeight="400"
        fontSize={{ base: "16px", lg: "20px" }}
        lineHeight={{ base: "24px", lg: "30px" }}
        color="#252A32"
        {...inputStyle}
      />
      <InputRightElement
        height="100%"
        width="fit-content"
        padding="8px"
        marginRight="5px"
        children={rightIcon}
        {...inputElementStyle}
      />
      {rightAddon ? <InputRightAddon children={rightAddon} /> : <></>}
    </InputGroup>
  );
}

export function DebouncedSimpleControlledInput({
  placeholder,
  value,
  onChange,
  icon = null,
  inputStyle,
  inputElementStyle,
  fill,
  ...props
}) {
  const [skipFirstDebounced, setSkipFirstDebounced] = useState(true);
  const [_value, _setValue] = useState(value);
  const [_timeout, _setTimeout] = useState(null);

  useEffect(() => {
    clearTimeout(_timeout);
    _setTimeout(
      setTimeout(() => {
        if (!skipFirstDebounced) onChange(_value);
        setSkipFirstDebounced(false);
      }, 1000),
    );
  }, [_value]);

  useEffect(() => {
    _setValue(value);
  }, [value]);

  return (
    <InputGroup
      maxWidth="480px"
      width="480px"
      alignSelf="center"
      justifyContent="center"
      fill={fill}
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
        value={_value}
        placeholder={placeholder}
        onChange={(e) => _setValue(e.target.value)}
        autoComplete="off"
        variant="outline"
        border="2px solid transparent !important"
        color="#464A51"
        _hover={{
          border: "2px solid transparent !important",
          backgroundColor: "#DEDFE0",
        }}
        _focus={{
          border: "2px solid #0068C5 !important",
          backgroundColor: "#FFF",
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
        _placeholder={{ color: "#464A51", opacity: 1 }}
        {...inputStyle}
      />
    </InputGroup>
  );
}

export function ControlledInputSimple({
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
        border="2px solid transparent !important"
        color="#464A51"
        _hover={{
          border: "2px solid transparent !important",
          backgroundColor: "#DEDFE0",
        }}
        _focus={{
          border: "2px solid #0068C5 !important",
          backgroundColor: "#FFF",
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
        _placeholder={{ color: "#464A51", opacity: 1 }}
        {...inputStyle}
      />
    </InputGroup>
  );
}
