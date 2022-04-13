import { Card } from "../molecules/Card";
import { HStack, Image, VStack, Center, Text, Tooltip } from "@chakra-ui/react";
import Title from "../atoms/Title";
import Subtitle from "../atoms/Subtitle";
import { CategoryIcon } from "../atoms/CategoryIcon";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";
import Link from "../atoms/Link";
import { ThemeTag } from "../atoms/ThemeTag";
import BDLogoPlusImage from "../../public/img/logos/bd_logo_plus";

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
      fontSize="14px"
      color={tableNum === 0 ? "#C4C4C4" : "#42B0FF" }
    >
      <b>{tableNum} tabelas tratadas</b>
      <BDLogoPlusImage
        widthImage="38px"
        marginLeft="5px !important"
        empty={tableNum === 0}
      />
    </HStack>
  );

  if (externalLinkNum) databaseInfo.push(externalLinkNum + " fontes originais");
  if (informationRequestNum) databaseInfo.push(informationRequestNum + " pedidos LAI");

  return (
    <Card
      icons={[
        ...categories.slice(0, Math.min(3, categories.length)).map((c) => (
          <Tooltip
            label={c[1]}
            fontSize="16px"
            fontWeight="500"
            padding="5px 15px"
            backgroundColor="#2A2F38"
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
              <Link filter="invert(1)" _hover={{ opacity: "none" }} href={`/dataset?group=${c[0]}`}>
                <CategoryIcon
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
      <Link
        letterSpacing="1px"
        href={link}
      >
        <Title
          fontSize="16px"
          minHeight="45px"
          lineHeight="23px"
          textOverflow="ellipsis"
          marginBottom="10px"
          noOfLines={2}
        >
          {name}
        </Title>
      </Link>
      <Link href={`/dataset?organization=${organizationSlug}`}>
        <Subtitle
          noOfLines={2}
          lineHeight="18px"
          textOverflow="ellipsis"
          letterSpacing="0.5px"
          fontSize="12px"
        >{organization}</Subtitle>
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
          <Subtitle
            fontSize="12px"
            color="#252A32"
          >
            {databaseInfo[0]}
          </Subtitle>
          <HStack>
            <Subtitle
              fontSize="12px"
              color={databaseInfo[1] ? "#252A32" : "#C4C4C4"}
            >
              {databaseInfo[1] ? databaseInfo[1] : "0 fontes originais"}
            </Subtitle>
            <Text color="#DEDFE0">•</Text>
            <Subtitle
              fontSize="12px"
              color={databaseInfo[2] ? "#252A32" : "#C4C4C4"}
            >
              {databaseInfo[2] ? databaseInfo[2] : "0 pedidos LAI"}
            </Subtitle>
          </HStack>
      </VStack>
    </Card>
  );
}
