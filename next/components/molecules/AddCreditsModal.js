import {
  Stack,
  Box,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  ModalCloseButton,
  Button
} from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "next-i18next";
import { ModalGeneral } from "./uiUserPage";

export default function AddCreditsModal({ 
  isOpen, 
  onClose, 
  apiKey,
  onSuccess,
  onError 
}) {
  const { t } = useTranslation('user');
  const [amount, setAmount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/data_api/credits/add?hashed_key=${apiKey.hash}&amount=${amount}&currency=BRL`
      );
      const data = await response.json();
      
      if (data.success) {
        onSuccess(data);
        onClose();
      } else {
        onError(new Error('Failed to add credits'));
      }
    } catch (err) {
      onError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalGeneral
      isOpen={isOpen}
      onClose={onClose}
      propsModalContent={{
        width: "100%",
        maxWidth: "1008px",
        margin: "24px"
      }}
    >
      <Stack spacing={0} marginBottom="40px">
        <Text
          typography="small"
          width="100%"
          color="#2B8C4D"
        >
          {t('dataAPI.addCredits')}
        </Text>
        <ModalCloseButton
          fontSize="14px"
          top="34px"
          right="26px"
          _hover={{backgroundColor: "transparent", opacity: 0.7}}
        />
      </Stack>

      <Stack spacing={6}>
        <Box>
          <Text mb={2}>{t('dataAPI.selectAmount')}</Text>
          <NumberInput
            value={amount}
            onChange={(value) => setAmount(Number(value))}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Box>

        <Button
          width="100%"
          backgroundColor="#2B8C4D"
          color="#FFFFFF"
          _hover={{
            backgroundColor: "#22703E"
          }}
          onClick={handleConfirm}
          isLoading={isLoading}
        >
          {t('dataAPI.confirm')}
        </Button>
      </Stack>
    </ModalGeneral>
  );
} 