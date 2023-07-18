import {
  Stack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
} from "@chakra-ui/react";
import { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import { MainPageTemplate } from "../../../components/templates/main";
import authUser from "../../../middlewares/authUser";
import LoadingSpin from "../../../components/atoms/Loading";
import PostDatasetForm from "../../../components/organisms/PostDatasetForm";

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
          <Accordion defaultIndex={[0]} allowMultiple>
            <AccordionItem>
              <AccordionButton width="600px" fontSize="16px" color="#252A32">
                Dataset
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
            
            <AccordionItem>
              <AccordionButton width="600px" fontSize="16px" color="#252A32">
                Table
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

            <AccordionItem>
              <AccordionButton width="600px" fontSize="16px" color="#252A32">
                Raw Data Source
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

            <AccordionItem>
              <AccordionButton width="600px" fontSize="16px" color="#252A32">
                Information Request
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
          </Accordion>
        }
      </Stack>
    </MainPageTemplate>
  )
}
