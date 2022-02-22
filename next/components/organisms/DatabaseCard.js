import { Card } from "../molecules/Card";
import { HStack, Image, VStack } from "@chakra-ui/react";
import Title from "../atoms/Title";
import Subtitle from "../atoms/Subtitle";
import { CategoryIcon } from "../atoms/CategoryIcon";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";
import Link from "../atoms/Link";
import { ThemeTag } from "../atoms/ThemeTag";

export default function DatabaseCard({
  name,
  categories = [],
  organization,
  organizationSlug,
  tags,
  size,
  tableNum,
  externalLinkNum,
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
      fontSize={isMobile ? "10px" : "14px"}
      color={tableNum === 0 ? "#C4C4C4" : "#42B0FF" }
    >
      <b>{tableNum} tabelas tratadas </b>
      <Image
        height="15px"
        src={
          tableNum === 0 ? `/img/logos/bd_plus_cinza.png` : `/img/logo_plus.png`
        }
      />
    </HStack>
  );

  if (externalLinkNum) databaseInfo.push(externalLinkNum + " fontes originais");

  return (
    <Card
      icons={[
        ...categories.slice(0, Math.min(3, categories.length)).map((c) => (
          <Link href={`/dataset?group=${c}`}>
            <CategoryIcon
              size="37px"
              url={`https://basedosdados-static.s3.us-east-2.amazonaws.com/category_icons/icone_${c}${
                isPlus ? "-1" : ""
              }.svg`}
            />
          </Link>
        )),
      ]}
      spacing={0}
    >
      <Link 
        letterSpacing="1px"
        href={link}
      >
        <Title 
          fontSize={isMobile ? "14px" : "16px"}
          lineHeight={isMobile ? "15px" : "23px"}
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
          lineHeight={isMobile ? "12px" : "18px"}
          textOverflow="ellipsis"
          letterSpacing="1px"
          fontSize={isMobile ? "10px" : "12px"}
        >{organization}</Subtitle>
      </Link>
      <VStack spacing={1} align="flex-start" marginTop="auto">
        <HStack
          width="100%"
          overflowX="auto"
          className="no-scrollbar"
          margin={isMobile ? "5px 0 0 0" : "0 0 25px"}
        >
          {tags.slice(0, tags.length > isMobile ? 2 : 3 ? isMobile ? 2 : 3 : tags.length).map((t) => (
            <ThemeTag name={t} />
          ))}
        </HStack>
        {databaseInfo.map((item, index) => (
          <Subtitle 
            fontSize={isMobile ? "10px" : "12px"}
            color="#252A32"
          >
            {item}
          </Subtitle>
        ))}
      </VStack>
    </Card>
  );
}
