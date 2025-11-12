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
import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useRouter } from 'next/router';
import FuzzySearch from 'fuzzy-search';
import Latex from 'react-latex-next';
import cookies from 'js-cookie';
import { ControlledInputSimple } from '../atoms/ControlledInput';
import Checkbox from '../atoms/Checkbox';
import { triggerGAEventWithData, formatBytes } from '../../utils';
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
  const [inputFocus, setInputFocus] = useState(false);
  const [search, setSearch] = useState("");
  const [_timeout, _setTimeout] = useState(null);

  function getSearcherColumn() {
    return new FuzzySearch(resource, ["name", "description"], {sort: true});
  }

  function handleSearch(searchValue) {
    clearTimeout(_timeout);
    isLoaded(true);
    
    if(searchValue.trim() === "") {
      isLoaded(false);
      return columns(resource);
    }

    _setTimeout(setTimeout(() => {
      const result = getSearcherColumn().search(searchValue.trim());
      if(result.length > 0) {
        columns(result);
      } else {
        columns(resource);
      }
      isLoaded(false);
    }, 500));
  }

  useEffect(() => {
    handleSearch(search);
  }, [search, resource]);

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
  );
}

const TableHeader = memo(({ header, ...props }) => {
  const { t } = useTranslation('dataset');

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
  );
});

const TableValue = memo(({children, ...props}) => {
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
  );
});

