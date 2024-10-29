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
import { useRouter } from 'next/router';
import FuzzySearch from 'fuzzy-search';
import Latex from 'react-latex-next';
import cookies from 'js-cookie';
import { ControlledInputSimple } from '../atoms/ControlledInput';
import Checkbox from '../atoms/Checkbox';
import { triggerGAEvent, formatBytes } from '../../utils';
import { useTranslation } from 'next-i18next';
import { capitalize } from 'lodash';

import InternalError from '../../public/img/internalError'
import InfoIcon from '../../public/img/icons/infoIcon';
import DownloadIcon from '../../public/img/icons/downloadIcon';
import SearchIcon from '../../public/img/icons/searchIcon';
import RedirectIcon from '../../public/img/icons/redirectIcon';
import 'katex/dist/katex.min.css';

function SearchColumn({ isLoaded, resource, columns }) {
  const { t } = useTranslation('dataset');
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
      placeholder={t('column.search')}
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

export default function TableColumns({
  tableId,
  checkedColumns,
  onChangeCheckedColumns,
  hasLoading,
  setHasLoading,
  numberColumns,
  template,
}) {
  const router = useRouter()
  const { query, locale } = router
  const [resource, setResource] = useState({})
  const [columns, setColumns] = useState({})
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSearchLoading, setIsSearchLoading] = useState(true)
  const { t } = useTranslation('dataset');

  const isChecked = (columnSlug) => checkedColumns.includes(columnSlug)

  const isUserPro = () => {
    let user
    if(cookies.get("userBD")) user = JSON.parse(cookies.get("userBD"))

    if(user?.internalSubscription?.edges?.[0]?.node?.isActive === true) return true
    return false
  }

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
        const url = `/api/tables/getTableColumns?id=${tableId}&locale=${locale}`;
        const response = await fetch(url, { method: "GET" })
        const result = await response.json()

        if(result.success) {
          setResource(result.resource.sort(sortElements))
          numberColumns(result.resource.length)
          setColumns(result.resource.sort(sortElements))
          setHasLoading(false)
          setIsSearchLoading(false)
          setIsError(false)
        } else {
          console.error(result.error)
          setIsError(true)
        }

      } catch (error) {
        console.error(error)
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }

    featchColumns()
  },[tableId, locale])

  useEffect(() => {
    setIsLoading(hasLoading)
  }, [hasLoading])

  const headers = [
    {
      pt: t('column.name'),
      tooltip: t('column.nameTooltip')
    },
    {
      pt: template === "download" ? t('column.translationTable') : t('column.needsTranslation'),
      tooltip: template === "download" ? t('column.translationTableTooltip') : t('column.needsTranslationTooltip')
    },
    {
      pt: t('column.description'),
      tooltip: t('column.descriptionTooltip')
    },
    {
      pt: t('column.bigQueryType'),
      tooltip: t('column.bigQueryTypeTooltip')
    },
    {
      pt: t('column.temporalCoverage'),
      tooltip: t('column.temporalCoverageTooltip')
    },
    {
      pt: t('column.measurementUnit'),
      tooltip: t('column.measurementUnitTooltip')
    },
    {
      pt: t('column.sensitiveData'),
      tooltip: t('column.sensitiveDataTooltip')
    },
    {
      pt: t('column.observations'),
      tooltip: t('column.observationsTooltip')
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

  function HasDownloadPermitted(value) {
    let downloadPermitted = false
    let downloadWarning = ""

    if (value) {
      const limit100MB = 100 * 1024 * 1024;
      const limit1GB = 1 * 1024 * 1024 * 1024;

      if (value < limit100MB) {
        downloadPermitted = true
        downloadWarning = "free"
      } else if (value < limit1GB) {
        downloadPermitted = isUserPro()
        downloadWarning = "100mbBetween1gb"
      } else {
        downloadPermitted = false
        downloadWarning = "biggest1gb"
      }
    }

    return {
      downloadPermitted : downloadPermitted,
      downloadWarning : downloadWarning
    }
  }

  function DictionaryDownload() {
    async function downloadTable() {
      const result = await fetch(`/api/tables/getDictionaryTable?p=${btoa(query.dataset)}`, {method: "GET"})
        .then(res => res.json())

      if(result?.error) return

      let cloudTables = result?.cloudTables?.edges[0]?.node
      const downloadInfo = HasDownloadPermitted(result?.uncompressedFileSize)

      triggerGAEvent("download_da_tabela",`{
        gcp: ${cloudTables?.gcpProjectId+"."+cloudTables?.gcpDatasetId+"."+cloudTables?.gcpTableId},
        tamanho: ${formatBytes(result.uncompressedFileSize) || ""},
        dataset: ${query.dataset},
        table: ${resource?._id},
        columnDownload: true
      }`)

      window.open(`/api/tables/downloadTable?p=${btoa(cloudTables?.gcpDatasetId)}&q=${btoa(cloudTables?.gcpTableId)}&d=${btoa(downloadInfo.downloadPermitted)}&s=${btoa(downloadInfo.downloadWarning)}`)
    }

    return (
      <Box>
        <Text
          as="button"
          onClick={() => downloadTable()}
          display="flex"
          flexDirection="row"
          alignItems="center"
          gap="8px"
          color="#0068C5"
          fill="#0068C5"
          _hover={{
            color:"#0057A4",
            fill:"#0057A4"
          }}
        >
          {t('column.downloadTranslationTable')}
          <DownloadIcon width="14px" height="16px"/>
        </Text>
        <Text>{t('column.dictionary')}</Text>
      </Box>
    )
  }

  function TranslationTable({ value, dictionary }) {
    const downloadInfo = HasDownloadPermitted(value?.table?.uncompressedFileSize)
    const cloudValues = value?.table?.cloudTables?.edges?.[0]?.node

    const gcpProjectID = cloudValues?.gcpProjectId || ""
    const gcpDatasetID = cloudValues?.gcpDatasetId || ""
    const gcpTableId = cloudValues?.gcpTableId || ""

    const datasetName = value?.table?.dataset?.name || ""
    const tableName = value?.table?.name || ""

    if(gcpDatasetID === "br_bd_diretorios_data_tempo") return t('column.noTranslationNeeded')
    if(gcpDatasetID === "br_bd_diretorios_brasil") {
      if(gcpTableId === "empresa" || gcpTableId === "cep") return t('column.noTranslationNeeded')
    }
    if(value?.name === "ddd") return t('column.noTranslationNeeded')

    return (
      <Box>
        {value === null ?
          <Text display={dictionary === true ? "none" : "" }>
            {t('column.noTranslationNeeded')}
          </Text>
        :
          <Box>
            <Text
              as="a"
              target="_blank"
              href={value?.table?.isClosed || !downloadInfo.downloadPermitted
                ? `${process.env.NEXT_PUBLIC_BASE_URL_FRONTEND}/dataset/${value?.table?.dataset?._id}?table=${value?.table?._id}`
                : `/api/tables/downloadTable?p=${btoa(gcpDatasetID)}&q=${btoa(gcpTableId)}&d=${btoa(downloadInfo.downloadPermitted)}&s=${btoa(downloadInfo.downloadWarning)}`
              }
              display="flex"
              onClick={() => {
                if(!downloadInfo.downloadPermitted) return
                triggerGAEvent("download_da_tabela",`{
                  gcp: ${gcpProjectID+"."+gcpDatasetID+"."+gcpTableId},
                  tamanho: ${formatBytes(value?.table?.uncompressedFileSize) || ""},
                  dataset: ${value?.table?.dataset?._id},
                  table: ${value?.table?._id},
                  columnDownload: true
                }`)
              }}
              flexDirection="row"
              alignItems="center"
              gap="8px"
              color="#0068C5"
              fill="#0068C5"
              _hover={{
                color:"#0057A4",
                fill:"#0057A4"
              }}
            >
              {value?.table?.isClosed || !downloadInfo.downloadPermitted
                ?
                <>
                  {t('column.accessTranslationTable')}
                  <RedirectIcon width="14px" height="14px"/>
                </>
                :
                <>
                  {t('column.downloadTranslationTable')}
                  <DownloadIcon width="14px" height="16px"/>
                </>
              }
            </Text>
            <Text>{datasetName} - {tableName}</Text>
          </Box>
        }

        {dictionary === true &&  
          <DictionaryDownload/>
        }
      </Box>
    )
  }

  const measurementUnit = (value) => {
    if(!value) return t('column.notProvided')

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
          display={header.pt === t('column.name') ? {base: "none", lg: "flex"} : "none"}
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

  function TranslationColumnException({ value }) {
    const cloudValues = value?.node?.directoryPrimaryKey?.table?.cloudTables?.edges?.[0]?.node
    const gcpDatasetID = cloudValues?.gcpDatasetId || ""
    const gcpTableId = cloudValues?.gcpTableId || ""

    if(gcpDatasetID === "br_bd_diretorios_data_tempo") return t('column.no')
    if(gcpDatasetID === "br_bd_diretorios_brasil") {
      if(gcpTableId === "empresa" || gcpTableId === "cep") return t('column.no')
    }
    if(value?.node?.name === "ddd") return t('column.no')
    if(value?.node?.coveredByDictionary === true) return t('column.yes')
    if(value?.node?.directoryPrimaryKey?._id) return t('column.yes')
    if(value?.node?.coveredByDictionary === false) return t('column.no')
    return t('column.notProvided')
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
                    left={0}
                    top="0"
                    boxSizing="content-box"
                    alignItems="center"
                    border="none !important"
                    backgroundColor="#F7F7F7"
                    padding="0 !important"
                    zIndex={6}
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
                    <Box
                      display={{base: "flex", lg: "none"}}
                      position="absolute"
                      right="0"
                      top="0"
                      height="100%"
                      width="1px"
                      backgroundColor="#DEDFE0"
                    />
                  </Th>
                }

                <TableHeader
                  header={headers[0]}
                  zIndex={5}
                  left={{base: "none", lg: template === "download" ? "0" : "72px"}}
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
                      position="sticky"
                      left={0}
                      zIndex={5}
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
                          isChecked={isChecked(elm.node[`name${capitalize(locale)}`] || elm.node.name)}
                          onChange={() => handleCheckboxChange(elm.node[`name${capitalize(locale)}`] || elm.node.name)}
                        />
                      </Box>
                      <Box
                        display={{base: "flex", lg: "none"}}
                        position="absolute"
                        right="0"
                        top="0"
                        height="100%"
                        width="1px"
                        backgroundColor="#DEDFE0"
                      />
                    </Td>
                  }

                  <TableValue
                    position="sticky"
                    left={{base: "none", lg: template === "download" ? "0" : "72px"}}
                    zIndex="4"
                    backgroundColor="#FFF"
                  >
                    {elm?.node?.namePt || elm?.node?.name || elm?.node?.[`name${capitalize(locale)}`] || t('column.notProvided')}
                    <Box
                      display={{base: "none", lg: "flex"}}
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
                      <TranslationTable
                        value={elm?.node?.directoryPrimaryKey}
                        dictionary={elm?.node?.coveredByDictionary}
                      />
                    :
                      <TranslationColumnException value={elm}/>
                    }
                  </TableValue>

                  <TableValue>
                    {elm?.node?.[`description${capitalize(locale)}`] || elm?.node?.description || t('column.notProvided')}
                  </TableValue>

                  <TableValue>
                    {elm?.node?.bigqueryType?.name ? elm.node.bigqueryType.name : t('column.notProvided')}
                  </TableValue>

                  <TableValue>
                    {elm?.node?.coverage?.start && elm?.node?.coverage?.end ?
                      elm.node.coverage.start +" - "+ elm.node.coverage.end
                      :
                      t('column.notProvided')
                    }
                  </TableValue>

                  <TableValue>
                    {elm?.node?.measurementUnit ?
                      measurementUnit(elm.node.measurementUnit)
                      :
                      t('column.notProvided')
                    }
                  </TableValue>

                  <TableValue>
                    {
                      elm?.node?.containsSensitiveData === true ? t('column.yes')
                      :
                      elm?.node?.containsSensitiveData === false ? t('column.no')
                      :
                      t('column.notProvided')
                    }
                  </TableValue>

                  <TableValue>
                    {elm?.node?.[`observations${capitalize(locale)}`] || elm?.node?.observations || t('column.notProvided')}
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
