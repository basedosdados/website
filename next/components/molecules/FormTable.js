import {
  Stack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Select,
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
import Checkbox from "../atoms/Checkbox";
import RoundedButton from "../atoms/RoundedButton";
import SelectSearch from "../atoms/SelectSearch";
import LoadingSpin from "../atoms/Loading";

import {
  postTable,
  getTableEdit,
  deleteTable
} from "../../pages/api/tables"

export default function FormTable({
  id,
  status,
  organizations,
  users,
  licenses,
  pipeline
}) {
  const router = useRouter()
  const { query } = router

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isSuccess, setIsSuccess] = useState({})
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  const valueFormData = (data) => {
    return {
      slug: data ? data?.slug || "" : "",
      name: data ? data?.name || "" : "",
      description: data ? data?.description || "" : "",
      status: data ? data?.status || "" : "",
      license: data ? data?.license?._id || "" : "",
      partnerOrganization: data ? data?.partnerOrganization?._id || "" : "",
      pipeline: data ? data?.pipeline?._id || "" : "",
      isDirectory: data ? data?.isDirectory || false : false,
      publishedBy: data ? data?.publishedBy?.id || "" : "",
      dataCleanedBy: data ? data?.dataCleanedBy?.id || "" : "",
      dataCleaningDescription: data ? data?.dataCleaningDescription || "" : "",
      dataCleaningCodeUrl: data ? data?.dataCleaningCodeUrl || "" : "",
      rawDataUrl: data ? data?.rawDataUrl || "" : "",
      auxiliaryFilesUrl: data ? data?.auxiliaryFilesUrl || "" : "",
      architectureUrl: data ? data?.architectureUrl || "" : "",
      sourceBucketName: data ? data?.sourceBucketName || "" : "",
      uncompressedFileSize: data ? data?.uncompressedFileSize || 0 : 0,
      compressedFileSize: data ? data?.compressedFileSize || 0 : 0,
      numberRows: data ? data?.numberRows || 0 : 0,
      numberColumns: data ? data?.numberColumns || 0 : 0,
      isClosed: data ? data?.isClosed || false : false,
    }
  }
  const [formData, setFormData] = useState(valueFormData())

  const fetchTable = async (id) => {
    if(!id) return 
    const tableData = await getTableEdit(id)

    setFormData(valueFormData(tableData))
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

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
    if(formData.dataCleaningCodeUrl !== "") {
      if(!formData.dataCleaningCodeUrl.startsWith("https")) validationErrors.dataCleaningCodeUrl = "Insira uma url válida"
    }
    if(formData.rawDataUrl !== "") {
      if(!formData.rawDataUrl.startsWith("https")) validationErrors.rawDataUrl = "Insira uma url válida"
    }
    if(formData.auxiliaryFilesUrl !== "") {
      if(!formData.auxiliaryFilesUrl.startsWith("https")) validationErrors.auxiliaryFilesUrl = "Insira uma url válida"
    }
    if(formData.architectureUrl !== "") {
      if(!formData.architectureUrl.startsWith("https")) validationErrors.architectureUrl = "Insira uma url válida"
    }

    if(Object.keys(validationErrors).length > 0) return setErrors(validationErrors)

    const newFormData = formData

    if(formData.publishedBy) newFormData.publishedBy = newFormData.publishedBy.replace(new RegExp('\\bAccountNode:\\b', 'gi'), '')
    if(formData.dataCleanedBy) newFormData.dataCleanedBy = newFormData.dataCleanedBy.replace(new RegExp('\\bAccountNode:\\b', 'gi'), '')

    if(query.table) {
      const result = await postTable(newFormData, query.dataset, query.table)

      if(result === undefined) return setIsSuccess({notSuccess: true})
      setIsSuccess({success: true, tableId: result})
    } else {
      const result = await postTable(newFormData, query.dataset)

      if(result === undefined) return setIsSuccess({notSuccess: true})
      setIsSuccess({success: true, tableId: result})
    }
  }

  const handleDelete = async () => {
    const result = await deleteTable(query.table)

    if(result === false) {
      setIsSuccess({notDelete: true})
      onClose()
    }
    if(result === true) window.location.reload()
  }

  useEffect(() => {
    if(id === "create") {
      setFormData(valueFormData())
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    }
    
    if(query.table) fetchTable(query.table)
  }, [id, query])

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
        <FormControl isRequired>
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

        <FormControl>
          <FormLabel>License</FormLabel>
          <SelectSearch 
            name="license"
            value={formData.license}
            onChange={(e) => setFormData({...formData, license: e})}
            options={licenses}
            displayName="slug"
          />
        </FormControl>
      </Stack>

      <Stack flexDirection="row" gap="8px" spacing={0}>
        <FormControl >
          <FormLabel>Partner organization</FormLabel>
          <SelectSearch 
            name="partner organization"
            value={formData.partnerOrganization}
            onChange={(e) => setFormData({...formData, partnerOrganization: e})}
            options={organizations}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Pipeline</FormLabel>
          <SelectSearch 
            name="pipeline"
            value={formData.pipeline}
            onChange={(e) => setFormData({...formData, pipeline: e})}
            options={pipeline}
            displayName="githubUrl"
          />
        </FormControl>
      </Stack>

      <FormControl width="50%">
        <FormLabel>Is directory</FormLabel>
        <Select
          name="isDirectory"
          value={formData.isDirectory}
          onChange={handleChange}
        >
          <option value={null}>Desconhecido</option>
          <option value={true}>Sim</option>
          <option value={false}>Não</option>
        </Select>
      </FormControl>

      <Stack flexDirection="row" gap="8px" spacing={0}>
        <FormControl>
          <FormLabel>Published by</FormLabel>
          <SelectSearch 
            name="publishedBy"
            value={formData.publishedBy}
            onChange={(e) => setFormData({...formData, publishedBy: e})}
            options={users}
            keyId="id"
            displayName="email"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Data cleaned by</FormLabel>
          <SelectSearch
            name="dataCleanedBy"
            value={formData.dataCleanedBy}
            onChange={(e) => setFormData({...formData, dataCleanedBy: e})}
            options={users}
            keyId="id"
            displayName="email"
          />
        </FormControl>
      </Stack>

      <FormControl>
        <FormLabel>Data cleaning description</FormLabel>
        <Textarea
          name="dataCleaningDescription"
          value={formData.dataCleaningDescription}
          onChange={handleChange}
        />
      </FormControl>

      <Stack flexDirection="row" gap="8px" spacing={0}>
        <FormControl isInvalid={!!errors.dataCleaningCodeUrl}>
          <FormLabel>Data cleaning code url</FormLabel>
          <Input name="dataCleaningCodeUrl" value={formData.dataCleaningCodeUrl} onChange={handleChange} />
          <FormErrorMessage>{errors.dataCleaningCodeUrl}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.rawDataUrl}>
          <FormLabel>Raw data url</FormLabel>
          <Input name="rawDataUrl" value={formData.rawDataUrl} onChange={handleChange} />
          <FormErrorMessage>{errors.rawDataUrl}</FormErrorMessage>
        </FormControl>
      </Stack>

      <Stack flexDirection="row" gap="8px" spacing={0}>
        <FormControl isInvalid={!!errors.auxiliaryFilesUrl}>
          <FormLabel>Auxiliary files url</FormLabel>
          <Input name="auxiliaryFilesUrl" value={formData.auxiliaryFilesUrl} onChange={handleChange} />
          <FormErrorMessage>{errors.auxiliaryFilesUrl}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.architectureUrl}>
          <FormLabel>Architecture url</FormLabel>
          <Input name="architectureUrl" value={formData.architectureUrl} onChange={handleChange} />
          <FormErrorMessage>{errors.architectureUrl}</FormErrorMessage>
        </FormControl>
      </Stack>


      <FormControl>
        <FormLabel>Source bucket name</FormLabel>
        <Input name="sourceBucketName" value={formData.sourceBucketName} onChange={handleChange} />
      </FormControl>

      <Stack flexDirection="row" gap="8px" spacing={0}>
        <FormControl>
          <FormLabel>Uncompressed file size</FormLabel>
          <Input
            type="number"
            name="uncompressedFileSize"
            value={formData.uncompressedFileSize}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Compressed file size</FormLabel>
          <Input
            type="number"
            name="compressedFileSize"
            value={formData.compressedFileSize}
            onChange={handleChange}
          />
        </FormControl>
      </Stack>

      <Stack flexDirection="row" gap="8px" spacing={0}>
        <FormControl>
          <FormLabel>Number rows</FormLabel>
          <Input
            type="number"
            name="numberRows"
            value={formData.numberRows}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Number columns</FormLabel>
          <Input
            type="numberRows"
            name="version"
            value={formData.numberColumns}
            onChange={handleChange}
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
          {query.table ? "Atualizar" : "Adicionar"}
        </RoundedButton>

        {query.table &&
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
        <ModalOverlay/>
        <ModalContent margin="24px">
          <ModalHeader>Deletar table</ModalHeader>
          <ModalBody>
            Você tem certeza em deletar esse table? Uma vez deletada, todas as informações dele e de Columns serão excluídas em consequência.
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
            Table {query.table ? "atualizado" : "criado"} com sucesso! 
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
            <RoundedButton onClick={() => window.open(`/dataset/${query.dataset}?table=${isSuccess?.tableId}`)}>
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
            Error ao {query.table ? "atualizar" : "criar"} table! 
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
            Error ao deletar tabble! 
          </AlertTitle>
        </Alert>
      }
    </Stack>
  )
}
