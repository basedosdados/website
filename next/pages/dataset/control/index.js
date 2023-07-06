import {
  Stack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Checkbox,
} from "@chakra-ui/react";
import { useState, useEffect } from 'react';
import { MainPageTemplate } from "../../../components/templates/main";
import authUser from "../../../middlewares/authUser";
import SelectList from "../../../components/molecules/SelectList";
import RoundedButton from "../../../components/atoms/RoundedButton";
import LoadingSpin from "../../../components/atoms/Loading";

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
  const [isLoading, setIsLoading] = useState(true)
  const [organizations, setOrganizations] = useState([])
  const [themes, setThemes] = useState([])
  const [tags, setTags] = useState([])
  const [status, setStatus] = useState([])
  const [formData, setFormData] = useState({
    slug: "",
    name: "",
    description: "",
    organization: "",
    themes: "",
    tags: "",
    version: "",
    status: "",
    isClosed: false,
  });

  useEffect(() => {
    fetchData()
  },[])

  const fetchData = async () => {
    const promises = []
    promises.push(fetchOrganizations())
    promises.push(fetchThemes())
    promises.push(fetchTags())
    promises.push(fetchStatus())
    await Promise.all(promises)
    setIsLoading(false)
  }

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = () => {

  }

    
  if(isLoading) return <MainPageTemplate paddingX="24px" height="600px"><LoadingSpin /></MainPageTemplate>
  return (
    <MainPageTemplate paddingX="24px">
      <Stack
        width="100%"
        maxWidth="1264px"
        direction={{ base: "column", lg: "row" }}
        margin="auto"
      >
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            width: "600px",
            gap: "20px",
            color: "#252A32",
            fontFamily: "Lato"
          }}
        >
          <Stack flexDirection="row" gap="8px" spacing={0}>
            <FormControl isRequired>
              <FormLabel>Slug</FormLabel>
              <Input name="slug" value={formData.slug} onChange={handleChange} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input name="name" value={formData.name} onChange={handleChange} />
            </FormControl>
          </Stack>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Organization</FormLabel>
            <Select
              name="organizations"
              value={formData.organization}
              onChange={handleChange}
            >
              {organizations.map((elm) => {
                  return (
                    <option value={elm?.node?._id}>{elm?.node?.name}</option>
                  )
                })
              }
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Themes</FormLabel>
            <SelectList list={themes} hasNode={true}/>
          </FormControl>

          <FormControl>
            <FormLabel>Tags</FormLabel>
            <SelectList list={tags} hasNode={true}/>
          </FormControl>

          <FormControl>
            <FormLabel>Version</FormLabel>
            <Input
              type="number"
              name="version"
              value={formData.version}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Status</FormLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              {status.map((elm) => {
                  return (
                    <option value={elm?.node?._id}>{elm?.node?.name}</option>
                  )
                })
              }
            </Select>
          </FormControl>

          <FormControl
            display="flex"
            flexDirection="row"
            gap="8px"
          >
            <FormLabel margin="0 !important">Is Closed?</FormLabel>
            <Checkbox
              name="isClosed"
              checked={formData.isClosed}
              onChange={handleChange}
            />
          </FormControl>

          <RoundedButton
            margin="0 auto"
            width="200px"
            type="submit"
          >Enviar
          </RoundedButton>
        </form>
      </Stack>
    </MainPageTemplate>
  )
}
