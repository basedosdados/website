import { Card } from "../molecules/Card";
import { Image, VStack } from "@chakra-ui/react";
import Subtitle from "../atoms/Subtitle";
import Title from "../atoms/Title";

export default function NewsCard({ image, site, title }) {
  return (
    <Card padding="0px" tabColor="#65B540">
      <Image
        borderTopRightRadius="10px"
        borderTopLeftRadius="10px"
        boxSize="100%"
        src={image}
      />
      <VStack padding="40px" paddingTop="10px" alignItems="flex-start">
        <Subtitle>{site}</Subtitle>
        <Title>{title}</Title>
      </VStack>
      <Image
        width="25px"
        src="/_nxt/img/arrow_black_right.png"
        position="absolute"
        right="20px"
        bottom="20px"
      />
    </Card>
  );
}
