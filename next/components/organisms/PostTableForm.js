import {
  Stack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Box,
  Text
} from "@chakra-ui/react";
import { useState, useEffect } from "react"
import FormTable from "../molecules/FormTable";
import LoadingSpin from "../atoms/Loading";

import {
  getAllUsers
} from "../../pages/api/user"

import {
  getAllLicenses
} from "../../pages/api/license"

import {
  getAllPipeline
} from "../../pages/api/pipeline"

export default function PostTableForm({
  status,
  organizations
}) {
  const [accordionItens, setAccordionItens] = useState([0])
  const [isLoading, setIsLoading] = useState(true)
  const [allUser, setAllUser] = useState([])
  const [allLicenses, setAllLicenses] = useState([])
  const [allPipeline, setAllPipeline] = useState([])

  const fetchUsers = async () => {
    const getUsers = await getAllUsers()
    setAllUser(getUsers)
  }

  const fetchLicenses = async () => {
    const getLicenses = await getAllLicenses()
    setAllLicenses(getLicenses)
  }

  const fetchPipeline = async () => {
    const getPipeline = await getAllPipeline()
    setAllPipeline(getPipeline)
  }

  const fetchData = async () => {
    const promises = []
    promises.push(fetchUsers())
    promises.push(fetchLicenses())
    promises.push(fetchPipeline())
    await Promise.all(promises)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchData()
  },[])

  const handleAccordionOpen = (index) => {
    const itensOpens = accordionItens.includes(index)
    
    if (itensOpens) {
      setAccordionItens((prevState) => prevState.filter((item) => item !== index))
    } else {
      setAccordionItens((prevState) => [...prevState, index])
    }
  }

  if(isLoading) return <LoadingSpin/>

  return (
    <Stack>
      <Accordion
        defaultIndex={accordionItens}
        allowMultiple
        width="100%"
        transform={"translateX(20px)"}
      >
        <AccordionItem border={0}>
          <AccordionButton
            width="632px"
            fontSize="16px"
            color="#252A32"
            _hover={{
              backgroundColor:"transparent",
              color:"#42B0FF",
              opacity: "0.8"
            }}
            onClick={() => handleAccordionOpen(0)}
          >
            <Box
              flex={1}
              textAlign="left"
              fontFamily="ubuntu"
              fontWeight="400"
              color={accordionItens.find((elm) => elm === 0) === 0 && "#42B0FF"}
            >
              Criar Table
            </Box>
            <Text
              fontSize="20px"
              fontWeight="500"
              transition="all 0.2s"
              transform={accordionItens.find((elm) => elm === 0) === 0 && "rotate(45deg)"}
            >+</Text>
          </AccordionButton>
          <AccordionPanel>
            <FormTable
              status={status}
              organizations={organizations}
              users={allUser}
              licenses={allLicenses}
              pipeline={allPipeline}
            />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Stack>
  )
}