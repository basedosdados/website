import {
  Stack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Box,
} from "@chakra-ui/react";
import { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import { MainPageTemplate } from "../../../components/templates/main";
import authUser from "../../../middlewares/authUser";
import LoadingSpin from "../../../components/atoms/Loading";
import PostDatasetForm from "../../../components/organisms/PostDatasetForm";
import PostTableForm from "../../../components/organisms/PostTableForm";

import {
  getAllOrganizations
} from "../../api/organizations";

import {
  getAllThemes
} from "../../api/themes";

import {
  getAllTags
} from "../../api/tags";

import {
  getAllStatus
} from "../../api/status";

export function getServerSideProps(context) {
  return authUser(context, "/user/login")
}

export default function Control() {
  const router = useRouter()
  const { query } = router

  const [isLoading, setIsLoading] = useState(true)
  const [organizations, setOrganizations] = useState([])
  const [themes, setThemes] = useState([])
  const [tags, setTags] = useState([])
  const [status, setStatus] = useState([])
  const [accordionItens, setAccordionItens] = useState([0])

  const fetchOrganizations = async () => {
    const allOrganizations = await getAllOrganizations()
    setOrganizations(allOrganizations)
  }

  const fetchThemes = async () => {
    const allThemes = await getAllThemes()
    setThemes(allThemes)
  }

  const fetchTags = async () => {
    const allTags = await getAllTags()
    setTags(allTags)
  }

  const fetchStatus = async () => {
    const allStatus = await getAllStatus()
    setStatus(allStatus)
  }

  const fetchData = async () => {
    const promises = []
    promises.push(fetchOrganizations())
    promises.push(fetchThemes())
    promises.push(fetchTags())
    promises.push(fetchStatus())
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

  useEffect(() => {
    if(query.table) setAccordionItens([1])
  }, [query])

  if(isLoading) return <MainPageTemplate paddingX="24px" height="600px"><LoadingSpin /></MainPageTemplate>

  return (
    <MainPageTemplate paddingX="24px">
      <Stack
        width="100%"
        maxWidth="1264px"
        direction={{ base: "column", lg: "row" }}
        justifyContent="center"
        margin="auto"
      >
        {!query.dataset &&
          <PostDatasetForm
            organizations={organizations}
            themes={themes}
            tags={tags}
            status={status}
          />
        }
        {query.dataset &&
          <Accordion
            defaultIndex={accordionItens}
            allowMultiple
            width="100%"
            display="flex"
            flexDirection="column"
            alignItems="center"
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
                  fontWeight="500"
                  color={accordionItens.find((elm) => elm === 0) === 0 && "#42B0FF"}
                >
                  Dataset
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                <PostDatasetForm
                  organizations={organizations}
                  themes={themes}
                  tags={tags}
                  status={status}
                />
              </AccordionPanel>
            </AccordionItem>
            
            <AccordionItem
              border={0}
            >
              <AccordionButton
                width="632px"
                fontSize="16px"
                color="#252A32"
                _hover={{
                  backgroundColor:"transparent",
                  color:"#42B0FF",
                  opacity: "0.8"
                }}
                onClick={() => handleAccordionOpen(1)}
                margin="0 auto"
              >
                <Box
                  flex={1}
                  textAlign="left"
                  fontFamily="ubuntu"
                  fontWeight="500"
                  color={accordionItens.find((elm) => elm === 1) === 1 && "#42B0FF"}
                >
                  Tables
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                <PostTableForm
                  organizations={organizations}
                  status={status}
                />
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        }
      </Stack>
    </MainPageTemplate>
  )
}
