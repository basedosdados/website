import { Button, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { SimpleTable } from '../atoms/SimpleTable';

export function ExpandableTable({
  headers,
  values,
  containerStyle,
}) {
  const [expanded, setExpanded] = useState(false);

  if (values.length <= 5)
    return (  
      <SimpleTable
        headers={headers}
        values={values}
        containerStyle={containerStyle}
      />
    )

  return (
    <VStack width="100%" spacing={5}>
      <SimpleTable
        headers={headers}
        values={expanded ? values : values.slice(0, Math.min(5, values.length))}
        containerStyle={containerStyle}
      />

      <Button
        width="100%"
        backgroundColor="#E3E3E3"
        color="#525252"
        fontSize="14px"
        marginTop="5px !important"
        minHeight="30px !important"
        maxHeight="30px !important"
        _hover={{backgroundColor:"", opacity:"0.6"}}
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? "Ver menos" : "Ver mais"}
      </Button>
    </VStack>
  )
}
