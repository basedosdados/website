import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import { Button, Box, Stack } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_KEY_STRIPE);

function CheckoutForm({ onSuccess, onError, apiKey, amount }) {
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useTranslation('dataAPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/user`,
      },
      redirect: "if_required"
    });

    if (error) {
      setMessage(error.message);
      onError(error);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      // Call the credits API after successful payment
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/data_api/credits/add?key=${apiKey}&amount=${amount}&currency=BRL`
        );
        const data = await response.json();
        
        if (data.success) {
          onSuccess(data);
        } else {
          onError(new Error('Failed to add credits'));
        }
      } catch (err) {
        onError(err);
      }
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={4}>
        <PaymentElement />
        <Button
          width="100%"
          backgroundColor="#2B8C4D"
          color="#FFFFFF"
          _hover={{
            backgroundColor: "#22703E"
          }}
          isLoading={isProcessing}
          disabled={!stripe}
          type="submit"
        >
          {t('pricing.confirmPayment')}
        </Button>
        {message && <Box color="red.500">{message}</Box>}
      </Stack>
    </form>
  );
}

export default function PaymentSystemCredits({
  amount,
  apiKey,
  onSuccess,
  onError,
  isLoading
}) {
  const [clientSecret, setClientSecret] = useState("");
  const { t } = useTranslation('dataAPI');

  useEffect(() => {
    async function createPaymentIntent() {
      const response = await fetch('/api/stripe/createApiCreditPayment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          apiKey,
        }),
      });
      
      const data = await response.json();
      setClientSecret(data.clientSecret);
      isLoading(false);
    }

    isLoading(true);
    createPaymentIntent();
  }, [amount, apiKey]);

  const appearance = {
    theme: "stripe",
    variables: {
      fontFamily: 'Roboto, sans-serif',
      fontSizeBase: "16px",
      fontSizeSm: "16px",
      borderRadius: "14px",
      colorPrimary: "#2B8C4D",
      colorTextPlaceholder: "#464A51",
      colorDanger: "#BF3434",
      colorBackground: "#FFFFFF",
      colorText: "#252A32",
    },
    rules: {
      ".Input": {
        borderRadius: "8px",
        border: "2px solid #EEEEEE",
        backgroundColor: "#EEEEEE"
      },
      ".Input:hover": {
        backgroundColor: "#DEDFE0",
        borderColor: "#DEDFE0"
      },
      ".Input:focus": {
        backgroundColor: "#FFFFFF",
        border: "2px solid #0068C5",
        borderColor: "#0068C5",
        boxShadow: "none",
        outline: "none"
      },
      ".Input:focus:hover": {
        backgroundColor: "#FFFFFF",
        borderColor: "#0068C5",
      },
      ".Tab": {
        border: "2px solid #ececec",
        backgroundColor: "#FFF",
        boxShadow: "none"
      },
      ".Tab:focus": {
        boxShadow: "none"
      },
      ".Tab--selected": {
        boxShadow: "none"
      },
      ".Tab--selected:focus": {
        boxShadow: "none"
      }
    }
  };

  const options = {
    clientSecret,
    appearance,
    fonts: [{ cssSrc: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap' }],
  };

  return clientSecret ? (
    <Elements options={options} stripe={stripePromise}>
      <CheckoutForm 
        onSuccess={onSuccess} 
        onError={onError} 
        apiKey={apiKey}
        amount={amount}
      />
    </Elements>
  ) : null;
} 