import {
  HStack,
  VStack,
  Center,
  Text,
  Tooltip,
  Stack
} from "@chakra-ui/react";
import { Card } from "../molecules/Card";
import { CategoryIcon } from "../atoms/CategoryIcon";
import Link from "../atoms/Link";
import { ThemeTag } from "../atoms/ThemeTag";
import BDLogoPlusImage from "../../public/img/logos/bd_logo_plus";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";
import BDLogoProImage from "../../public/img/logos/bd_logo_pro";

export default function DatabaseCard({
  name,
  categories = [],
  organization,
  tags = [],
  tables,
  tablesClosed,
  rawDataSources,
  informationRequests,
  link,
}) {
  const isMobile = useCheckMobile();
  const databaseInfo = [];

  databaseInfo.push(
    <HStack
      flexDirection="column"
      alignItems="flex-start"
      whiteSpace="nowrap"
      fontFamily="Ubuntu"
      fontSize="14px"
      letterSpacing="0.3px"
      spacing={2}
    >
      {tablesClosed.number > 0 &&
        <Stack
          margin="0 !important"
          cursor={tablesClosed?.number > 0 ? "pointer" : "default"}
          _hover={tablesClosed?.number === undefined ||tablesClosed?.number > 0 && {opacity : "0.7"}}
          color={tablesClosed?.number === undefined || tablesClosed?.number === 0? "#C4C4C4" : "#8A7500" }
        >
          <a
            
            href={tablesClosed.number > 0 && `${link}?table=${tablesClosed.id}`}
            target="_blank"
            style={{display: "flex"}}
          >
            <b>{tablesClosed.number === 1 ?
              "1 tabela tratada"
            : 
              `${tablesClosed?.number || 0} tabelas tratadas`
            }</b>
            <BDLogoProImage
              widthImage="50px"
              marginLeft="5px !important"
              empty={tablesClosed.number === 0}
            />
          </a>
        </Stack>
      }

      {tablesClosed.number < 0 ? <></> :
        <Stack
          margin="0 !important"
          cursor={tables?.number > 0 ? "pointer" : "default"}
          _hover={tables?.number === undefined ||tables?.number > 0 && {opacity : "0.7"}}
          color={tables?.number === undefined || tables?.number === 0? "#C4C4C4" : "#42B0FF"}
        >
          <a
            href={tables?.number > 0 && `${link}?table=${tables?.id}`}
            target="_blank"
            style={{display: "flex"}}
          >
            <b>{tables?.number === 1 ?
              "1 tabela tratada"
            : 
              `${tables?.number || 0} tabelas tratadas`
            }</b>
            <BDLogoPlusImage
              widthImage="38px"
              marginLeft="5px !important"
              empty={tables?.number === 0}
            />
          </a>
        </Stack>
      }
    </HStack>
  )

  if (rawDataSources.number > 0) {
    databaseInfo.push(
      rawDataSources.number === 1 ?
      "1 fonte original" :
      `${rawDataSources.number} fontes originais`
    )
  }
  if (informationRequests.number > 0) {
    databaseInfo.push(
      informationRequests.number === 1 ?
      "1 pedido LAI" :
      `${informationRequests.number} pedidos LAI`
    )
  }

  return (
    <Card
      icons={categories.length !== 0 && [
        ...categories.slice(0,6).map((c) => (
          <Tooltip
            hasArrow
            bg="#2A2F38"
            label={c.name}
            fontSize="16px"
            fontWeight="500"
            padding="5px 16px 6px"
            marginTop="10px"
            color="#FFF"
            borderRadius="6px"
          >
            <Center
              width="30px"
              height="30px"
              backgroundColor="#2B8C4D"
              borderRadius="6px"
            >
              <Link
                overflow="hidden"
                filter="invert(1)"
                _hover={{ opacity: "none" }}
                href={`/dataset?group=${c.slug}`}
                target="_blank"
              >
                <CategoryIcon
                  alt={c.name}
                  size="37px"
                  padding="4px"
                  url={`https://basedosdados-static.s3.us-east-2.amazonaws.com/category_icons/2022/icone_${c.slug}.svg`}
                />
              </Link>
            </Center>
          </Tooltip>
        )),
      ]}
      spacing={0}
    >
      <Link href={link}>
        <Text
          fontFamily="Ubuntu"
          fontSize="16px"
          fontWeight="700"
          letterSpacing="0.3px"
          color="#252A32"
          minHeight="40px"
          lineHeight="20px"
          textOverflow="ellipsis"
          marginBottom="10px"
          noOfLines={2}
        >
          {name}
        </Text>
      </Link>
      <Link href={`/dataset?organization=${organization.slug}`}>
        <Text
          noOfLines={2}
          lineHeight="16px"
          textOverflow="ellipsis"
          letterSpacing="0.3px"
          fontFamily="Ubuntu"
          fontSize="12px"
          fontWeight="400"
          color="#6F6F6F"
        >{organization.name}</Text>
      </Link>

      <VStack spacing={1} align="flex-start" marginTop="auto">
        <HStack
          width="100%"
          overflowX="auto"
          className="no-scrollbar"
          margin="8px 0 20px"
        >
          {tags.length !== 0 && tags.slice(0,3).map((t) => (
            <ThemeTag name={t.name}/>
          ))}
        </HStack>

        <Text
          fontFamily="Ubuntu"
          fontSize="12px"
          fontWeight="400"
          letterSpacing="0.3px"
          color="#252A32"
        >
          {databaseInfo[0]}
        </Text>

        <HStack>
          <a
            href={rawDataSources.length > 0 && `${link}?raw_data_source=${rawDataSources.id}`}
            target="_blank"
          >
            <Text
              fontFamily="Ubuntu"
              fontSize="12px"
              fontWeight="400"
              letterSpacing="0.3px"
              color={databaseInfo[1] ? "#252A32" : "#C4C4C4"}
              cursor={databaseInfo[1] && "pointer"}
              _hover={databaseInfo[1] && {opacity : "0.7"}}
            >
              {databaseInfo[1] ? databaseInfo[1] : "0 fontes originais"}
            </Text>
          </a>
          <Text color="#DEDFE0">•</Text>
          <a
            href={informationRequests.length > 0 && `${link}?information_request=${informationRequests.id}`}
            target="_blank"
          >
            <Text
              fontFamily="Ubuntu"
              fontSize="12px"
              fontWeight="400"
              letterSpacing="0.3px"
              color={databaseInfo[2] ? "#252A32" : "#C4C4C4"}
              cursor={databaseInfo[2] && "pointer"}
              _hover={databaseInfo[2] && {opacity : "0.7"}}
            >
              {databaseInfo[2] ? databaseInfo[2] : "0 pedidos LAI"}
            </Text>
          </a>
        </HStack>
      </VStack>
    </Card>
  );
}
