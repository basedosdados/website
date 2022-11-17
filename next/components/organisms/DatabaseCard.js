import {
  HStack,
  VStack,
  Center,
  Text,
  Tooltip
} from "@chakra-ui/react";
import { Card } from "../molecules/Card";
import { CategoryIcon } from "../atoms/CategoryIcon";
import Link from "../atoms/Link";
import { ThemeTag } from "../atoms/ThemeTag";
import BDLogoPlusImage from "../../public/img/logos/bd_logo_plus";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";

export default function DatabaseCard({
  name,
  categories = [{}],
  organization,
  organizationSlug,
  tags,
  size,
  tableNum,
  externalLinkNum,
  informationRequestNum,
  updatedSince,
  updatedAuthor,
  link,
  isPlus = false,
}) {
  const isMobile = useCheckMobile();
  const databaseInfo = [];
  let sizeLabel;

  if (size) {
    if (size < 1000000) sizeLabel = Math.round(size / 1024) + " kb";
    else if (size >= 1000000)
      sizeLabel = Math.round(size / (1024 * 1024)) + " mb";
    else sizeLabel = Math.round(size / (1024 * 1024 * 1024)) + " gb";
  }

  databaseInfo.push(
    <HStack
      whiteSpace="nowrap"
      fontFamily="Ubuntu"
      fontSize="14px"
      letterSpacing="0.3px"
      color={tableNum === 0 ? "#C4C4C4" : "#42B0FF" }
      cursor="pointer"
      onClick={() => {
        if(tableNum > 1) window.open(`${link}?bdm_table`)
      }}
      _hover={tableNum > 1 && {opacity : "0.7"}}
    >
      <b>{tableNum === 1 ? tableNum + " tabela tratada" : tableNum + " tabelas tratadas"}</b>
      <BDLogoPlusImage
        widthImage="38px"
        marginLeft="5px !important"
        empty={tableNum === 0}
      />
    </HStack>
  );

  if (externalLinkNum) {
    databaseInfo.push(
      externalLinkNum === 1 ? externalLinkNum + " fonte original" : externalLinkNum + " fontes originais"
    )
  }
  if (informationRequestNum) {
    databaseInfo.push(
      informationRequestNum === 1 ? informationRequestNum + " pedido LAI" : informationRequestNum + " pedidos LAI"
    )
  }

  return (
    <Card
      icons={[
        ...categories.slice(0, Math.min(3, categories.length)).map((c) => (
          <Tooltip
            hasArrow
            bg="#2A2F38"
            label={c[1]}
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
              <Link overflow="hidden" filter="invert(1)" _hover={{ opacity: "none" }} href={`/dataset?group=${c[0]}`}>
                <CategoryIcon
                  alt={c[0]}
                  size="37px"
                  padding="4px"
                  url={`https://basedosdados-static.s3.us-east-2.amazonaws.com/category_icons/2022/icone_${c[0]}.svg`}
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
      <Link href={`/dataset?organization=${organizationSlug}`}>
        <Text
          noOfLines={2}
          lineHeight="16px"
          textOverflow="ellipsis"
          letterSpacing="0.3px"
          fontFamily="Ubuntu"
          fontSize="12px"
          fontWeight="400"
          color="#6F6F6F"
        >{organization}</Text>
      </Link>

      <VStack spacing={1} align="flex-start" marginTop="auto">
        <HStack
          width="100%"
          overflowX="auto"
          className="no-scrollbar"
          margin="0 0 20px"
        >
          {tags.slice(0, tags.length > isMobile ? 2 : 3 ? isMobile ? 2 : 3 : tags.length).map((t) => (
            <ThemeTag name={t} />
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
            <Text
              fontFamily="Ubuntu"
              fontSize="12px"
              fontWeight="400"
              letterSpacing="0.3px"
              color={databaseInfo[1] ? "#252A32" : "#C4C4C4"}
              cursor={databaseInfo[1] && "pointer"}
              _hover={databaseInfo[1] && {opacity : "0.7"}}
              onClick={() => {
                  if(databaseInfo[1]) window.open(`${link}?external_link`)
                }
              }
            >
              {databaseInfo[1] ? databaseInfo[1] : "0 fontes originais"}
            </Text>
            <Text color="#DEDFE0">•</Text>
              <Text
                fontFamily="Ubuntu"
                fontSize="12px"
                fontWeight="400"
                letterSpacing="0.3px"
                color={databaseInfo[2] ? "#252A32" : "#C4C4C4"}
                cursor={databaseInfo[2] && "pointer"}
                _hover={databaseInfo[2] && {opacity : "0.7"}}
                onClick={() => {
                  if(databaseInfo[2]) window.open(`${link}?information_request`)}
                }
              >
                {databaseInfo[2] ? databaseInfo[2] : "0 pedidos LAI"}
              </Text>
          </HStack>
      </VStack>
    </Card>
  );
}
