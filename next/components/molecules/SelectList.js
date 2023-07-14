import {
  Stack,
  Text,
  Button,
  Tooltip
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import FuzzySearch from 'fuzzy-search';
import ChevronIcon from "../../public/img/icons/chevronIcon";
import SimpleInput from "../atoms/SimpleInput";

export default function SelectList({
  value,
  list,
  onChange,
  hasNode = true,
  error = false,
  ...props
}) {
  const defaultList = list
  const [defaultNewList, setDefaultNewList] = useState([])
  const [defaultSearchList, setDefaultSearchList] = useState()
  const [selected, setSelected] = useState({})
  const [listOptions, setListOptions] = useState(defaultList)
  const [newList, setNewList] = useState([])
  const [inputAddList, setInputAddList] = useState("")
  const [inputNewList, setInputNewList] = useState("")

  const handlerClick = (e, isAdded) => {
    if(e === selected) return isAdded ? addItem() : removeItem()
    setSelected(e)
  }

  const searcherDefaultList = new FuzzySearch(
    defaultSearchList, hasNode ? ["node.name"] : ["name"], {sort: true}
  )

  const searcherNewList = new FuzzySearch(
    defaultNewList, hasNode ? ["node.name"] : ["name"], {sort: true}
  )

  useEffect(() => {
    if(inputAddList === "") return
    const result = searcherDefaultList.search(inputAddList)
    setListOptions(result)
  }, [inputAddList])

  useEffect(() => {
    if(inputNewList === "") return
    const result = searcherNewList.search(inputNewList)
    setNewList(result)
  }, [inputNewList])

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

  const clearInputs = () => {
    setSelected({})
    setInputAddList("")
    setInputNewList("")
  }

  const addItem = () => {
    if(selected === null || Object.keys(selected).length === 0) return null
    const newArray = listOptions.filter(res => res !== selected)

    setListOptions(newArray)
    setDefaultSearchList(newArray)
    const result = [...defaultNewList, selected].sort(sortName)
    setNewList(result)
    setDefaultNewList(result)
    onChange(result)
    clearInputs()
  }

  const removeItem = () => {
    if(selected === null || Object.keys(selected).length === 0) return null
    const newArray = defaultNewList.filter(res => res !== selected)

    setNewList(newArray)
    setDefaultNewList(newArray)
    setListOptions([...listOptions, selected].sort(sortName))
    setDefaultSearchList([...listOptions, selected].sort(sortName))
    onChange(newArray)
    clearInputs()
  }

  useEffect(() => {
    if(value.length > 0 && newList.length === 0 ) {
      const subtractedArray = hasNode ?
      listOptions
        .filter(obj1 => !value
          .some(obj2 => obj2?.node?._id === obj1?.node?._id
        ))
      :
      listOptions
        .filter(obj1 => !value
          .some(obj2 => obj2?.id === obj1?.id
        ))

      setListOptions(subtractedArray)
      setDefaultSearchList(subtractedArray)
      setNewList(value)
      setDefaultNewList(value)
      onChange(value)
    }
  },[])

  const removeAll = () => {
    setListOptions(defaultList)
    setDefaultNewList([])
    setDefaultSearchList([])
    setNewList([])
    onChange([])
    clearInputs()
  }

  return (
    <Stack
      flexDirection="row"
      width="100%"
      gap="16px"
      padding="20px"
      border="2px solid #FAFAFA"
      spacing={0}
      borderRadius="8px"
      color="#252A32"
      fontFamily="Lato"
      {...props}
    >
      <Stack
        flex={1}
        height="300px"
        padding="8px"
        border="2px solid #FAFAFA"
      >
        <SimpleInput
          height="40px"
          value={inputAddList}
          onChange={(e) => setInputAddList(e.target.value)}
        />
        <Stack
          overflowY="auto"
        >
          {listOptions.map((elm) =>
            <Text
              cursor="pointer"
              color={selected === elm ? "#42B0FF" : "#252A32"}
              _hover={{color:"#42B0FF"}}
              onClick={() => handlerClick(elm, true)}
            >
              {hasNode ? elm.node.name : elm.name}
            </Text>
          )}
        </Stack>
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
        padding="8px"
        borderRadius="8px"
        border="2px solid #FAFAFA"
        borderColor={error && "#E53E3E"}
      >
        <SimpleInput
          height="40px"
          value={inputNewList}
          onChange={(e) => setInputNewList(e.target.value)}
        />
        <Stack
          overflowY="auto"
        >
          {newList.map((elm) => 
            <Text
              cursor="pointer"
              color={selected === elm ? "#42B0FF" : "#252A32"}
              _hover={{color:"#42B0FF"}}
              onClick={() => handlerClick(elm, false)}
            >
              {hasNode ? elm.node.name : elm.name}
            </Text>
          )}
        </Stack>
      </Stack>
    </Stack>
  )
}
