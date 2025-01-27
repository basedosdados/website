import {
  Stack,
  Skeleton,
  SkeletonText,
  Divider
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { capitalize } from "lodash";
import Button from "../atoms/Button";
import TitleText from "../atoms/Text/TitleText";
import LabelText from "../atoms/Text/LabelText";
import BodyText from "../atoms/Text/BodyText";
import ReadMore from "../atoms/ReadMore";
import { AlertDiscalimerBox } from "../molecules/DisclaimerBox";
import FourOFour from "../templates/404";

import RedirectIcon from "../../public/img/icons/redirectIcon";

export default function InformationRequestPage({ id }) {
  const { t } = useTranslation('dataset');
  const router = useRouter();
  const { locale } = router;
  const [isLoading, setIsLoading] = useState(true)
  const [resource, setResource] = useState({})
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const fetchInformationRequest = async () => {
      setIsLoading(true)
      try {
        const url = `/api/informationRequests/getInformationRequest?id=${id}&locale=${locale}`;
        const response = await fetch(url, { method: "GET" })
        const result = await response.json()

        if (result.success) {
          setResource(result.resource)
          setIsError(false)
        } else {
          console.error(result.error)
          setIsError(true)
        }
      } catch (error) {
        console.error("Fetch error: ", error)
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInformationRequest()
  }, [id, locale])

  const AddInfoTextBase = ({ title, text, ...props }) => {
    return (
      <SkeletonText
        startColor="#F0F0F0"
        endColor="#F3F3F3"
        borderRadius="6px"
        minHeight="40px"
        width="100%"
        spacing="4px"
        skeletonHeight="18px"
        noOfLines={2}
        marginBottom="24px !important"
        isLoaded={!isLoading}
        {...props}
      >
        <LabelText typography="small">{title}</LabelText>
        <BodyText
          typography="small"
          color="#464A51"
        >{text || t('informationRequest.notProvided')}</BodyText>
      </SkeletonText>
    )
  }

  const StackSkeleton = ({ children, ...props }) => {
    return (
      <Skeleton
        startColor="#F0F0F0"
        endColor="#F3F3F3"
        borderRadius="6px"
        height="36px"
        width="100%"
        isLoaded={!isLoading}
        {...props}
      >
        {children}
      </Skeleton>
    )
  }

  if(isError) return <FourOFour/>

  return (
    <Stack 
      flex={1}
      overflow="hidden"
      paddingLeft={{base: "0", lg: "24px"}}
      spacing={0}
    >
      <StackSkeleton
        display="flex"
        flexDirection="row"
        alignItems="center"
        gap="8px"
      >
        <TitleText
          width="fit-content"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
        >
          {t('informationRequest.requestNumber', { number: resource?.number })}
        </TitleText>
      </StackSkeleton>

      <StackSkeleton
        minHeight="56px"
        height="fit-content"
        marginTop="8px !important"
      >
        <AlertDiscalimerBox>
          {t('informationRequest.disclaimer')}
        </AlertDiscalimerBox>
      </StackSkeleton>

      <StackSkeleton
        display="flex"
        flexDirection="row"
        gap="16px"
        width="fit-content"
        height="40px"
        marginTop="8px !important"
        marginBottom="40px !important"
      >
        <Button
          as="a"
          href={resource?.dataUrl}
          target="_blank"
          onClick={() => {}}
          backgroundColor={resource?.dataUrl ? "#2B8C4D" : "#ACAEB1"}
          cursor={resource?.dataUrl ? "pointer" : "default"}
          _hover={{
            backgroundColor: resource?.dataUrl ? "#22703E" : "#ACAEB1"
          }}
        >
          {t('informationRequest.accessData')}
          <RedirectIcon
            width="12px"
            height="12px"
          />
        </Button>

        <Button
          as="a"
          href={resource?.url}
          target="_blank"
          onClick={() => {}}
          backgroundColor={resource?.url ? "#2B8C4D" : "#ACAEB1"}
          cursor={resource?.url ? "pointer" : "default"}
          _hover={{
            backgroundColor: resource?.url ? "#22703E" : "#ACAEB1"
          }}
        >
          {t('informationRequest.accessRequest')}
          <RedirectIcon
            width="12px"
            height="12px"
          />
        </Button>
      </StackSkeleton>

      <Stack spacing="8px">
        <StackSkeleton width="160px" height="20px">
          <TitleText

            fontFamily="Roboto"
            fontWeight="500"
            fontSize="18px"
            lineHeight="20px"
            color="#252A32"
          >
            {t('informationRequest.description')}
          </TitleText>
        </StackSkeleton>

        <SkeletonText
          startColor="#F0F0F0"
          endColor="#F3F3F3"
          borderRadius="6px"
          width="100%"
          height="fit-content"
          spacing="6px"
          skeletonHeight="16px"
          noOfLines={3}
          marginTop="8px !important"
          isLoaded={!isLoading}
        >
          <ReadMore id="readLessRawDescription">
            {resource?.[`observations${capitalize(locale)}`] || resource?.observations || t('informationRequest.notProvided')}
          </ReadMore>
        </SkeletonText>
      </Stack>

      <Divider marginY="40px !important" borderColor="#DEDFE0"/>

      <StackSkeleton width="190px" height="28px" marginBottom="20px !important">
        <TitleText typography="small">
          {t('informationRequest.additionalInformation')}
        </TitleText>
      </StackSkeleton>

      <AddInfoTextBase
        title={t('informationRequest.status')}
        text={resource?.status?.[`name${capitalize(locale)}`] || resource?.status?.name}
      />
    </Stack>
  )
}
