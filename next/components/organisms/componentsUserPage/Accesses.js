import {
  Stack,
  Box,
  Image,
  Grid,
  GridItem,
  Spinner
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import BodyText from "../../atoms/Text/BodyText";

export default function Accesses ({ userInfo }) {
  const { t } = useTranslation('user');
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [owner, setOwner] = useState(null)
  const [subscriptionMembers, setSubscriptionMembers] = useState([])

  async function getMembers() {
    const reg = new RegExp("(?<=:).*")
    const [ id ] = reg.exec(userInfo?.id)

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
            overflow="hidden"
            flexDir="column"
            spacing={0}
            paddingLeft={{base: "16px", lg: "0"}}
            flexDirection="row"
            alignItems={{base: "stretch", lg: "stretch"}}
            height="54px"
          >
            <Box
              position="absolute"
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
            <BodyText
              typography="small"
              marginLeft={{base: "44px !important", lg: "60px !important"}}
              height="27px"
              isTruncated
            >{data?.firstName} {data?.lastName || ""}</BodyText>
            <BodyText
              typography="small"
              marginLeft={{base: "44px !important", lg: "60px !important"}}
              color="#464A51"
              height="27px"
              isTruncated
            >{data?.email}</BodyText>
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
        </GridItem>
      </>
    )
  }

  return (
    <Stack spacing="24px" flex="1">
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
      }
    </Stack>
  )
}