function sortElements(a, b) {
  if (a.order < b.order) return -1;
  if (a.order > b.order) return 1;
  return 0;
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
  const router = useRouter();
  const { query, locale } = router;
  const [resource, setResource] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchLoading, setIsSearchLoading] = useState(true);
  const { t } = useTranslation('dataset');

  useEffect(() => {
    const handleTableColumnsLoaded = (e) => {
      setHasLoading(true);
      setIsSearchLoading(true);
      setIsLoading(true);
    };

    window.addEventListener('loadingColumnsEvent', handleTableColumnsLoaded);

    return () => {
      window.removeEventListener('loadingColumnsEvent', handleTableColumnsLoaded);
    };
  }, []);

  const isChecked = useCallback((columnSlug) => 
    checkedColumns.includes(columnSlug),
    [checkedColumns]
  );

  const isUserPro = useCallback(() => {
    let user;
    if(cookies.get("userBD")) user = JSON.parse(cookies.get("userBD"));
    return user?.isSubscriber || false;
  }, []);

  const handleCheckboxChange = useCallback((columnSlug) => {
    if (isChecked(columnSlug)) {
      onChangeCheckedColumns(checkedColumns.filter(slug => slug !== columnSlug));
    } else {
      onChangeCheckedColumns([...checkedColumns, columnSlug]);
    }
  }, [isChecked, checkedColumns, onChangeCheckedColumns]);

  const handleMasterCheckboxChange = useCallback(() => {
    if(checkedColumns.length > 0) return onChangeCheckedColumns([]);
    const allColumnSlugs = resource.map(column => column.name);

    if (checkedColumns.length === allColumnSlugs.length) {
      onChangeCheckedColumns([]);
    } else {
      onChangeCheckedColumns(allColumnSlugs);
    }
  }, [checkedColumns, resource, onChangeCheckedColumns]);

  const headers = useMemo(() => [
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
  ], [t, template]);

  const fetchColumns = async () => {
    if(tableId === undefined) return;

    setHasLoading(true);
    setIsSearchLoading(true);

    try {
      const url = `/api/tables/getTableColumns?id=${tableId}&locale=${locale}`;
      const response = await fetch(url, { method: "GET" });
      const result = await response.json();

      if(result.success) {
        const sortedResource = result.resource.sort(sortElements);
        setResource(sortedResource);
        numberColumns(result.resource.length);
        setColumns(sortedResource);
        setHasLoading(false);
        setIsSearchLoading(false);
        setIsError(false);
      } else {
        console.error(result.error);
        setIsError(true);
      }
    } catch (error) {
      console.error(error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchColumns();
  }, [tableId, locale]);

  useEffect(() => {
    setIsLoading(hasLoading);
  }, [hasLoading]);

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

      triggerGAEventWithData("download_table", {
        gcp_path: `${cloudTables?.gcpProjectId+"."+cloudTables?.gcpDatasetId+"."+cloudTables?.gcpTableId}`,
        file_size: `${formatBytes(result?.uncompressedFileSize) || ""}`,
        dataset_id: `${query.dataset}`,
        dataset_name: `${result?.dataset?.name}`,
        table_id: `${result?._id}`,
        table_name: `${result?.name}`,
        column_download: true
      })

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
    const downloadInfo = HasDownloadPermitted(value?.table?.uncompressed_file_size)
    const cloudValues = value?.table?.cloud_table

    const gcpProjectID = cloudValues?.gcp_project_id || ""
    const gcpDatasetID = cloudValues?.gcp_dataset_id || ""
    const gcpTableId = cloudValues?.gcp_table_id || ""

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
              href={value?.table?.is_closed || !downloadInfo.downloadPermitted
                ? `${process.env.NEXT_PUBLIC_BASE_URL_FRONTEND}/dataset/${value?.table?.dataset?._id}?table=${value?.table?._id}`
                : `/api/tables/downloadTable?p=${btoa(gcpDatasetID)}&q=${btoa(gcpTableId)}&d=${btoa(downloadInfo.downloadPermitted)}&s=${btoa(downloadInfo.downloadWarning)}`
              }
              display="flex"
              onClick={() => {
                if(!downloadInfo.downloadPermitted) return
                triggerGAEventWithData("download_table", {
                  gcp_path: `${gcpProjectID + "." + gcpDatasetID + "." + gcpTableId}`,
                  file_size: `${formatBytes(value?.table?.uncompressed_file_size) || ""}`,
                  dataset_id: `${value?.table?.dataset?.id}`,
                  dataset_name: `${value?.table?.dataset?.name}`,
                  table_id: `${value?.table?.id}`,
                  table_name: `${value?.table?.name}`,
                  column_download: true
                })
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
              {value?.table?.is_closed || !downloadInfo.downloadPermitted
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

  function TranslationColumnException({ value }) {
    const cloudValues = value?.directory_primary_key?.table?.cloud_table
    const gcpDatasetID = cloudValues?.gcp_dataset_id || ""
    const gcpTableId = cloudValues?.gcp_table_id || ""

    if(gcpDatasetID === "br_bd_diretorios_data_tempo") return t('column.no')
    if(gcpDatasetID === "br_bd_diretorios_brasil") {
      if(gcpTableId === "empresa" || gcpTableId === "cep") return t('column.no')
    }
    if(value?.name === "ddd") return t('column.no')
    if(value?.covered_by_dictionary === true) return t('column.yes')
    if(value?.directory_primary_key?.id) return t('column.yes')
    if(value?.covered_by_dictionary === false) return t('column.no')
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
          maxHeight="50vh"
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
                          isChecked={isChecked(elm[`name${capitalize(locale)}`] || elm.name)}
                          onChange={() => handleCheckboxChange(elm[`name${capitalize(locale)}`] || elm.name)}
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
                    {elm?.namePt || elm?.name || elm?.[`name${capitalize(locale)}`] || t('column.notProvided')}
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
                        value={elm?.directory_primary_key}
                        dictionary={elm?.covered_by_dictionary}
                      />
                    :
                      <TranslationColumnException value={elm}/>
                    }
                  </TableValue>

                  <TableValue>
                    {elm?.[`description${capitalize(locale)}`] || elm?.description || t('column.notProvided')}
                  </TableValue>

                  <TableValue>
                    {elm?.bigquery_type?.name ? elm.bigquery_type.name : t('column.notProvided')}
                  </TableValue>

                  <TableValue>
                    {elm?.temporal_coverage?.start && elm?.temporal_coverage?.end ?
                      elm.temporal_coverage.start +" - "+ elm.temporal_coverage.end
                      :
                      t('column.notProvided')
                    }
                  </TableValue>

                  <TableValue>
                    {elm?.measurement_unit ?
                      measurementUnit(elm.measurement_unit)
                      :
                      t('column.notProvided')
                    }
                  </TableValue>

                  <TableValue>
                    {
                      elm?.contains_sensitive_data === true ? t('column.yes')
                      :
                      elm?.contains_sensitive_data === false ? t('column.no')
                      :
                      t('column.notProvided')
                    }
                  </TableValue>

                  <TableValue>
                    {elm?.[`observations${capitalize(locale)}`] || elm?.observations || t('column.notProvided')}
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
