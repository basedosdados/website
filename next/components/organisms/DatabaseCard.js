import { Card } from "../molecules/Card";
import DescriptionText from "../atoms/DescriptionText";
import { Box, Center, HStack, Image, VStack } from "@chakra-ui/react";
import Title from "../atoms/Title";
import Subtitle from "../atoms/Subtitle";
import { Tag } from "../atoms/Tag";
import { CategoryIcon } from "../atoms/CategoryIcon";
import { Dot } from "../atoms/Dot";
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
  const databaseInfo = [];

  let sizeLabel;

  if (size) {
    if (size < 1000000) sizeLabel = Math.round(size / 1024) + " kb";
    else if (size >= 1000000)
      sizeLabel = Math.round(size / (1024 * 1024)) + " mb";
    else sizeLabel = Math.round(size / (1024 * 1024 * 1024)) + " gb";
  }

  databaseInfo.push(
    <HStack whiteSpace="nowrap">
      <b>{tableNum} tabelas tratadas </b>
      <Image
        height="15px"
        src={
          tableNum === 0 ? `/img/logos/bd_plus_cinza.png` : `/img/logo_plus.png`
        }
      />
    </HStack>
  );

  if (externalLinkNum) databaseInfo.push(externalLinkNum + " links externos");

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
      <Link href={link}>
        <Title fontSize="16px" minHeight="60px" marginBottom="15px">
          {name}
        </Title>
      </Link>
      <Link href={`/dataset?organization=${organizationSlug}`}>
        <Subtitle>{organization}</Subtitle>
      </Link>
      <HStack
        width="100%"
        overflowX="auto"
        className="no-scrollbar"
        paddingTop="15px"
      >
        {tags.slice(0, tags.length > 3 ? 3 : tags.length).map((t) => (
          <ThemeTag name={t} />
        ))}
      </HStack>
      <VStack spacing={1} align="flex-start" marginTop="auto">
        {databaseInfo.map((item, index) => (
          <>
            <Subtitle color="#252A32">{item}</Subtitle>
          </>
        ))}
      </VStack>
    </Card>
  );
}
