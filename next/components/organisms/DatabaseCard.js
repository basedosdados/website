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
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (
    <Card
      link={link}
      icons={categories.map((c) => (
        <CategoryIcon url={`/_nxt/img/categories/icone_${c}.svg`} />
      ))}
      spacing={2}
    >
      <Title>{name}</Title>
      <Subtitle>{organization}</Subtitle>
      <HStack width="100%" overflowX="scroll" padding="15px 0px">
        {tags.map((t) => (
          <Tag>{t}</Tag>
        ))}
      </HStack>
      <HStack marginTop="auto" padding="15px 0px">
        {size ? (
          <>
            <Subtitle fontWeight="bold">{Math.round(size / 1000)} mb</Subtitle>
            <Dot />
          </>
        ) : (
          <></>
        )}
        {databaseInfo.map((item, index) => (
          <>
            <Subtitle>{item}</Subtitle>{" "}
            {index !== databaseInfo.length - 1 ? <Dot /> : <></>}{" "}
          </>
        ))}
      </HStack>
      <Subtitle fontSize="12px" fontStyle="italic">
        Atualizado há {diffDays} dias.
      </Subtitle>
    </Card>
  );
}
