import {Input, InputGroup, InputRightElement} from '@chakra-ui/react'

export default function ControlledInput({placeholder, variant, value, onChange, rightIcon=null, inputBackgroundColor=null, inputStyle, ...props}){
    return(
        <InputGroup variant={variant} flex="1" {...props}>
            <Input fontFamily="Lato" letterSpacing="0.1em" fontWeight="300" border="0px" boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)" backgroundColor={inputBackgroundColor} borderRadius="20px" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} {...inputStyle}/>
            <InputRightElement height="100%" padding="8px" marginRight="5px" children={rightIcon} />
        </InputGroup>
    )
}