import { Stack, Image } from '@chakra-ui/react';
import TitleText from '../atoms/Text/TitleText';
import BodyText from '../atoms/Text/BodyText';
import LabelText from '../atoms/Text/LabelText';
import Link from '../atoms/Link';
import Button from '../atoms/Button';
import RedirectIcon from '../../public/img/icons/redirectIcon';

export default function ServiceHighlightABTest({
  id,
  title,
  description,
  buttonText,
  link,
  imageUrl,
}) {
  return (
    <Stack
      id={id}
      width="100%"
      maxWidth="1440px"
      flexDirection={{ base: 'column', md: 'row' }}
      justifyContent="space-between"
      gap="40px"
      padding="32px"
      margin="24px auto !important"
      borderRadius="16px"
      boxSizing="border-box"
      backgroundColor="#EAF3ED"
      spacing={0}
    >
      <Stack width="100%" maxWidth="560px" spacing={0}>
        <TitleText>{title}</TitleText>
        <BodyText typography="small" color="#464A51" marginTop="16px !important">
          {description}
        </BodyText>
        <Link href={link} target="_blank">
          <Button
            isVariant
            padding="10px 16px 10px 20px"
            marginTop="16px !important"
            backgroundColor="transparent"
            _hover={{ backgroundColor: 'transparent' }}
          >
            <LabelText typography="small" color="current-color">
              {buttonText}
            </LabelText>
            <RedirectIcon width="18px" height="18px" alt="hiperlink" />
          </Button>
        </Link>
      </Stack>
      <Image
        src={imageUrl}
        objectFit="contain"
        width="474px"
        height={{ base: '100%', md: '198px' }}
        borderRadius="16px"
      />
    </Stack>
  );
} 