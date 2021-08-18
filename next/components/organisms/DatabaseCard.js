import { Card } from "../molecules/Card";
import DescriptionText from "../atoms/DescriptionText";
import { Box, Center, HStack, Image } from "@chakra-ui/react";
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

  if (tableNum) databaseInfo.push(`${tableNum} tabelas`);
  if (externalLinkNum) databaseInfo.push(externalLinkNum + " link externo");

  const date1 = new Date();
  const date2 = new Date(updatedSince);
  const diffTime = Math.abs(date2 - date1);
  let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  let diffLabel = "dia(s)";

  if (diffDays > 30) {
    diffLabel = "mês(es)";
    diffDays = Math.floor(diffDays / 30);
  } else if (diffDays > 365) {
    diffLabel = "ano(s)";
    diffDays = Math.floor(diffDays / 365);
  }

  return (
    <Card
      icons={[
        ...categories.slice(0, Math.min(3, categories.length)).map((c) => (
          <Link href={`/_nxt/search?group=${c}`}>
            <CategoryIcon
              size="47px"
              url={`/_nxt/img/categories/icone_${c}${isPlus ? "-1" : ""}.svg`}
            />
          </Link>
        )),
        ...(isPlus
          ? [
              <Image
                width="80px"
                height="37px"
                marginRight="10px"
                src={`/_nxt/img/logo_plus.png`}
              />,
            ]
          : []),
      ]}
      spacing={0}
    >
      <Link href={link}>
        <Title minHeight="60px" marginBottom="15px">
          {name}
        </Title>
      </Link>
      <Link href={`/_nxt/search?organization=${organizationSlug}`}>
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
      <HStack marginTop="auto">
        {size ? (
          <>
            <Subtitle color="#252A32" fontWeight="bold">
              {Math.round(size / 1000)} mb
            </Subtitle>
            <Dot />
          </>
        ) : (
          <></>
        )}
        {databaseInfo.map((item, index) => (
          <>
            <Subtitle color="#252A32">{item}</Subtitle>{" "}
            {index !== databaseInfo.length - 1 ? <Dot /> : <></>}{" "}
          </>
        ))}
      </HStack>
      <Subtitle marginTop="auto" fontSize="12px" fontStyle="italic">
        Atualizado há {diffDays} {diffLabel}.
      </Subtitle>
    </Card>
  );
}
