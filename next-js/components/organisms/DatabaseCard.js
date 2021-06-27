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
}) {
  const databaseInfo = [];

  if (tableNum) databaseInfo.push(tableNum);
  if (externalLinkNum) databaseInfo.push(externalLinkNum + " link externo");

  return (
    <Card
      icons={categories.map((c) => (
        <CategoryIcon url={`/new-next-site/next-img/categories/${c}.png`} />
      ))}
      spacing={2}
    >
      <Title>{name}</Title>
      <Subtitle>{organization}</Subtitle>
      <HStack padding="15px 0px">
        {tags.map((t) => (
          <Tag>{t}</Tag>
        ))}
      </HStack>
      <HStack padding="15px 0px">
        {size ? (
          <>
            <Subtitle fontWeight="bold">{size}</Subtitle>
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
        Atualizado há {updatedSince} por {updatedAuthor}
      </Subtitle>
    </Card>
  );
}
