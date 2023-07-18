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
import { useState, useEffect } from "react"
import { useRouter } from "next/router";
import RoundedButton from "../atoms/RoundedButton";
import SelectSearch from "../atoms/SelectSearch";
import LoadingSpin from "../atoms/Loading";

import {
  getAllUsers
} from "../../pages/api/user"

import {
  postDataset,
  getDatasetEdit
} from "../../pages/api/datasets"

export default function PostTableForm({
  status
}) {
  const router = useRouter()
  const { query } = router
  
  const [isLoading, setIsLoading] = useState(true)
  const [allUser, setAllUser] = useState([])
  const [isSuccess, setIsSuccess] = useState({})
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    slug: "",
    name: "",
    description: "",
    version: 0,
    publishedBy: "",
    dataCleanedBy: "",
    status: "",
    isClosed: false,
  })

  const fetchUsers = async () => {
    const getUsers = await getAllUsers()
    setAllUser(getUsers)
  }

  const fetchData = async () => {
    const promises = []
    promises.push(fetchUsers())
    await Promise.all(promises)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchData()
  },[])

  const fetchDataset = async (id) => {
    if(!id) return 
    const datasetData = await getDatasetEdit(id)

    setFormData({
      slug: datasetData?.slug || "",
      name: datasetData?.name || "",
      description: datasetData?.description || "",
      version: datasetData?.version || 0,
      status: datasetData?.status?._id || "",
      isClosed: datasetData?.isClosed || false,
    })
  }

  useEffect(() => {
    fetchDataset(query.table)
  },[query.table])


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async () => {
    let validationErrors = {}

    if(Object.keys(validationErrors).length > 0) return setErrors(validationErrors)

    if(query.table) {
      const result = await postDataset(formData, query.table)

      if(result === undefined) return setIsSuccess({notSuccess: true})
      setIsSuccess({success: true, datasetId: result})
    } else {
      const result = await postDataset(formData)
      if(result === undefined) return setIsSuccess({notSuccess: true})
      setIsSuccess({success: true, datasetId: result})
    }
  }

  if(isLoading) return <LoadingSpin/>

  return (
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

      <Stack flexDirection="row" gap="8px" spacing={0}>
        <FormControl >
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

        <FormControl >
          <FormLabel>License</FormLabel>
          {/* <SelectSearch 
            name="license"
            value={formData.license}
            onChange={(e) => setFormData({...formData, license: e})}
            options={licenses}
          /> */}
        </FormControl>
      </Stack>

      <Stack flexDirection="row" gap="8px" spacing={0}>
        <FormControl >
          <FormLabel>Partner organization</FormLabel>
          {/* <SelectSearch 
            name="partner organization"
            value={formData.partnerOrganization}
            onChange={(e) => setFormData({...formData, partnerOrganization: e})}
            options={status}
          /> */}
        </FormControl>

        <FormControl >
          <FormLabel>Pipeline</FormLabel>
          {/* <SelectSearch 
            name="pipeline"
            value={formData.pipeline}
            onChange={(e) => setFormData({...formData, pipeline: e})}
            options={pipelines}
          /> */}
        </FormControl>
      </Stack>

      <FormControl width="50%">
        <FormLabel>Is directory</FormLabel>
        <Select
          name="isDirectory"
          value={formData.isDirectory}
          onChange={handleChange}
        >
          <option value={""}>Desconhecido</option>
          <option value={""}>Sim</option>
          <option value={""}>Não</option>
        </Select>
      </FormControl>

      <Stack flexDirection="row" gap="8px" spacing={0}>
        <FormControl >
          <FormLabel>Published by</FormLabel>
          <SelectSearch 
            name="publishedBy"
            value={formData.publishedBy}
            onChange={(e) => setFormData({...formData, publishedBy: e})}
            options={allUser}
            keyId="email"
            displayName="email"
          />
        </FormControl>

        <FormControl >
          <FormLabel>Data cleaned by</FormLabel>
          <SelectSearch
            name="dataCleanedBy"
            value={formData.dataCleanedBy}
            onChange={(e) => setFormData({...formData, dataCleanedBy: e})}
            options={allUser}
            keyId="email"
            displayName="email"
          />
        </FormControl>
      </Stack>

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
        Adicionar
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
            Dataset {query.table ? "atualizado" : "criado"} com sucesso! 
          </AlertTitle>
          <AlertDescription >
            O que gostaria de fazer agora?
          </AlertDescription>

          <Stack
            marginTop="16px"
            flexDirection="row"
            spacing={0}
            gap="10px"
          >
            <RoundedButton onClick={() => window.open(`/dataset/${isSuccess?.datasetId}`)}>
              Acessar página web
            </RoundedButton>
            {!query.table &&
              <RoundedButton onClick={() => window.open(`/dataset/control?dataset=${isSuccess?.datasetId}`, "_self")}>
                Continuar editando
              </RoundedButton>
            }
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
            Error ao {query.table ? "atualizar" : "criar"} dataset! 
          </AlertTitle>
        </Alert>
      }
    </Stack>
  )
}