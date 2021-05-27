import {Input, InputGroup, InputRightElement} from '@chakra-ui/react'

export default function ControlledInput({placeholder, value, onChange, rightIcon=null, padding="0px", inputBackgroundColor=null}){
    return(
        <InputGroup variant="filled" flex="1">
            <Input boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)" backgroundColor={inputBackgroundColor} borderRadius="20px" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} padding={padding}/>
            <InputRightElement padding="8px" marginRight="5px" children={rightIcon} />
        </InputGroup>
    )
}