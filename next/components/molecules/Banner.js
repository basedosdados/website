
import { Box, Stack, Image } from '@chakra-ui/react';
import TitleText from '../atoms/Text/TitleText';
import BodyText from '../atoms/Text/BodyText';
import LabelText from '../atoms/Text/LabelText';
import Link from '../atoms/Link';
import Button from '../atoms/Button';
import RedirectIcon from '../../public/img/icons/redirectIcon';

export default function Banner({
  title,
  description,
  buttonText,
  href,
  onClick,
  imageSrc,
  ...props
}) {
  return (
    <Box
      width="100%"
      maxWidth="1440px"
      display="flex" 
      flexDirection={{ base: 'column', md: 'row' }}
      justifyContent="space-between" 
      gap="40px"
      padding="16px"
      margin="24px auto !important"
      borderRadius="16px"
      boxSizing="border-box"
      backgroundColor="#EAF3ED"
      alignItems="center"
      {...props}
    >
      <Stack width="100%" maxWidth="560px" padding="16px" spacing={0}>
        <TitleText>{title}</TitleText>
        <BodyText
          typography="small"
          marginTop="16px !important"
        >
          {description}
        </BodyText>

        <Link href={href} target="_blank">
          <Button
            isVariant
            padding="10px 16px 10px 20px"
            marginTop="16px !important"
            backgroundColor="transparent"
            _hover={{ backgroundColor: 'transparent' }}
            onClick={onClick}
          >
            <LabelText typography="small" color="current-color">
              {buttonText}
            </LabelText>
            <RedirectIcon width="18px" height="18px" alt="hiperlink" />
          </Button>
        </Link>
      </Stack>
      <Image
        src={imageSrc}
        objectFit="contain"
        width="220px"
        height={{ base: '100%', md: '225px' }}
        borderRadius="16px"
      />
    </Box>
  )
}
