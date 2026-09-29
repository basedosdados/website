import { HStack, Select } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import {
  PhoneCountries,
  getPhoneCountry,
  handlePhoneInputChange,
} from "../../utils";
import { InputForm } from "./uiUserPage";

const PhoneSelectProps = {
  width: "108px",
  minWidth: "108px",
  height: "40px",
  backgroundColor: "#EEEEEE",
  border: "2px solid transparent",
  borderRadius: "8px",
  fontSize: "14px",
  lineHeight: "20px",
  fontFamily: "Roboto",
  fontWeight: "400",
  color: "#464A51",
  iconColor: "#464A51",
  cursor: "pointer",
  flexShrink: 0,
  _hover: {
    border: "2px solid transparent",
    backgroundColor: "#DEDFE0",
  },
  _focus: {
    border: "2px solid #0068C5",
    backgroundColor: "#FFF",
  },
  _invalid: {
    backgroundColor: "#F6E3E3",
  },
}

export default function PhoneInput({
  callingCode,
  onCallingCodeChange,
  value,
  onChange,
  optional = false,
  ...props
}) {
  const { t } = useTranslation("user")
  const { locale } = useRouter()
  const showCallingCodeSelect = locale !== "pt"
  const country = getPhoneCountry(callingCode)
  const placeholder = optional
    ? `${country.placeholder} ${t("signup.optionalParenthetical")}`
    : country.placeholder

  const PhoneField = (
    <InputForm
      id="phone"
      name="phone"
      type="tel"
      autoComplete="tel"
      inputMode="numeric"
      value={value}
      onChange={(e) => onChange(handlePhoneInputChange(value, e.target.value, callingCode))}
      placeholder={placeholder}
      inputGroupStyle={{ width: "100%" }}
      {...props}
    />
  )

  if (!showCallingCodeSelect) return PhoneField

  return (
    <HStack spacing="8px" width="100%" align="stretch">
      <Select
        value={callingCode}
        onChange={(e) => onCallingCodeChange(e.target.value)}
        aria-label={t("signup.phoneCallingCode")}
        {...PhoneSelectProps}
      >
        {PhoneCountries.map((option) => (
          <option key={option.callingCode} value={option.callingCode}>
            +{option.callingCode} {option.iso}
          </option>
        ))}
      </Select>
      {PhoneField}
    </HStack>
  )
}
