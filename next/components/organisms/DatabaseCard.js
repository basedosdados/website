import { Card } from "../molecules/Card";
import DescriptionText from "../atoms/DescriptionText";
import { Box, Center, HStack, Image } from "@chakra-ui/react";
import Title from "../atoms/Title";
import Subtitle from "../atoms/Subtitle";
import { Tag } from "../atoms/Tag";
import { CategoryIcon } from "../atoms/CategoryIcon";
import { Dot } from "../atoms/Dot";

export default function DatabaseCard({
  name,
  categories = [],
  organization,
  tags,
  size,
  tableNum,
  externalLinkNum,
  updatedSince,
  updatedAuthor,
  link,
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
      link={link}
      icons={categories.map((c) => (
        <CategoryIcon url={`/_nxt/img/categories/icone_${c}.svg`} />
      ))}
      spacing={0}
    >
      <Title marginBottom="15px">{name}</Title>
      <Subtitle>{organization}</Subtitle>
      <HStack width="100%" overflowX="scroll" paddingTop="15px">
        {tags.slice(0, tags.length > 3 ? 3 : tags.length).map((t) => (
          <Tag>{t}</Tag>
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
