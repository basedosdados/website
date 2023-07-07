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
import SelectSearch from "../../../components/atoms/SelectSearch";
import LoadingSpin from "../../../components/atoms/Loading";

import {
  postDataset
} from "../../api/datasets"

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
  const [selectedThemes, setSelectedThemes] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    slug: "",
    name: "",
    description: "",
    organization: "",
    themes: [],
    tags: [],
    version: 0,
    status: "",
    isClosed: false,
  });

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

  useEffect(() => {
    if(selectedThemes.length === 0) return setFormData({...formData, themes: []})
    const result = selectedThemes.map((elm) => {return(`"${elm.node._id}"`)})
    setFormData({...formData, themes: result})
  },[selectedThemes])

  useEffect(() => {
    if(selectedTags.length === 0) return setFormData({...formData, tags: []})
    const result = selectedTags.map((elm) => {return(`"${elm.node._id}"`)})
    setFormData({...formData, tags: result})
  },[selectedTags])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async () => {
    const result = await postDataset(formData)

    // let arrayErrors = {}
    if(result?.errors?.length > 0) {
      console.log(result.errors)
      // result.errors.map((elm) => {
      //   if(elm.field === "username") arrayErrors = ({...arrayErrors, userName: elm.messages})
      //   if(elm.field === "email") arrayErrors = ({...arrayErrors, email: elm.messages})
      // })
    }
    // setErrors(arrayErrors)
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
        <Stack
          display="flex"
          flexDirection="column"
          width="600px"
          gap="20px"
          color="#252A32"
          fontFamily="Lato"
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
            <SelectSearch 
              name="organization"
              value={formData.organization}
              onChange={(e) => setFormData({...formData, organization: e})}
              options={organizations}
            />
          </FormControl>

          <FormControl>
            <div style={{display: "flex", flexDirection: "row", gap: "4px"}}>
              <FormLabel marginRight={0}>Themes</FormLabel>
              <span style={{color: "#E53E3E"}}>*</span>
            </div>
            <SelectList
              list={themes}
              hasNode={true}
              onChange={(e) => setSelectedThemes(e)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Tags</FormLabel>
            <SelectList
              list={tags}
              hasNode={true}
              onChange={(e) => setSelectedTags(e)}
            />
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
              <option value={""}>...</option>
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
            onClick={() => handleSubmit()}
          >Enviar
          </RoundedButton>
        </Stack>
      </Stack>
    </MainPageTemplate>
  )
}
