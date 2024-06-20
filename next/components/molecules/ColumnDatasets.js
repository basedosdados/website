import {
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tooltip,
  HStack,
  Stack,
  Box,
  Text,
  Input,
  InputGroup,
  InputRightElement,
  InputLeftAddon,
  Select,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import FuzzySearch from 'fuzzy-search';
import Latex from 'react-latex-next';
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";
import SectionText from '../atoms/SectionText';
import LoadingSpin from '../atoms/Loading'
import Tag from "../atoms/Tag";
import { TemporalCoverage } from "./TemporalCoverageDisplay";

import {
  getColumnsBdmTable
} from "../../pages/api/datasets/index";

import InfoIcon from '../../public/img/icons/infoIcon';
import RedirectIcon from '../../public/img/icons/redirectIcon';
import FilterIcon from '../../public/img/icons/filterIcon';
import SearchIcon from '../../public/img/icons/searchIcon';
import CrossIcon from '../../public/img/icons/crossIcon';
import 'katex/dist/katex.min.css';

function TableDatasets({ headers, values }) {
  const [columnsHeaders, setColumnsHeaders] = useState([])
  const [columnsValues, setColumnsValues] = useState([])

  function sortElements(a, b) {
    if (a.node.order < b.node.order) {
      return -1
    }
    if (a.node.order > b.node.order) {
      return 1
    }
    return 0
  }

  useEffect(() => {
    const newValues = values?.map((elm) => {
      delete elm.node._id
      return elm
    })

    setColumnsHeaders(Object.keys(headers))
    setColumnsValues(newValues.sort(sortElements))
  },[values, headers])


  const empty = () => {
    return (
      <p style={{margin:"0", fontWeight:"500", color:"#C4C4C4"}}>
        Não listado
      </p>
    )
  }

  function valueVerification (value) {
    if(value === null || value === undefined) return empty()

    if(typeof value === "function") return value()

    if(value === true) return "Sim"
    if(value === false) return "Não"

    if(value) {
      if(value === "Não listado"){
        return empty()
      } else {
        return value
      }
    } else {
      return empty()
    }
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
    if(!value) return null

    const measurementUnitLatex = () => {
      const splitValue = value.split(/([^a-z])/)
      const translated = (value) => value.map((elm) =>  elm)
      return (
        <Latex>{`$${translated(splitValue).join("")}$`}</Latex>
      )
    }
    return measurementUnitLatex
  }

  const TableHeader = ({ header, ...props }) => {
    if(header === undefined) return null

    return (
      <Th
        role="row"
        position="sticky"
        top="0"
        padding="8px 24px"
        fontSize="14px"
        color="#6F6F6F"
        background="#F6F6F6"
        fontWeight="500"
        fontFamily="Ubuntu"
        letterSpacing="0.4px"
        textTransform="capitalize"
        boxSizing="content-box"
        zIndex={1}
        {...props}
      >
        <Box display="flex" gridGap="8px" alignItems="end"  role="columnheader">
          {headers[header].pt}
          <Tooltip
            hasArrow
            bg="#2A2F38"
            label={headers[header].tooltip}
            fontSize="16px"
            fontWeight="500"
            padding="5px 16px 6px"
            marginTop="8px"
            color="#FFF"
            borderRadius="6px"
          >
            <InfoIcon alt="tip" cursor="pointer" fill="#A3A3A3"/>
          </Tooltip>
        </Box>
      </Th>
    )
  }

  function TreatmentValues({ value }) {
    const objectValue = value?.node
    let data = []

    data.push({ value: objectValue.name, style:{position:"sticky", left:"0", zIndex:2, background:"linear-gradient(to left,#EAEAEA, #EAEAEA 2px, #FFF 2px, #FFF 100%)"}});
    data.push({ value: objectValue.bigqueryType.name, style:{textTransform: "uppercase"}})
    data.push({ value: objectValue.description})
    data.push({ value: objectValue.coverage})
    data.push({ value: objectValue.coveredByDictionary})
    data.push({ value: directoryColumnValue(objectValue.directoryPrimaryKey)})
    data.push({ value: measurementUnit(objectValue.measurementUnit)})
    data.push({ value: objectValue.containsSensitiveData})
    data.push({ value: objectValue.observations})

    return data.map((elm, i) => 
      <TableValue key={i} {...elm.style}>
        {i===3 ? <TemporalCoverage value={elm.value} tex="Não listado"/> : valueVerification(elm.value)}
      </TableValue>
    )
  }

  function TableValue({children, ...props}) {
    return (
      <Td
        role="cell"
        position="relative"
        padding="10px 24px"
        fontSize="14px"
        fontFamily="Lato"
        letterSpacing="0.5px"
        color="#000000a8"
        borderColor="#EAEAEA"
        _first={{
          color:"#252A32"
        }}
        {...props}
      >
        {children}
      </Td>
    )
  }

  return (
    <HStack width="100%" >
      <TableContainer
        height="100%"
        maxHeight="400px"
        overflowY="auto"
      >
        <Table position="relative" role="table">
          <Thead role="rowgroup" position="relative">
            <TableHeader
              header={columnsHeaders[0]}
              zIndex={4}
              backgroundColor="#F6F6F6"
              left="0"
            />
            {columnsHeaders.map((elm, i) => (
              i != 0 && <TableHeader key={i} header={elm}/>
            ))}
          </Thead>
          <Tbody role="rowgroup" position="relative">
            {columnsValues?.length > 0 && columnsValues.map((elm, i) => (
              <Tr role="row" key={i}>
                <TreatmentValues value={elm}/>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </HStack>
  )
}

export default function ColumnsDatasets({ tableId }) {
  const [resource, setResource] = useState({})
  const [isError, setIsError] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const featchColumns = async () => {
    setIsLoading(true)
    try {
      const result = await getColumnsBdmTable(tableId)
      setResource(result)
    } catch (error) {
      setIsError(error)
      console.error(error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    featchColumns()
  },[tableId])

  const headers = {
    name: {
      pt: "Nome",
      tooltip:"Nome da coluna."
    },
    bigqueryType: {
      pt: "Tipo No BigQuery",
      tooltip:"Tipo de dado no BigQuery — categorias: INTEGER (Inteiro), STRING (Texto), DATE (Data), FLOAT64 (Decimal), GEOGRAPHY (Geográfico)."
    },
    description: {
      pt: "Descrição",
      tooltip:"Descrição dos dados da coluna."
    },
    datetimeRanges: {
      pt: "Cobertura Temporal",
      tooltip:"Data inicial e final de cobertura dos dados. Pode variar entre colunas, de acordo com a disponibilidade nos dados originais."
    },
    coveredByDictionary: {
      pt: "Coberta Por Um Dicionário",
      tooltip:"Indica se a coluna possui categorias descritas na tabela 'dicionario', explicando o significado das suas chaves e valores — ex: 'sexo' possui os valores 0 e 1 na coluna, e, no dicionario, você irá encontrar 'sexo' com as categorias (chave: 1 - valor: Feminino), (chave: 0 - valor: Masculino)."
    },
    directoryPrimaryKey: {
      pt: "Coluna Correspondente Nos Diretórios",
      tooltip:"Caso preenchida, indica que a coluna é chave primária de uma entidade — ex: id_municipio = chave primária de municípios. Isso significa que a coluna é igual em todos os conjuntos do datalake. Informações centralizadas da entidade se encontram no diretório conforme: [diretorio].[tabela]:[coluna]."
    },
    measurementUnit: {
      pt: "Unidade De Medida",
      tooltip:"Unidade de medida da coluna — ex: km, m2, kg."
    },
    containsSensitiveData: {
      pt: "Contém Dados Sensíveis (LGPD)",
      tooltip:"Indica se a coluna possui dados sensíveis — ex: CPF identificado, dados de conta bancária, etc."
    },
    observations: {
      pt: "Observações",
      tooltip:"Descreve processos de tratamentos realizados na coluna que precisam ser evidenciados."
    }
  }

  if(isLoading) return (
    <LoadingSpin/>
  )

  if(isError?.message?.length > 0) return <SectionText> Nenhuma informação foi encontrada. </SectionText>
  if(resource === undefined || Object.keys(resource).length === 0) return <SectionText> Nenhuma informação de coluna fornecida. </SectionText>

  return (
    <Stack width="100%">
      <Box borderRadius="16px" height="48px" backgroundColor="#EEEEEE"/>

      <TableDatasets
        headers={headers}
        values={resource}
      />
    </Stack>
  )
}
