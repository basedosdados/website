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
import { formatJson, getTemporalCoverage } from '../../utils';
import Tag from "../atoms/Tag"
import InfoIcon from '../../public/img/icons/infoIcon';
import RedirectIcon from '../../public/img/icons/redirectIcon';
import FilterIcon from '../../public/img/icons/filterIcon';
import SearchIcon from '../../public/img/icons/searchIcon';
import CrossIcon from '../../public/img/icons/crossIcon';
import 'katex/dist/katex.min.css';

function translate(field, translation) {
  if(typeof field === "boolean") return field === true ? "Sim" : "Não"

  if(typeof field === "object") {
    if(!field) return "Não listado"
    
    if(field.length === 0) {
      return "Não listado"
    } else {
      const newJson = JSON.stringify(field)
      return formatJson(newJson, true)
    }
  }

  return translation[field] || field
}

function TableDatasets({
  headers,
  values,
  translations,
  availableOptionsTranslations,
  translationsOptions,
  parentTemporalCoverage,
  tooltip,
  containerStyle,
}) {
  const [columnsHeaders, setColumnsHeaders] = useState([])
  const [columnsValues, setColumnsValues] = useState([])

  useEffect(() => {
    const schemaHeaders = headers.reduce((obj, cur) => (
      {...obj, [cur]: "Não listado"}), {})
    const newValues = values.map((elm) => {
      const values = elm
      const directoryColumn = () => {
        if(!values.directory_column) return {directory_column : "Não listado"}

        if(typeof values.directory_column === "object") {
          const directory = Object.values(values.directory_column)
            .map((elm) => {
              if(!elm) {
                return "Não listado"
              } else {
                return elm
              }
            })
            return { directory_column : directory }
        } else {
          return {directory_column : "Não listado"}
        }
      }

      const temporalCoverage = () => {
        if(!values.temporal_coverage) return {temporal_coverage : "Não listado"}
        
        if(typeof values.temporal_coverage === "object") {
          return {temporal_coverage: getTemporalCoverage(values.temporal_coverage, parentTemporalCoverage)}
        } else {
          return {temporal_coverage : "Não listado"}
        }
      }

      const measurementUnit = () => {
        if(!values.measurement_unit) return {measurement_unit : "Não listado"}
        const measurementUnitLatex = () => {
          const splitValue = values.measurement_unit.split(/([^a-z])/)
          const translated = (value) => value.map((elm) =>  translate(elm, translationsOptions["Measurement Unit"]) )
          return (
            <Latex>{`$${translated(splitValue).join("")}$`}</Latex>
          )
        }
        return {measurement_unit : measurementUnitLatex} 
      }

      const formatting = {
        ...values,
        ...directoryColumn(),
        ...temporalCoverage(),
        ...measurementUnit()
      }

      const row = {...schemaHeaders, ...formatting}

      delete row.is_in_staging
      delete row.is_partition

      const translations = () => {
        return {
          bigquery_type : translate(row.bigquery_type, translationsOptions["BigQuery Type"]),
          covered_by_dictionary: translate(row.covered_by_dictionary, availableOptionsTranslations),
          has_sensitive_data: translate(row.has_sensitive_data, availableOptionsTranslations),
        }
      }

      const translatedRow = {...row,...translations()}

      return Object.values(translatedRow)
    })

    delete schemaHeaders.is_in_staging
    delete schemaHeaders.is_partition

    setColumnsHeaders(Object.keys(schemaHeaders))
    setColumnsValues(newValues)
    
  },[values, headers])

  const empty = () => {
    return (
      <p style={{margin:"0", fontWeight:"500", color:"#C4C4C4"}}>
        Não listado
      </p>
    )
  }

  const directoryColumnValue = (value) => {
    const newDirectoryColumn = `${value[0]}.${value[1]}:${value[2]}`
    const datasetUrl = value[0].replace(/_/g, "-")
  
    if (newDirectoryColumn === "Não listado.Não listado:Não listado") return empty()

    return (
      <div style={{display:"flex", alignItems:"center", gap:"10px"}}>
        {newDirectoryColumn}
        <a target={"_blank"} href={`/dataset/${datasetUrl}?bdm_table=${value[1]}`}>
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

  function valueVerification (value) {
    if(value === null) return empty()

    if(typeof value === "object") return directoryColumnValue(value)
    if(typeof value === "function") return value()

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

  const TableHeader = ({ hander, ...props }) => {
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
        boxShadow="0 0 0 1px #EAEAEA"
        zIndex={1}
        {...props}
      >
        {tooltip ?
          <Box display="flex" gridGap="8px" alignItems="end"  role="columnheader">
            {translations ? translate(hander, translations) : hander}
            <Tooltip
              hasArrow
              bg="#2A2F38"
              label={tooltip[hander]}
              fontSize="16px"
              fontWeight="500"
              padding="5px 15px"
              marginTop="8px"
              color="#FFF"
              borderRadius="6px"
            >
              <InfoIcon alt="tip" cursor="pointer" fill="#A3A3A3"/>
            </Tooltip>
          </Box>
          :
          <div role="columnheader">
            {translations ? translate(hander, translations) : hander}
          </div>
        }
      </Th>
    )
  }

  const TableValue = ({ value, ...props }) => {
    return (
      <Td
        role="cell"
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
        {valueVerification(value)}
      </Td>
    )
  }

  return (
    <HStack
      width="100%"
      {...containerStyle}
    >
      <TableContainer
        height="100%"
        maxHeight="400px"
        overflowY="auto"
      >
        <Table position="relative" role="table">
          <Thead role="rowgroup" position="relative">
            <TableHeader
              hander={columnsHeaders[0]}
              zIndex={4}
              backgroundColor="#F6F6F6"
              left="0"
            />
            {columnsHeaders.map((elm, i) => (
              i != 0 && <TableHeader hander={elm}/>
            ))}
          </Thead>
          <Tbody role="rowgroup" position="relative">
            {columnsValues.map((elm) => (
              <Tr role="row">
                <TableValue
                  backgroundColor="#FFF"
                  value={elm[0]}
                  position="sticky"
                  left="0"
                  zIndex={2}
                  boxShadow="0 0 0 1px #EAEAEA"
                />
                {elm.map((r, i) => (
                  i != 0 &&
                  <TableValue
                    value={r}
                    position="relative"
                  />
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </HStack>
  )
}

export default function ColumnsDatasets({
  headers,
  values,
  translations,
  availableOptionsTranslations,
  translationsOptions,  
  parentTemporalCoverage,
  tooltip,
  containerStyle,
}) {
  const isMobile = useCheckMobile();
  const [isMobileMode, setIsMobileMode] = useState(false)

  useEffect(() => {
    setIsMobileMode(isMobile)
  },[isMobile])

  const [filter, setFilter] = useState("")
  const [headerSelection, setHeaderSelection] = useState("")
  const [defaultValues, setDefaultValue] = useState([])
  const [columnValues, setColumnValues] = useState([])
  const [tagFilter, setTagFilter] = useState([])

  useEffect(() => {
    setDefaultValue(values)
    setColumnValues(values)
    setTagFilter([])
    setFilter("")
  },[values]) 

  const searcher = new FuzzySearch(
    tagFilter.length > 0 ? columnValues : defaultValues,
    headerSelection ? [headerSelection] : headers, {
    sort: true
  })

  async function checkForEnter(e) {
    if (e.key === "Enter") {
      appliedFilter()
    }
  }

  const appliedFilter = () => {
    if(filter.trim() === "") return

    const result = searcher.search(filter.trim())
    if(headerSelection) {
      const indexTag= tagFilter.findIndex((res) => res.header === headerSelection)
      if(indexTag > -1) {
        removeTagFilter(tagFilter[indexTag], true)
      } else {
        setTagFilter(tagFilter.concat({ header: headerSelection, search: filter }))
        setColumnValues(result)
        setFilter("")
        setHeaderSelection("")
      }
    } else {
      setTagFilter(tagFilter.concat({ header: "", search: filter }))
      setColumnValues(result)
      setFilter("")
      setHeaderSelection("")
    }
  }
  
  const removeTagFilter = (tag, overwrite) => {
    let newColumnsValues = []
    const remainingTags = tagFilter.filter(function(elm) {
      if(tag.search && elm.header === tag.header) return elm.search != tag.search
      return elm.header != tag.header
    })
    if(overwrite) remainingTags.push({ header: headerSelection, search: filter })
    if(remainingTags.length > 0) {
      remainingTags.map((elm, i) => {
        const searcherRemainingTags = new FuzzySearch( 
          i === 0 ? defaultValues : newColumnsValues, elm.header ? [elm.header] : headers, {
          sort: true
        })
        const result = searcherRemainingTags.search(elm.search)
        return newColumnsValues = result
      })
      setColumnValues(newColumnsValues)
    } else {
      setColumnValues(defaultValues)
    }
    setFilter("")
    setHeaderSelection("")
    setTagFilter(remainingTags)
  }

  return (
    <Stack width="100%">
      <HStack position="relative" flexDirection={isMobileMode ? "column" : "row"}>
        <HStack spacing={2} flexDirection="row" marginBottom={isMobileMode && "8px"} marginLeft="0 !important">
          <FilterIcon alt="filtrar" fill="#575757" height="20px" />
          <Text color="#575757" fontSize="16px" fontWeight="400" fontFamily="ubuntu" letterSpacing="0.2px">
            Filtrar
          </Text>
          <Select
            marginLeft="24px !important"
            variant="unstyled"
            width="max-content"
            maxWidth="200px"
            height="100%"
            fontFamily="ubuntu"
            fontSize="16px"
            letterSpacing="0.2px"
            color={headerSelection ? "#2B8C4D" : "#575757"}
            placeholder="Todas as propriedades"
            value={headerSelection}
            onChange={(event) => setHeaderSelection(event.target.value) }
          >
            {headers.map((option) =>
              <option value={option}>{translate(option, translations)}</option>
            )}
          </Select>
        </HStack>

        <Stack width="100%" margin="0 !important">
          <InputGroup
            border="1px solid #DEDFE0 !important"
            padding="1px"
            _hover={{border: "2px solid #42B0FF !important", padding: "0"}}
            borderRadius="16px"
          >
            {tagFilter.length > 0 && (
              <InputLeftAddon
                border="none"
                backgroundColor="transparent"
                children={
                  <Box display="flex" flexDirection="row" gridGap="16px" maxWidth={isMobileMode ? "150px" : "350px"} overflowX="auto">
                    {tagFilter.map((elm) => (
                      <Box display="flex" gridGap={elm.header && "8px"} alignItems="center" >
                        <Text fontWeight="300" fontSize="14px" fontFamily="lato" letterSpacing="0.5px">{translate(elm.header, translations)}</Text>
                        <Tag
                          fontWeight="700"
                          text={elm.search}
                          handleClick={() => removeTagFilter(elm, null)}
                        />
                      </Box>
                    ))}
                  </Box>
                }
              />
            )}

            <Input
              value={filter}
              onKeyDown={checkForEnter}
              onChange={(e) => setFilter(e.target.value)}
              variant="outline"
              letterSpacing="0.5px"
              fontWeight="300"
              border="none"
              borderRadius="16px"
              fontFamily="lato"
              fontSize="16px"
              color="#252A32"
              width="100%"
              minWidth="200px"
              height="40px"
              placeholder="Insira o nome ou o valor da propriedade"
              _placeholder={{color:"#C4C4C4"}}
            />
            <InputRightElement children={
              tagFilter.length < 1 
              ?
                <SearchIcon
                  alt="pesquisar"
                  cursor="pointer"
                  fill="#D0D0D0"
                  marginRight="6px"
                  onClick={() => appliedFilter()}
                />
              :
                <CrossIcon
                  alt="limpar pesquisa"
                  cursor="pointer"
                  fill="#D0D0D0"
                  marginRight="6px"
                  width="20px"
                  height="20px"
                  onClick={() => {
                    setTagFilter([])
                    setHeaderSelection("")
                    setColumnValues(defaultValues)
                    setFilter("")
                  }}
                />
            }/>
          </InputGroup>
        </Stack>
      </HStack>

      <TableDatasets
        headers={headers}
        values={columnValues}
        translations={translations}
        availableOptionsTranslations={availableOptionsTranslations}
        translationsOptions={translationsOptions}
        parentTemporalCoverage={parentTemporalCoverage}
        tooltip={tooltip}
        containerStyle={containerStyle}
      />
    </Stack>
  )
}
