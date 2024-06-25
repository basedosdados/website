import {
  Checkbox,
  Icon
} from '@chakra-ui/react';

function CustomCheckbockIcon({ variant, isChecked, ...props }) {
  const variantIcon = () => {
    if(variant === "lessCheck") return "M5.06135 11.0002C4.76599 11.0002 4.51496 10.9029 4.30826 10.7084C4.10157 10.514 3.99823 10.2778 3.99823 9.99984C3.99823 9.72193 4.10157 9.48573 4.30826 9.29124C4.51496 9.09676 4.76599 8.99951 5.06135 8.99951H14.9391C15.2344 8.99951 15.4855 9.09676 15.6922 9.29124C15.8988 9.48573 16.0022 9.72193 16.0022 9.99984C16.0022 10.2778 15.8988 10.514 15.6922 10.7084C15.4855 10.9029 15.2344 11.0002 14.9391 11.0002H5.06135Z"
    return "M7.17894 10.9259L13.306 4.7988C13.5043 4.60057 13.7378 4.50146 14.0068 4.50146C14.2758 4.50146 14.5094 4.60057 14.7076 4.7988C14.9058 4.99702 15.0049 5.23196 15.0049 5.50364C15.0049 5.7753 14.9058 6.01024 14.7076 6.20846L7.87972 13.0444C7.6815 13.2427 7.44791 13.3418 7.17894 13.3418C6.90998 13.3418 6.67639 13.2427 6.47817 13.0444L3.2943 9.86058C3.09609 9.66236 2.99834 9.42742 3.00103 9.15576C3.00373 8.88408 3.10418 8.64914 3.30241 8.45091C3.50063 8.25269 3.73557 8.15358 4.00725 8.15358C4.27891 8.15358 4.51385 8.25269 4.71207 8.45091L7.17894 10.9259Z"
  }

  return (
    <Icon
      backgroundColor="#2b8c4d"
      boxSizing="border-box"
      borderColor="#2b8c4d"
      width="20px"
      height="20px"
      viewBox="0 0 18 18"
      _focus={{
        boxShadow: "none",
        outline: "none"
      }}
      {...props}
    >
      <path fill="currentColor" d={variantIcon()}/>
    </Icon>
  )
}

export default function CustomCheckbox({ children, icon, ...props}) {
  return (
    <Checkbox
      width="20px"
      height="20px"
      borderRadius="4px"
      borderWidth="3px"
      borderColor="#878A8E"
      backgroundColor="#FFF"
      overflow="hidden"
      _checked={{
        borderColor: "#2b8c4d",
        backgroundColor: "#2b8c4d",
      }}
      _focus={{
        boxShadow: "none",
        outline: "none"
      }}
      icon={<CustomCheckbockIcon {...icon}/>}
      {...props}
    >
      {children}
    </Checkbox>
  )
}