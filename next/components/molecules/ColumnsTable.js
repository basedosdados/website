import {
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tooltip,
  Stack,
  Box,
  Text,
  Skeleton,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import FuzzySearch from 'fuzzy-search';
import Latex from 'react-latex-next';
import { ControlledInputSimple } from '../atoms/ControlledInput';
import Checkbox from '../atoms/Checkbox';

import {
  getColumnsBdmTable
} from "../../pages/api/tables/index";

import InternalError from '../../public/img/internalError'
import InfoIcon from '../../public/img/icons/infoIcon';
import DownloadIcon from '../../public/img/icons/downloadIcon';
import SearchIcon from '../../public/img/icons/searchIcon';
import RedirectIcon from '../../public/img/icons/redirectIcon';
import 'katex/dist/katex.min.css';

function SearchColumn({ isLoaded, resource, columns }) {
  const [inputFocus, setInputFocus] = useState(false)
  const [search, setSearch] = useState("")
  const [value, setValue] = useState("")
  const [_timeout, _setTimeout] = useState(null)

  useEffect(() => {
    clearTimeout(_timeout)
    isLoaded(true)
    if(value.trim() === "") {
      isLoaded(false)
      return columns(resource)
    }

    _setTimeout(setTimeout(() => {
      const result = searcherColumn.search(search.trim())
      if(result.length > 0) {
        columns(result)
      } else {
        columns(resource)
      }
      isLoaded(false)
    }, 500))
  }, [value])

  useEffect(() => {
    setValue(search)
  }, [search])

  const searcherColumn = new FuzzySearch (
    resource, ["node.name", "node.description"], {sort: true}
  )

  return (
    <ControlledInputSimple
      value={search}
      onChange={setSearch}
      inputFocus={inputFocus}
      changeInputFocus={setInputFocus}
      placeholder="Pesquisar colunas"
      fill="#464A51"
      height="48px"
      maxWidth="100%"
      width="100%"
      icon={
        <SearchIcon
          alt="pesquisar"
          width="16.8px"
          height="16.8px"
        />
      }
    />
  )
}

export default function ColumnsTable({
  tableId,
  checkedColumns,
  onChangeCheckedColumns,
  hasLoading,
  setHasLoading,
  numberColumns,
  template,
  columnsPro
}) {
  const [resource, setResource] = useState({})
  const [columns, setColumns] = useState({})
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSearchLoading, setIsSearchLoading] = useState(true)

  const isChecked = (columnSlug) => checkedColumns.includes(columnSlug)

  const handleCheckboxChange = (columnSlug) => {
    if (isChecked(columnSlug)) {
      onChangeCheckedColumns(checkedColumns.filter(slug => slug !== columnSlug))
    } else {
      onChangeCheckedColumns([...checkedColumns, columnSlug])
    }
  }

  const handleMasterCheckboxChange = () => {
    if(checkedColumns.length > 0) return onChangeCheckedColumns([])
    const allColumnSlugs = resource.map(column => column.node.name)

    if (checkedColumns.length === allColumnSlugs.length) {
      onChangeCheckedColumns([])
    } else {
      onChangeCheckedColumns(allColumnSlugs)
    }
  }

  useEffect(() => {
    if(tableId === undefined) return

    const filterClosedTables = (data) => {
      return data.filter(elm => {
        const table = elm?.node?.directoryPrimaryKey?.table
        return table && table.isClosed === true
      })
    }

    const featchColumns = async () => {
      setHasLoading(true)

      try {
        const result = await getColumnsBdmTable(tableId)

        if(result) {
          setResource(result.sort(sortElements))
          numberColumns(result.length)
          columnsPro(filterClosedTables(result))
          setColumns(result.sort(sortElements))
          setHasLoading(false)
          setIsSearchLoading(false)
        }

      } catch (error) {
        console.error(error)
        setIsError(true)
      }
    }

    featchColumns()
  },[tableId])

  useEffect(() => {
    setIsLoading(hasLoading)
  }, [hasLoading])

  const headers = [
    {
      pt: "Nome",
      tooltip:"Nome da coluna."
    },
    {
      pt: 
        template === "download" ?
        "Tabela de tradução"
        :
        "Precisa de tradução"
      ,
      tooltip:
        template === "download" ?
        "Para traduzir os códigos institucionais da tabela você precisa utilizar as tabelas de dicionário e diretórios, dependendo de qual coluna você quiser usar."
        :
        "A coluna possui códigos institucionais a serem traduzidos."
    },
    {
      pt: "Descrição",
      tooltip:"Descrição dos dados da coluna."
    },
    {
      pt: "Tipo No BigQuery",
      tooltip:"Tipo de dado no BigQuery — categorias: INTEGER (Inteiro), STRING (Texto), DATE (Data), FLOAT64 (Decimal), GEOGRAPHY (Geográfico)."
    },
    {
      pt: "Cobertura Temporal",
      tooltip:"Data inicial e final de cobertura dos dados. Pode variar entre colunas, de acordo com a disponibilidade nos dados originais."
    },
    {
      pt: "Unidade De Medida",
      tooltip:"Unidade de medida da coluna — ex: km, m2, kg."
    },
    {
      pt: "Contém Dados Sensíveis (LGPD)",
      tooltip:"Indica se a coluna possui dados sensíveis — ex: CPF identificado, dados de conta bancária, etc."
    },
    {
      pt: "Observações",
      tooltip:"Descreve processos de tratamentos realizados na coluna que precisam ser evidenciados."
    }
  ]

  function sortElements(a, b) {
    if (a.node.order < b.node.order) {
      return -1
    }
    if (a.node.order > b.node.order) {
      return 1
    }
    return 0
  }

  function TranslationTable({ value }) {
    if(value === null) return (
      <Text>
        Não precisa de tradução
      </Text>
    )

    if(value?.table?.isClosed) return (
      <Box>
        <Text
          as="a"
          target="_blank"
          href={`${process.env.NEXT_PUBLIC_BASE_URL_FRONTEND}/dataset/${value?.table?.dataset?._id}?table=${value?.table?._id}`}
          display="flex"
          flexDirection="row"
          alignItems="center"
          gap="4px"
          color="#0068C5"
          fill="#0068C5"
          _hover={{
            color:"#0057A4",
            fill:"#0057A4"
          }}
        >
          Acessar tabela que faz a tradução desta coluna
          <RedirectIcon width="14px" height="14px"/>
        </Text>
        <Text>{value?.table?.dataset?.name} - {value?.table?.name}</Text>
      </Box>
    )

    const cloudValues = value?.table?.cloudTables?.edges?.[0]?.node

    const gcpDatasetID = cloudValues?.gcpDatasetId || ""
    const gcpTableId = cloudValues?.gcpTableId || ""
    const downloadUrl = `https://storage.googleapis.com/basedosdados-public/one-click-download/${gcpDatasetID}/${gcpTableId}/${gcpTableId}.csv.gz`

    const datasetName = value?.table?.dataset?.name || ""
    const tableName = value?.table?.name || ""
  
    return (
      <Box>
        <Text
          as="a"
          target="_blank"
          href={downloadUrl}
          display="flex"
          flexDirection="row"
          alignItems="center"
          gap="4px"
          color="#0068C5"
          fill="#0068C5"
          _hover={{
            color:"#0057A4",
            fill:"#0057A4"
          }}
        >
          Baixar tabela que faz a tradução desta coluna
          <DownloadIcon width="18px" height="18px"/>
        </Text>
        <Text>{datasetName} - {tableName}</Text>
      </Box>
    )
  }

  const measurementUnit = (value) => {
    if(!value) return "Não informado"

    const splitValue = value.split(/([^a-z])/)
    const translated = (value) => value.map((elm) =>  elm)

    return (
      <Latex>{`$${translated(splitValue).join("")}$`}</Latex>
    )
  }

  function TableHeader({ header, ...props }) {
    return (
      <Th
        role="row"
        position="sticky"
        top="0"
        fontFamily="Roboto"
        fontWeight="400"
        fontSize="14px"
        lineHeight="20px"
        color="#252A32"
        backgroundColor="#F7F7F7"
        border="none !important"
        padding="0 !important"
        textTransform="none"
        letterSpacing="inherit"
        boxSizing="content-box"
        zIndex={1}
        {...props}
      >
        <Box
          display="flex"
          gridGap="8px"
          alignItems="center"
          role="columnheader"
          padding="14px 22px"
        >
          {header.pt}
          <Tooltip
            label={header.tooltip}
            hasArrow
            padding="16px"
            backgroundColor="#252A32"
            boxSizing="border-box"
            borderRadius="8px"
            fontFamily="Roboto"
            fontWeight="400"
            fontSize="14px"
            lineHeight="20px"
            textAlign="center"
            color="#FFFFFF"
            placement="top"
            maxWidth="300px"
            {...props}
          >
            <InfoIcon
              alt="tip"
              cursor="pointer"
              fill="#878A8E"
              width="16px"
              height="16px"
            />
          </Tooltip>
        </Box>
        <Box
          display={header.pt === "Nome" ? "flex" : "none"}
          position="absolute"
          right="0"
          top="0"
          height="100%"
          width="1px"
          backgroundColor="#DEDFE0"
        />
        <Box
          position="absolute"
          bottom="0"
          height="1px"
          width="100%"
          backgroundColor="#DEDFE0"
        />
      </Th>
    )
  }

  function TableValue({children, ...props}) {
    return (
      <Td
        role="cell"
        position="relative"
        padding="14px 22px"
        fontFamily="Roboto"
        fontWeight="400"
        fontSize="14px"
        lineHeight="20px"
        color="#464A51"
        backgroundColor="#FFF"
        borderColor="#DEDFE0"
        textTransform="none"
        letterSpacing="inherit"
        {...props}
      >
        {children}
      </Td>
    )
  }

  if(isError) return (
    <Stack justifyContent="center" alignItems="center">
      <InternalError
        widthImage="300"
        heightImage="300"
      />
    </Stack>
  )

  return (
    <Stack width="100%" gap="16px" spacing={0}>
      <Skeleton
        startColor="#F0F0F0"
        endColor="#F3F3F3"
        borderRadius="14px"
        height="40px"
        width="100%"
        isLoaded={!isSearchLoading}
      >
        <SearchColumn
          resource={resource}
          columns={setColumns}
          isLoaded={setIsLoading}
        />
      </Skeleton>

      <Skeleton
        startColor="#F0F0F0"
        endColor="#F3F3F3"
        borderRadius="6px"
        height="100%"
        width="100%"
        isLoaded={!isLoading}
      >
        <TableContainer
          height="100%"
          maxHeight="300px"
          overflowY="auto"
          border="1px solid #DEDFE0"
          borderBottom="0px"
          borderRadius="16px"
        >
          <Table position="relative" role="table">
            <Thead role="rowgroup" position="relative">
              <Tr>
                {template === "checks" &&
                  <Th
                    role="row"
                    position="sticky"
                    top="0"
                    boxSizing="content-box"
                    alignItems="center"
                    border="none !important"
                    backgroundColor="#F7F7F7"
                    padding="0 !important"
                    zIndex={5}
                  >
                    <Box padding="14px 22px 14px 30px" >
                      <Checkbox
                        isChecked={checkedColumns.length === resource.length}
                        onChange={handleMasterCheckboxChange}
                        isIndeterminate={checkedColumns.length !== resource.length && checkedColumns.length > 0}
                        hasIndeterminate={checkedColumns.length !== resource.length && checkedColumns.length > 0}
                      />
                    </Box>
                    <Box
                      position="absolute"
                      bottom="0"
                      height="1px"
                      width="100%"
                      backgroundColor="#DEDFE0"
                    />
                  </Th>
                }

                <TableHeader
                  header={headers[0]}
                  zIndex={5}
                  left={{base: "none", lg:"0"}}
                />

                {headers.map((elm, i) => (
                  i != 0 && <TableHeader key={i} header={elm}/>
                ))}
              </Tr>
            </Thead>

            <Tbody role="rowgroup" position="relative">
              {columns.length > 0 && columns.map((elm,i) => (
                <Tr
                  key={i}
                  role="row"
                  borderBottom="1px solid #DEDFE0"
                >
                  {template === "checks" &&
                    <Td
                      role="cell"
                      position="relative"
                      padding="0 !important"
                      backgroundColor="#FFF"
                      borderColor="#DEDFE0"
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        padding="14px 22px 14px 30px"
                      >
                        <Checkbox
                          isChecked={isChecked(elm.node.name)}
                          onChange={() => handleCheckboxChange(elm.node.name)}
                        />
                      </Box>
                    </Td>
                  }

                  <TableValue
                    position="sticky"
                    left={{base: "none", lg:"0"}}
                    zIndex="4"
                    backgroundColor="#FFF"
                  >
                    {elm?.node?.name ? elm.node.name : "Não informado"}
                    <Box
                      position="absolute"
                      right="0"
                      top="0"
                      height="100%"
                      width="1px"
                      backgroundColor="#DEDFE0"
                    />
                  </TableValue>

                  <TableValue>
                    {template === "download" ?
                      <TranslationTable value={elm?.node?.directoryPrimaryKey}/>
                    :
                    
                      elm?.node?.coveredByDictionary === true ? "Sim" :
                      elm?.node?.directoryPrimaryKey?._id ? "Sim" :
                      elm?.node?.coveredByDictionary === false ? "Não"
                      :
                      "Não informado"
                    }
                  </TableValue>

                  <TableValue>
                    {elm?.node?.description ? elm.node.description : "Não informado"}
                  </TableValue>

                  <TableValue>
                    {elm?.node?.bigqueryType?.name ? elm.node.bigqueryType.name : "Não informado"}
                  </TableValue>

                  <TableValue>
                    {elm?.node?.coverage?.start && elm?.node?.coverage?.end ?
                      elm.node.coverage.start +" - "+ elm.node.coverage.end
                      :
                      "Não informado"
                    }
                  </TableValue>

                  <TableValue>
                    {elm?.node?.measurementUnit ?
                      measurementUnit(elm.node.measurementUnit)
                      :
                      "Não informado"
                    }
                  </TableValue>

                  <TableValue>
                    {
                      elm?.node?.containsSensitiveData === true ? "Sim"
                      :
                      elm?.node?.containsSensitiveData === false ? "Não"
                      :
                      "Não informado"
                    }
                  </TableValue>

                  <TableValue>
                    {elm?.node?.observations ? elm.node.observations : "Não informado"}
                  </TableValue>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Skeleton>
    </Stack>
  )
}
