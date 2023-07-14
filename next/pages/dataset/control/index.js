import {
  Stack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Select,
  Checkbox,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from "@chakra-ui/react";
import { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import { MainPageTemplate } from "../../../components/templates/main";
import authUser from "../../../middlewares/authUser";
import SelectList from "../../../components/molecules/SelectList";
import RoundedButton from "../../../components/atoms/RoundedButton";
import SelectSearch from "../../../components/atoms/SelectSearch";
import LoadingSpin from "../../../components/atoms/Loading";

import {
  postDataset,
  getDatasetEdit
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
  const router = useRouter()
  const { query } = router

  const [isLoading, setIsLoading] = useState(true)
  const [organizations, setOrganizations] = useState([])
  const [themes, setThemes] = useState([])
  const [tags, setTags] = useState([])
  const [status, setStatus] = useState([])
  const [selectedThemes, setSelectedThemes] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [isSuccess, setIsSuccess] = useState({})
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

  const fetchDataset = async (id) => {
    if(!id) return 
    const datasetData = await getDatasetEdit(id)

    setFormData({
      slug: datasetData?.slug || "",
      name: datasetData?.name || "",
      description: datasetData?.description || "",
      organization: datasetData?.organization?._id || "",
      themes: datasetData?.themes?.edges|| [],
      tags: datasetData?.tags?.edges|| [],
      version: datasetData?.version || 0,
      status: datasetData?.status?._id || "",
      isClosed: datasetData?.isClosed || false,
    })
  }

  useEffect(() => {
    fetchDataset(query.dataset)
  },[query])

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
    let newFormData = formData

    if(selectedThemes.length === 0) {
      newFormData = {...newFormData, themes: []}
    } else {
      const result = selectedThemes.map((elm) => {return(`"${elm.node._id}"`)})
      newFormData = {...newFormData, themes: result}
    }

    if(selectedTags.length === 0) {
      newFormData = {...newFormData, tags: []}
    } else {
      const result = selectedTags.map((elm) => {return(`"${elm.node._id}"`)})
      newFormData = {...newFormData, tags: result}
    }

    setFormData(newFormData)
  },[selectedThemes, selectedTags])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async () => {
    let validationErrors = {}

    if(!formData.slug) validationErrors.slug = "O slug é obrigatório"
    if(!formData.name) validationErrors.name = "O name é obrigatório"
    if(!formData.organization) validationErrors.organization = "A organization é obrigatória"
    if(formData.themes.length == 0) validationErrors.themes = "Os themes são obrigatórios"
    if(!formData.status) validationErrors.status = "Recomendamos que insira um status "

    if(Object.keys(validationErrors).length > 0) return setErrors(validationErrors)

    if(query.dataset) {
      const result = await postDataset(formData, query.dataset)

      if(result === undefined) return setIsSuccess({notSuccess: true})
      setIsSuccess({success: true, datasetId: result})
    } else {
      const result = await postDataset(formData)
      if(result === undefined) return setIsSuccess({notSuccess: true})
      setIsSuccess({success: true, datasetId: result})
    }
  }

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
        <Stack
          display="flex"
          flexDirection="column"
          width="600px"
          gap="20px"
          color="#252A32"
          fontFamily="Lato"
        >
          <Stack flexDirection="row" gap="8px" spacing={0}>
            <FormControl isRequired isInvalid={!!errors.slug}>
              <FormLabel>Slug</FormLabel>
              <Input name="slug" value={formData.slug} onChange={handleChange} />
              <FormErrorMessage>{errors.slug}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.name}>
              <FormLabel>Name</FormLabel>
              <Input name="name" value={formData.name} onChange={handleChange} />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
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

          <FormControl isRequired isInvalid={!!errors.organization}>
            <FormLabel>Organization</FormLabel>
            <SelectSearch 
              name="organization"
              value={formData.organization}
              onChange={(e) => setFormData({...formData, organization: e})}
              options={organizations}
            />
            <FormErrorMessage>{errors.organization}</FormErrorMessage>
          </FormControl>

          <FormControl>
            <div style={{display: "flex", flexDirection: "row", gap: "4px"}}>
              <FormLabel marginRight={0}>Themes</FormLabel>
              <span style={{color: "#E53E3E"}}>*</span>
            </div>
            <SelectList
              value={formData.themes}
              list={themes}
              onChange={(e) => setSelectedThemes(e)}
              error={!!errors.themes}
            />
            <Text
              color="#E53E3E"
              fontSize="14px"
              marginTop="8px"
            >{errors.themes}</Text>
          </FormControl>

          <FormControl>
            <FormLabel>Tags</FormLabel>
            <SelectList
              value={formData.tags}
              list={tags}
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

          <FormControl isRequired isInvalid={!!errors.status}>
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
            <FormErrorMessage>{errors.status}</FormErrorMessage>
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
          >
            Criar
          </RoundedButton>

          {isSuccess?.success &&
            <Alert
              status="success"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
            >
              <AlertIcon
                width="40px"
                height="40px"
                marginRight={0}
              />
              <AlertTitle
                margin="16px 0 8px"
                fontSize="18px"
              >
                Dataset {query.dataset ? "atualizado" : "criado"} com sucesso! 
              </AlertTitle>
              <AlertDescription >
                O que gostaria de fazer agora?
              </AlertDescription>

              <Stack
                marginTop="16px"
                spacing={0}
                gap="10px"
              >
                <RoundedButton onClick={() => window.open(`/dataset/${isSuccess?.datasetId}`)}>
                  Acessar página web
                </RoundedButton>
              </Stack>
            </Alert>
          }

          {isSuccess.notSuccess &&
            <Alert
              status="error"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
            >
              <AlertIcon
                width="40px"
                height="40px"
                marginRight={0}
              />
              <AlertTitle
                margin="16px 0 8px"
                fontSize="18px"
              >
                Error ao {query.dataset ? "atualizar" : "criar"} dataset! 
              </AlertTitle>
            </Alert>
          }
        </Stack>
      </Stack>
    </MainPageTemplate>
  )
}
