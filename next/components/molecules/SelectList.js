import {
  Stack,
  Text,
  Button,
  Tooltip
} from "@chakra-ui/react";
import { useState } from "react";
import ChevronIcon from "../../public/img/icons/chevronIcon";

export default function SelectList({list, hasNode}) {
  const defaultList = list
  const [selected, setSelected] = useState({})
  const [listOptions, setListOptions] = useState(defaultList)
  const [newList, setNewList] = useState([])

  const handlerClick = (e) => {
    setSelected(e)
  }

  function sortName(a, b) {
    const nameA = hasNode ? a.node.name : a.nome
    const nameB = hasNode ? b.node.name : b.nome
  
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  }

  const addItem = () => {
    if(selected == null) return null

    const newArray = listOptions.filter(res => res !== selected)

    setListOptions(newArray)
    setNewList([...newList, selected].sort(sortName))
    setSelected({})
  }

  const removeItem = () => {
    if(selected == null) return null

    const newArray = newList.filter(res => res !== selected)
    setNewList(newArray)
    setListOptions([...listOptions, selected].sort(sortName))
    setSelected({})
  }

  const removeAll = () => {
    setListOptions(defaultList)
    setNewList([])
    setSelected({})
  }

  return (
    <Stack
      flexDirection="row"
      width="100%"
      gap="16px"
      padding="20px"
      border="2px solid #FAFAFA"
      spacing={0}
      color="#252A32"
      fontFamily="Lato"
    >
      <Stack
        flex={1}
        height="300px"
        overflowY="scroll"
        padding="8px"
        border="2px solid #FAFAFA"
      >
        {listOptions.map((elm) =>
          <Text
            cursor="pointer"
            color={selected === elm ? "#42B0FF" : "#252A32"}
            _hover={{color:"#42B0FF"}}
            onClick={() => handlerClick(elm)}
          >
            {hasNode ? elm.node.name : elm.name}
          </Text>
        )}
      </Stack>

      <Stack justifyContent="center">
        <Tooltip
          hasArrow
          label="Adicionar item"
        >
          <Button
            onClick={() => addItem()}
            backgroundColor="#42B0FF"
            _hover={{backgroundColor:"none", opacity: 0.8}}
          >
            <ChevronIcon fill="#FFF"/>
          </Button>
        </Tooltip>
        <Tooltip
          hasArrow
          label="Remover item"
        >
          <Button
            onClick={() => removeItem()}
            backgroundColor="#42B0FF"
            _hover={{backgroundColor:"none", opacity: 0.8}}
          >
            <ChevronIcon fill="#FFF" transform="rotate(180deg)"/>
          </Button>
        </Tooltip>
        <Tooltip
          hasArrow
          label="Remover tudo"
        >
          <Button
            onClick={() => removeAll()}
            backgroundColor="#42B0FF"
            color="#FFF"
            fontWeight="400"
            _hover={{backgroundColor:"none", opacity: 0.8}}
          >
            X
          </Button>
        </Tooltip>
      </Stack>

      <Stack
        flex={1}
        height="300px"
        overflowY="scroll"
        padding="8px"
        border="2px solid #FAFAFA"
      >
        {newList.map((elm) => 
          <Text
            cursor="pointer"
            color={selected === elm ? "#42B0FF" : "#252A32"}
            _hover={{color:"#42B0FF"}}
            onClick={() => handlerClick(elm)}
          >
            {hasNode ? elm.node.name : elm.name}
          </Text>
        )}
      </Stack>
    </Stack>
  )
}
