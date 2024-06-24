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
import LoadingSpin from '../atoms/Loading';
import { ControlledInputSimple } from '../atoms/ControlledInput';

import {
  getColumnsBdmTable
} from "../../pages/api/datasets/index";

import InternalError from '../../public/img/internalError'
import InfoIcon from '../../public/img/icons/infoIcon';
import RedirectIcon from '../../public/img/icons/redirectIcon';
import SearchIcon from '../../public/img/icons/searchIcon';
import CrossIcon from '../../public/img/icons/crossIcon';
import 'katex/dist/katex.min.css';

function SearchColumn({ isLoaded, resource, columns }) {
  const [inputFocus, setInputFocus] = useState(false)
  const [skipFirstDebounced, setSkipFirstDebounced] = useState(true)
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
      if(!skipFirstDebounced) {
        const result = searcherColumn.search(search.trim())
        if(result.length > 0) {
          columns(result)
        } else {
          columns(resource)
        }
      }
      setSkipFirstDebounced(false)
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
      fillHover="#878A8E"
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

export default function ColumnsDatasets({ tableId }) {
  const [resource, setResource] = useState({})
  const [columns, setColumns] = useState({})
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const featchColumns = async () => {
      setIsLoading(true)
      try {
        const result = await getColumnsBdmTable(tableId)

        if(result) {
          setResource(result.sort(sortElements))
          setColumns(result.sort(sortElements))
          setIsLoading(false)
        }

      } catch (error) {
        console.error(error)
        setIsError(true)
      }
    }

    featchColumns()
  },[tableId])

  const headers = [
    {
      pt: "Nome",
      tooltip:"Nome da coluna."
    },
    // {
    //   pt: "Coberta Por Um Dicionário",
    //   tooltip:"Indica se a coluna possui categorias descritas na tabela 'dicionario', explicando o significado das suas chaves e valores — ex: 'sexo' possui os valores 0 e 1 na coluna, e, no dicionario, você irá encontrar 'sexo' com as categorias (chave: 1 - valor: Feminino), (chave: 0 - valor: Masculino)."
    // },
    // {
    //   pt: "Coluna Correspondente Nos Diretórios",
    //   tooltip:"Caso preenchida, indica que a coluna é chave primária de uma entidade — ex: id_municipio = chave primária de municípios. Isso significa que a coluna é igual em todos os conjuntos do datalake. Informações centralizadas da entidade se encontram no diretório conforme: [diretorio].[tabela]:[coluna]."
    // },
    {
      pt: "Precisa de tradução",
      tooltip:"A coluna possui códigos institucionais a serem traduzidos."
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

  const empty = () => {
    return (
      <Text
        fontFamily="Roboto"
        fontWeight="400"
        fontSize="14px"
        lineHeight="20px"
        color="#464A51"
      >
        Não informado
      </Text>
    )
  }

  const directoryColumnValue = (value) => {
    const dataset = value?.table?.dataset
    const table = value?.table
    const newDirectoryColumn = `${dataset?.slug}.${table?.slug}:${value?.name}`
  
    if (newDirectoryColumn === "undefined.undefined:undefined") return empty()

    return (
      <div style={{display:"flex", alignItems:"center", gap:"10px"}}>
        {newDirectoryColumn}
        <a target={"_blank"} href={`/dataset/${dataset?._id}?table=${table?._id}`}>
          <RedirectIcon
            alt="hiperlink"
            fill="#42B0FF"
            cursor="pointer" 
            _hover={{opacity:0.7}}
          />
        </a> 
      </div>
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
    <Stack width="100%">
      <SearchColumn
        resource={resource}
        columns={setColumns}
        isLoaded={setIsLoading}
      />

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
          maxHeight="400px"
          overflowY="auto"
          border="1px solid #DEDFE0"
          borderBottom="0px"
          borderRadius="16px"
        >
          <Table position="relative" role="table">
            <Thead role="rowgroup" position="relative">
              <Tr>
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
                    {
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
