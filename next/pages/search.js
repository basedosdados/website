import {
  Input,
  VStack,
  Heading,
  HStack,
  Text,
  Divider,
  Link,
  Image,
  InputGroup,
  InputRightElement,
  Stack,
} from "@chakra-ui/react";
import SiteHead from "../components/atoms/SiteHead";
import Footer from "../components/molecules/Footer";
import Menu from "../components/molecules/Menu";
import { useRouter } from "next/router";
import { Dot } from "../components/atoms/Dot";
import Subtitle from "../components/atoms/Subtitle";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CategoryIcon } from "../components/atoms/CategoryIcon";
import { FilterPopover } from "../components/molecules/FilterPopover";

function Database({
  image,
  name,
  children,
  updatedSince,
  updatedAuthor,
  size,
  tableNum,
  externalLinkNum,
  stars,
  isPlus = false,
}) {
  const databaseInfo = [];

  if (tableNum) databaseInfo.push(tableNum);
  if (externalLinkNum) databaseInfo.push(externalLinkNum + " link externo");

  return (
    <Stack
      direction={{ base: "column-reverse", md: "row" }}
      paddingTop={{ base: "0px", md: "0px" }}
      paddingBottom={{ base: "50px", md: "0px" }}
      justifyContent="space-between"
      width="100%"
      spacing={{ base: 5, md: 0 }}
    >
      <HStack spacing={10}>
        <Image
          width="91px"
          height="91px"
          borderRadius="10.1111px"
          filter="drop-shadow(0px 2.02222px 2.02222px rgba(0, 0, 0, 0.25));"
          src={image}
          backgroundColor="#eee"
        />
        <VStack
          alignItems="flex-start"
          justifyContent="space-between"
          spacing={1}
          height="91px"
        >
          <VStack alignItems="flex-start">
            <HStack>
              <Heading
                fontWeight="700"
                fontFamily="Lato"
                fontSize="21px"
                letterSpacing="0.05em"
                color="#252A32"
              >
                {name}
              </Heading>
              <HStack
                borderRadius="10.5233px"
                border="0.743243px solid #6F6F6F"
                padding="2px 7px"
                alignItems="center"
                spacing={1}
              >
                <FontAwesomeIcon style={{ width: "10px" }} icon={faStar} />
                <Heading fontFamily="Lato" fontSize="15px">
                  {stars}
                </Heading>
              </HStack>
            </HStack>
            <Text color="#6F6F6F" fontSize="14px">
              Atualizado há {updatedSince} por {updatedAuthor}
            </Text>
          </VStack>
          <HStack>
            {size ? (
              <>
                <Subtitle fontSize="14px" fontWeight="bold">
                  {size}
                </Subtitle>
                <Dot />
              </>
            ) : (
              <></>
            )}
            {databaseInfo.map((item, index) => (
              <>
                <Subtitle fontSize="14px">{item}</Subtitle>{" "}
                {index !== databaseInfo.length - 1 ? <Dot /> : <></>}{" "}
              </>
            ))}
          </HStack>
        </VStack>
      </HStack>
      <HStack spacing={5}>
        {isPlus ? (
          <Image width="80px" src="/_nxt/img/logo_plus.png" />
        ) : (
          <></>
        )}
        <CategoryIcon url="/_nxt/img/categories/agro.png" />
      </HStack>
    </Stack>
  );
}

function OrderingLink({ orderBy, label }) {
  const { query } = useRouter();
  const searchQuery = query.q || "";
  const orderQuery = query.order_by || "";

  return (
    <Link
      fontWeight={orderQuery == orderBy ? "700" : "300"}
      href={`?order_by=${orderBy}&q=${searchQuery}`}
    >
      <Text>{label}</Text>
    </Link>
  );
}

export default function SearchPage() {
  const { query } = useRouter();
  const searchQuery = query.q || "";

  return (
    <VStack width="100%">
      <SiteHead />
      <Menu />
      <VStack
        alignItems="flex-start"
        padding="0px 5%"
        paddingTop="120px"
        spacing={5}
        width="100%"
      >
        <InputGroup>
          <Input
            placeholder="Pesquise palavras-chave, instituições ou temas"
            padding="25px 0px 25px 20px"
            fontSize="18px"
            fontFamily="Lato"
            letterSpacing="0.1em"
          />
          <FilterPopover />
        </InputGroup>
        <Heading
          fontFamily="Lato"
          fontSize="30px"
          fontWeight="normal"
          letterSpacing="0.1em"
        >
          133 conjuntos de dados encontrados {searchQuery ? " para " + searchQuery : ""}
        </Heading>
        <HStack
          fontFamily="Lato"
          letterSpacing="0.1em"
          fontWeight="100"
          fontSize="16px"
          color="#6F6F6F"
        >
          <Stack direction={{ base: "column", md: "row" }}>
            <Text>Ordenar por:</Text>
            <HStack>
              <OrderingLink label="Mais relevante" orderBy="relevant" />
              <Text>|</Text>
              <OrderingLink label="Mais recente" orderBy="recent" />
              <Text>|</Text>
              <OrderingLink
                label="Última atualização"
                orderBy="recent_update"
              />
            </HStack>
          </Stack>
        </HStack>
        <VStack
          width="100%"
          alignItems="flex-start"
          spacing={10}
          padding="60px 0px"
        >
          <Database
            name="Eleições brasileiras"
            organization="Tribunal Superior Eleitoral"
            tags={["Política", "Finanças públicas"]}
            size="2 GB"
            tableNum="13 tabelas (CSV)"
            externalLinkNum={1}
            updatedSince="13 dias"
            updatedAuthor="Ricardo Dahis"
            categories={["agro"]}
            stars={15}
          />
          <Divider />
          <Database
            name="Eleições brasileiras"
            organization="Tribunal Superior Eleitoral"
            tags={["Política", "Finanças públicas"]}
            size="2 GB"
            tableNum="13 tabelas (CSV)"
            externalLinkNum={1}
            updatedSince="13 dias"
            updatedAuthor="Ricardo Dahis"
            categories={["agro"]}
            stars={15}
            isPlus
          />
        </VStack>
      </VStack>
      <Footer />
      <script
        src="/_nxt/vendor/terminal.js"
        data-termynal-container="#termynal"
      ></script>
    </VStack>
  );
}
