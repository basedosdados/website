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
  AlertDescription,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useDisclosure
} from "@chakra-ui/react";
import { useState, useEffect } from "react"
import { useRouter } from "next/router";
import SelectList from "../molecules/SelectList";
import RoundedButton from "../atoms/RoundedButton";
import SelectSearch from "../atoms/SelectSearch";
import LoadingSpin from "../atoms/Loading";

import {
  postDataset,
  getDatasetEdit,
  deleteDataset
} from "../../pages/api/datasets"

export default function PostDatasetForm({
  organizations,
  themes,
  tags,
  status
}) {
  const router = useRouter()
  const { query } = router

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedThemes, setSelectedThemes] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [isSuccess, setIsSuccess] = useState({})
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  const valueFormData = (data) => {
    return {
      slug: data ? data?.slug || "" :"",
      name: data ? data?.name || "": "",
      description: data ? data?.description || "" : "",
      organization: data ? data?.organization?._id || "" :"",
      themes: data ? data?.themes?.edges|| [] :[],
      tags: data ? data?.tags?.edges|| [] :[],
      version: data ? data?.version || 0 : 0,
      status: data ? data?.status?._id || "" : "",
      isClosed: data ? data?.isClosed || false : false,
    }
  }
  const [formData, setFormData] = useState(valueFormData())

  useEffect(() => {
    if(!query.dataset) setIsLoading(false)
  }, [])

  const fetchDataset = async (id) => {
    if(!id) return 
    const datasetData = await getDatasetEdit(id)

    setFormData(valueFormData(datasetData))
    setIsLoading(false)
  }

  useEffect(() => {
    fetchDataset(query.dataset)
  },[query.dataset])

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

  const handleDelete = async () => {
    const result = await deleteDataset(query.dataset)

    if(result === false) {
      setIsSuccess({notDelete: true})
      onClose()
    }
    if(result === true) window.open("/dataset", "_self")
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

      <Stack
        flexDirection="row"
        gap="24px"
        margin="0 auto"
        spacing={0}
      >
        <RoundedButton
          width="200px"
          type="submit"
          onClick={() => handleSubmit()}
        >
          {query.dataset ? "Atualizar" : "Criar"}
        </RoundedButton>

        {query.dataset &&
          <RoundedButton
            margin="0 auto"
            width="200px"
            backgroundColor="#E44748"
            onClick={onOpen}
          >
            Deletar
          </RoundedButton>
        }
      </Stack>

      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent margin="24px">
          <ModalHeader>Deletar dataset</ModalHeader>
          <ModalBody>
            Você tem certeza em deletar esse dataset? Uma vez deletado, todas as informações dele e de Table e Columns serão excluídas em consequência.
          </ModalBody>
          <ModalFooter gap="8px">
            <RoundedButton onClick={onClose}> Cancelar </RoundedButton>
            <RoundedButton backgroundColor="#E44748" onClick={() => handleDelete()}>Deletar</RoundedButton>
          </ModalFooter>
        </ModalContent>
      </Modal>

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
            flexDirection="row"
            spacing={0}
            gap="10px"
          >
            <RoundedButton onClick={() => window.open(`/dataset/${isSuccess?.datasetId}`)}>
              Acessar página web
            </RoundedButton>
            {!query.dataset &&
              <RoundedButton onClick={() => window.open(`/dataset/edit?dataset=${isSuccess?.datasetId}`, "_self")}>
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
            Error ao {query.dataset ? "atualizar" : "criar"} dataset! 
          </AlertTitle>
        </Alert>
      }

      {isSuccess.notDelete &&
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
            Error ao deletar dataset! 
          </AlertTitle>
        </Alert>
      }
    </Stack>
  )
}