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
import { useRouter } from "next/router";
import FormTable from "../molecules/FormTable";
import LoadingSpin from "../atoms/Loading";

import {
  getAllTableInDataset
} from "../../pages/api/tables"

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
  const router = useRouter()
  const { query } = router

  const [accordionItens, setAccordionItens] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [allUser, setAllUser] = useState([])
  const [allLicenses, setAllLicenses] = useState([])
  const [allPipeline, setAllPipeline] = useState([])
  const [tables, setTables] = useState([])

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

  const fetchAllTable = async (dataset) => {
    const getAllTable = await getAllTableInDataset(dataset)
    setTables(getAllTable)
  }

  const fetchData = async () => {
    const promises = []
    promises.push(fetchUsers())
    promises.push(fetchLicenses())
    promises.push(fetchPipeline())
    if(query.dataset) promises.push(fetchAllTable(query.dataset))
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
      setAccordionItens([index])
    }
  }

  if(isLoading) return <LoadingSpin/>

  return (
    <Stack>
      <Accordion
        defaultIndex={accordionItens}
        width="100%"
        transform={"translateX(20px)"}
        allowToggle
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
              position="relative"
              left="-4px"
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

        {tables && tables.map((table, i) => 
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
              onClick={() => {
                handleAccordionOpen(i+1)
                if(query.table === table.node._id) return (
                  router.push({
                    pathname: router.pathname,
                    query: { dataset: query.dataset}
                  })
                )
                router.push({
                  pathname: router.pathname,
                  query: {
                    ...query,
                    table: table.node._id
                  }
                })
              }}
            >
              <Box
                flex={1}
                textAlign="left"
                fontFamily="ubuntu"
                fontWeight="400"
                color={accordionItens.find((elm) => elm === i+1) === i+1 && "#42B0FF"}
              >
                {table.node.name}
              </Box>
              <AccordionIcon/>
            </AccordionButton>
            <AccordionPanel>
              <FormTable
                id={table.node._id}
                status={status}
                organizations={organizations}
                users={allUser}
                licenses={allLicenses}
                pipeline={allPipeline}
              />
            </AccordionPanel>
          </AccordionItem>
          )
        }
      </Accordion>
    </Stack>
  )
}