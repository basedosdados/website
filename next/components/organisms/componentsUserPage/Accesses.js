import {
  Stack,
  Box,
  Image,
  Grid,
  GridItem,
  Spinner,
  Tooltip,
  useDisclosure,
  ModalCloseButton
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import BodyText from "../../atoms/Text/BodyText";
import TitleText from "../../atoms/Text/TitleText";
import Button from "../../atoms/Button";

import {
  ModalGeneral
} from "../../molecules/uiUserPage";

import TrashIcon from "../../../public/img/icons/trashIcon";

export default function Accesses ({ userInfo }) {
  const { t } = useTranslation('user');
  const [data, setData] = useState(null)
  const AddMemberModal = useDisclosure()
  const RemoveMemberModal = useDisclosure()
  const [valueEmail, setValueEmail] = useState("chandra2807@uorak.com")
  const [isLoading, setIsLoading] = useState(true)
  const [owner, setOwner] = useState(null)
  const [subscriptionMembers, setSubscriptionMembers] = useState([])

  const reg = new RegExp("(?<=:).*")
  const [ id ] = reg.exec(userInfo?.id)

  async function getMembers() {
    const res = await fetch(`/api/user/getMembers?p=${btoa(id)}`, {method: "GET"})
      .then(res => res.json())
    return setData(res)
  }

  useEffect(() => {
    getMembers()
  }, [userInfo])

  useEffect(() => {
    if(data === null) return
    if(userInfo?.proSubscriptionRole === "owner") {
      setOwner(data?.internalSubscription?.edges?.[0]?.node?.admin)
      setSubscriptionMembers(data?.internalSubscription?.edges?.[0]?.node?.subscribers?.edges)
    }
    if(userInfo?.proSubscriptionRole === "member") {
      setOwner(data?.subscriptionSet?.edges?.[0]?.node?.admin)
      setSubscriptionMembers(data?.subscriptionSet?.edges?.[0]?.node?.subscribers?.edges)
    }
    return setIsLoading(false)
  }, [data])

  const handleAddMember = async () => {
    setIsLoading(true)
    const idUser = await fetch(`/api/user/getIdUser?p=${btoa(valueEmail)}`, {method: "GET"})
      .then(res => res.json())
    const [ idUserMember ] = reg.exec(idUser?.id)

    const res = await fetch(`/api/user/addMemberInSubscription?p=${btoa(idUserMember)}&r=${btoa(id)}`, {method: "GET"})
      .then(res => res.json())

    if(res.success) {
      getMembers()
    } else {
      setIsLoading(false)
    }
  }

  const handleRemoveMember = async () => {
    setIsLoading(true)
    const idUser = await fetch(`/api/user/getIdUser?p=${btoa(valueEmail)}`, {method: "GET"})
      .then(res => res.json())
    const [ idUserMember ] = reg.exec(idUser?.id)

    const res = await fetch(`/api/user/removeMemberInSubscription?p=${btoa(idUserMember)}&r=${btoa(id)}`, {method: "GET"})
      .then(res => res.json())

    if(res.success) {
      getMembers()
    } else {
      setIsLoading(false)
    }
    setValueEmail("")
  }

  const MembersComponent = ({ data, isOwner }) => {
    return (
      <>
        <GridItem
          overflow="hidden"
          padding={{base: "24px 0", lg: "24px"}}
          borderBottom="1px solid #EEEEEE"
        >
          <Stack
            width="100%"
            position="relative"
            flexDirection="row"
            spacing={0}
            paddingLeft={{base: "16px", lg: "0"}}
            alignItems={{base: "stretch", lg: "stretch"}}
            gap="24px"
            height="54px"
          >
            <Box
              width="48px"
              minWidth="48px"
              height="48px"
              minHeight="48px"
              borderRadius="50%"
              overflow="hidden"
            >
              <Image 
                width="100%"
                height="100%"
                src={
                  data?.picture ? data?.picture
                  :
                    "https://storage.googleapis.com/basedosdados-website/equipe/sem_foto.png"
                }
              />
            </Box>
            <Stack
              spacing={0}
              flexDirection="column"
              justifyContent="center"
              overflow="hidden"
            >
              <BodyText
                typography="small"
                height="27px"
                isTruncated
              >{data?.firstName} {data?.lastName || ""}</BodyText>
              <BodyText
                typography="small"
                color="#464A51"
                height="27px"
                isTruncated
              >{data?.email}</BodyText>
            </Stack>
          </Stack>
        </GridItem>

        <GridItem
          display="flex"
          alignItems="center"
          width="100%"
          padding={{base: "24px 16px", lg: "24px"}}
          borderBottom="1px solid #EEEEEE"
        >
          <BodyText color="#464A51" typography="small">
            {isOwner ? t('username.administrator') : t('username.member')}
          </BodyText>

          {!isOwner && userInfo?.proSubscriptionRole === "owner" &&
            <Box
              fill="#FF8484"
              marginLeft="auto"
              cursor="pointer"
              _hover={{opacity: 0.8}}
            >
              <Tooltip
                label={t("username.remove")}
                hasArrow
                padding="16px"
                backgroundColor="#252A32"
                boxSizing="border-box"
                borderRadius="8px"
                fontFamily="Roboto"
                fontWeight="400"
                fontSize="14px"
                lineHeight="20px"
                textAlign="center"
                color="#FFFFFF"
                placement="top"
                maxWidth="230px"
              >
                <TrashIcon
                  width="25px"
                  height="25px"
                  onClick={() => {
                    RemoveMemberModal.onOpen()
                    setValueEmail(data?.email)
                  }}
                />
              </Tooltip>
            </Box>
          }
        </GridItem>
      </>
    )
  }

  return (
    <Stack spacing="0" flex="1">
      <ModalGeneral
        isOpen={AddMemberModal.isOpen}
        onClose={() => {
          setValueEmail("")
          AddMemberModal.onClose()
        }}
        propsModalContent={{
          width: "100%",
          maxWidth: "500px",
          margin: "24px"
        }}
      >
        <Stack spacing={0} marginBottom="40px"></Stack>
        <Stack spacing={0} marginBottom="40px"></Stack>
      </ModalGeneral>

      <ModalGeneral
        isOpen={RemoveMemberModal.isOpen}
        onClose={() => {
          RemoveMemberModal.onClose()
          setValueEmail("")
        }}
        propsModalContent={{
          width: "100%",
          maxWidth: "500px",
          margin: "24px"
        }}
      >
        <Stack spacing={0} marginBottom="40px">
          <TitleText marginRight="20px">
            {t("username.modalRemoveMember")}
          </TitleText>
          <ModalCloseButton
            fontSize="14px"
            top="28px"
            right="26px"
            _hover={{backgroundColor: "transparent", opacity: 0.7}}
          />
        </Stack>

        <Stack
          display="flex"
          flexDirection={{base: "column", lg: "row"}}
          alignItems="center"
          justifyContent="end"
          gap={{base: "8px", lg: "16px"}}
          spacing={0}
        >
          <Button
            width={{base: "100%", lg: "auto"}}
            justifyContent="center"
            border="1px solid #BF3434"
            color="#BF3434"
            backgroundColor="#fff"
            _hover={{
              color: "#992A2A",
              borderColor: "#992A2A"
            }}
            onClick={() => {
              RemoveMemberModal.onClose()
              setValueEmail("")
            }}
          >
            {t("username.cancel")}
          </Button>

          <Button
            width={{base: "100%", lg: "auto"}}
            justifyContent="center"
            backgroundColor="#BF3434"
            _hover={{
              backgroundColor: "#992A2A",
            }}
            onClick={() => {
              RemoveMemberModal.onClose()
              handleRemoveMember()
            }}
          >
            {t("username.remove")}
          </Button>
        </Stack>
      </ModalGeneral>

      {isLoading ?
        <Stack flex="1" justifyContent="center" marginTop="10vh">
          <Spinner
            margin="0 auto"
            width="200px"
            height="200px"
            color="#2B8C4D"
          />
        </Stack>
      :
      <>
        <Stack
          display={userInfo?.proSubscriptionRole === "owner" ? "flex" : "none"}
          marginBottom="24px"
        >
          <Button marginLeft="auto" onClick={handleAddMember}>
            {t('username.addUser')}
          </Button>
        </Stack>

        <Grid templateColumns={{base: "1fr 1fr", lg: "3fr 1fr"}}>
          <GridItem>
            <BodyText
            backgroundColor="#EEEEEE"
            padding={{base: "8px 0 8px 16px", lg: "8px 24px"}}
            color="#464A51"
          >{t('username.user')}</BodyText>
          </GridItem>
          <GridItem>
            <BodyText
              backgroundColor="#EEEEEE"
              padding={{base: "8px 16px", lg: "8px 24px"}}
              color="#464A51"
              width="100%"
            >{t('username.access')}</BodyText>
          </GridItem>

          {owner && <MembersComponent data={owner} isOwner={true} />}
          {subscriptionMembers.map((member, index) => (
            <MembersComponent data={member?.node} isOwner={false} key={index} />
          ))}
        </Grid>
      </>
      }
    </Stack>
  )
}