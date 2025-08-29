import {
  Stack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useTranslation } from 'next-i18next';
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import Display from "../../atoms/Text/Display";
import LabelText from "../../atoms/Text/LabelText";

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 GB';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['By', 'KB', 'MB', 'GB', 'T', 'PB', 'EB', 'ZB', 'YB'];
  const gbIndex = 2;

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  if (i < gbIndex) {                            
    return (bytes / Math.pow(k, gbIndex)).toFixed(dm) + ' GB';
  }                                             
  return parseFloat((bytes / Math. pow(k, i)).toFixed(dm)) + sizes[i];                                         
}

export default function TablesStats() {
  const { t } = useTranslation("home");
  const [data, setData] = useState({});
  const { ref, inView } = useInView({ triggerOnce: true });

  function formatNumber(num) {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + " " + t("tables_stats.number_formats.billion");
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, "") + " " + t("tables_stats.number_formats.million");
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + " " + t("tables_stats.number_formats.thousand");
    }
    return num;
  }

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("api/tables/getTablesStats", { method: "GET" });
      const result = await response.json();

      if(result) setData(result.result)
    }

    fetchData()
  }, [])

  return (
    <Stack
      ref={ref}
      width="100%"
      border="1px solid #DEDFE0"
      justifyContent="center"
      spacing={0}
      margin="40px auto 0"
    >
      <Stack
        width="100%"
        maxWidth="1440px"
        flexDirection={{base: "column", md: "row"}}
        margin="0 auto"
        spacing={0}
      >
        <Stack
          flex={1}
          padding={{base: "40px 24px", md: "40px 120px"}}
          gap="16px"
          alignItems="center"
          spacing={0}
        >
          <Display typography="small">
            <CountUp
              start={inView ? 0 : undefined}
              end={data?.total_size_bytes || 0}
              duration={4}
              formattingFn={(value) => formatBytes(value, 0)}
            /> {t("tables_stats.size_all_tables")}
          </Display>
          <LabelText
            typography="x-large"
            color="#464A51"
            fontWeight="400"
          >
            <CountUp
              start={inView ? 0 : undefined}
              end={data?.total_rows || 0}
              duration={4}
              formattingFn={(value) => formatNumber(value)}
            /> {t("tables_stats.row_all_tables")}
          </LabelText>
        </Stack>
        <Stack
          flex={1}
          padding={{base: "40px 24px", md: "40px 120px"}}
          gap="16px"
          alignItems="center"
          spacing={0}
          borderLeft={"1px solid #DEDFE0"}
          borderLeftWidth={{base: "0", md: "1px"}}
          borderTopWidth={{base: "1px", md:"0"}}
        >
          <Display typography="small">
            <CountUp
              start={inView ? 0 : undefined}
              end={data?.total_treated_tables || 0}
              duration={4}
              separator="."
            /> {t("tables_stats.tables")}
          </Display>
          <LabelText
            typography="x-large"
            color="#464A51"
            fontWeight="400"
          >
            <CountUp
              start={inView ? 0 : undefined}
              end={data?.updated_last_30_days || 0}
              duration={4}
            /> {t("tables_stats.tables_updates")}
          </LabelText>
        </Stack>
      </Stack>
    </Stack>
  )
}