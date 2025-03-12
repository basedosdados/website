import {
  Stack,
  Box,
  Text,
  Image,
  Tooltip,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { isMobileMod } from "../../hooks/useCheckMobile.hook";
import Button from "../../components/atoms/Button";

export default function Accesses ({ userInfo }) {
  return (
    <Stack spacing="24px">
      <Stack alignItems="end">
        <Tooltip
          hasArrow
          top="-10px"
          placement="top"
          bg="#2A2F38"
          label={t('username.onlyAvailableInBDEnterprises')}
          fontSize="14px"
          fontWeight="400"
          fontFamily="Roboto"
          padding="5px 16px 6px"
          letterSpacing="0.5px"
          lineHeight="24px"
          color="#FFF"
          borderRadius="6px"
        >
          <Box width={isMobileMod() ? "100%" : "fit-content"}>
            <Button
              width={isMobileMod() ? "100%" : "fit-content"}
              cursor="default"
            >{t('username.addUser')}</Button>
          </Box>
        </Tooltip>
      </Stack>

      <Grid templateColumns={isMobileMod() ? "1fr 1fr" : "3fr 1fr"}>
        <GridItem>
          <Text
            backgroundColor="#F6F6F6"
            padding={isMobileMod() ? "8px 0 8px 16px" : "8px 24px"}
            color="#6F6F6F"
            fontFamily="Ubuntu"
            fontSize="16px"
            fontWeight="400"
            lineHeight="16px"
            letterSpacing="0.2px"
          >{t('username.user')}</Text>
        </GridItem>
        <GridItem>
          <Text
            backgroundColor="#F6F6F6"
            padding={isMobileMod() ? "8px 16px" : "8px 24px"}
            color="#6F6F6F"
            fontFamily="Ubuntu"
            fontSize="16px"
            fontWeight="400"
            lineHeight="16px"
            letterSpacing="0.2px"
            width="100%"
          >{t('username.access')}</Text>
        </GridItem>

        <GridItem
          overflow="hidden"
          padding={isMobileMod() ? "24px 0" : "24px"}
          borderBottom="1px solid #DEDFE0"
        >
          <Stack
            width="100%"
            position="relative"
            overflow="hidden"
            flexDir="column"
            spacing={0}
            paddingLeft={isMobileMod() ? "16px" : "0"}
            flexDirection="row"
            alignItems={isMobileMod() ? "stretch" : "stretch"}
            height="54px"
          >
            <Box
              position="absolute"
              width="36px"
              minWidth="36px"
              height="36px"
              minHeight="36px"
              borderRadius="50%"
              overflow="hidden"
              top="9px"
            >
              <Image width="100%" height="100%" src={userInfo?.picture ? userInfo?.picture :"https://storage.googleapis.com/basedosdados-website/equipe/sem_foto.png"}/>
            </Box>
            <Text
              marginLeft={isMobileMod() ? "44px !important" : "60px !important"}
              color="#252A32"
              fontFamily="Ubuntu"
              fontSize="14px"
              fontWeight="400"
              lineHeight="27px"
              letterSpacing="0.3px"
              height="27px"
              isTruncated
            >{userInfo?.username}</Text>
            <Text
              marginLeft={isMobileMod() ? "44px !important" : "60px !important"}
              color="#6F6F6F"
              fontFamily="Ubuntu"
              fontSize="14px"
              fontWeight="400"
              lineHeight="27px"
              letterSpacing="0.3px"
              height="27px"
              isTruncated
            >{userInfo?.email}</Text>
          </Stack>
        </GridItem>

        <GridItem
          display="flex"
          alignItems="center"
          width="100%"
          padding={isMobileMod() ? "24px 16px" : "24px"}
          borderBottom="1px solid #DEDFE0"
        >
          <Text
            color="#6F6F6F"
            fontFamily="Ubuntu"
            fontSize="14px"
            fontWeight="400"
            lineHeight="27px"
            letterSpacing="0.3px"
          >
            {t('username.administrator')}
          </Text>
        </GridItem>
      </Grid>
    </Stack>
  )
}