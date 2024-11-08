
import {
  VStack,
  Box
} from "@chakra-ui/react";
import BodyText from "../components/atoms/BodyText";
import SectionText from "../components/atoms/SectionText";
import { useTranslation } from 'next-i18next';

export default function ServiceTerms() {
  const { t } = useTranslation('terms');
  const TitleText = ({ children, ...props }) => {
    return (
      <BodyText
        fontSize="18px"
        fontWeight="700"
        fontFamily="ubuntu"
        {...props}
      >
        {children}
      </BodyText>
    )
  }

  const SecText = ({ children, ...props }) => {
    return (
      <SectionText
        fontFamily="ubuntu"
        fontSize="18px"
        color="#6F6F6F"
        {...props}
      >
        {children}
      </SectionText>
    )
  }

  return (
    <VStack
      display="flex"
      flexDirection="column"
      spacing={0}
      alignItems="start"
      gap="40px"
    >
      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <TitleText>{t('ToS.term1.title')}</TitleText>
        <SecText>{t('ToS.term1.content')}</SecText>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <TitleText>{t('ToS.term2.title')}</TitleText>
        <SecText>{t('ToS.term2.content')}</SecText>
      </VStack>
    
      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <TitleText>{t('ToS.term3.title')}</TitleText>
        <Box>
          <SecText>{t('ToS.term3.subContent1')}</SecText>
          <SecText>{t('ToS.term3.subContent2')}</SecText>
          <SecText>{t('ToS.term3.subContent3')}</SecText>
        </Box>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <TitleText>{t('ToS.term4.title')}</TitleText>
        <SecText>{t('ToS.term4.content')}</SecText>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <TitleText>{t('ToS.term5.title')}</TitleText>
        <SecText>{t('ToS.term5.content')}</SecText>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <TitleText>{t('ToS.term6.title')}</TitleText>
        <SecText>{t('ToS.term6.content')}</SecText>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <TitleText>{t('ToS.term7.title')}</TitleText>
        <SecText>{t('ToS.term7.content')}</SecText>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <TitleText>{t('ToS.term8.title')}</TitleText>
        <SecText>{t('ToS.term8.content')}</SecText>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <TitleText>{t('ToS.term9.title')}</TitleText>
        <SecText>{t('ToS.term9.content')}</SecText>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <TitleText>{t('ToS.term10.title')}</TitleText>
        <SecText>{t('ToS.term10.content')}</SecText>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <TitleText>{t('ToS.term11.title')}</TitleText>
        <SecText>{t('ToS.term11.content')}</SecText>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <TitleText>{t('ToS.term12.title')}</TitleText>
        <SecText>{t('ToS.term12.content')}</SecText>
      </VStack> 

      <SecText>{t('ToS.finalNote')}</SecText>
    </VStack>
  )
}