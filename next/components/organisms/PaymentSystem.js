import {
  Stack,
  VStack,
  Skeleton,
  Spinner,
} from "@chakra-ui/react"
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import Button from "../atoms/RoundedButton";
import styles from "../../styles/paymentSystem.module.css";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_KEY_STRIPE)

const PaymentForm = ({ onSucess, onErro, clientSecret}) => {
  const [isLoading, setIsLoading] = useState(false)
  const stripe = useStripe()
  const elements = useElements()

  const handlerSubmit = async (e) => {
    setIsLoading(true)
    e.preventDefault()

    const isSetupIntent = clientSecret.startsWith('seti_');
    if (isSetupIntent) {
      await elements.submit();

      const data = await stripe.confirmSetup({
        elements,
        clientSecret: clientSecret,
        redirect: 'if_required',
      });
  
      if (data?.error?.code === "card_declined") return onErro();
      if (data?.setupIntent?.status === "succeeded") return onSucess();

    } else {
      const data = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      })
  
      if(data?.error?.code === "card_declined") return onErro()
      if(data?.paymentIntent?.status === "succeeded") return onSucess()
    }
  }

  return (
    <VStack
      spacing={0}
      flex={1}
      alignItems="start"
    >
      <form
        className={styles.content}
        onSubmit={handlerSubmit}
      >
        <PaymentElement className={styles.payment}/>

        <Button
          type="submit"
          fontSize="14px"
          lineHeight="20px"
          fontFamily="Roboto"
          fontWeight="500"
          borderRadius="8px"
          pointerEvents={isLoading ? "none" : "default"}
          color="#FFFFFF"
          backgroundColor="#2B8C4D"
          _hover={{
            backgroundColor: "#22703E"
          }}
        >
          {isLoading ? <Spinner /> : "Confirmar pagamento"}
        </Button>
      </form>
    </VStack>
  )
}

export default function PaymentSystem({ userData, plan, coupon, onSucess, onErro }) {
  const [clientSecret, setClientSecret] = useState("")

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
        border: "2px solid #EEEEEE",
        backgroundColor: "#EEEEEE"
      },
      ".Input:hover": {
        backgroundColor:"#DEDFE0",
        borderColor: "#DEDFE0"
      },
      ".Input:focus": {
        backgroundColor: "#FFFFFF",
        border:"2px solid #0068C5",
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
  }

  const options = {
    clientSecret,
    appearance,
    fonts: [{ cssSrc: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap' }],
  }

  const customerCreatPost = async (id, coupon) => {
    const clientSecret = await fetch(`/api/stripe/createSubscription?p=${btoa(id)}&c=${btoa(coupon)}`, {method: "GET"})
      .then(res => res.json())

    if (clientSecret) {
      setClientSecret(clientSecret)
    }
  }

  useEffect(() => {
    setClientSecret("")
    customerCreatPost(plan, coupon)
  }, [plan, coupon])

  const SkeletonBox = ({ type, ...props }) => {
    if(type === "text") return <Skeleton height="17px" borderRadius="12px" startColor="#F0F0F0" endColor="#F3F3F3" {...props}/>
    if(type === "box") return <Skeleton height="45px" marginBottom="12px !important"  borderRadius="12px" startColor="#F0F0F0" endColor="#F3F3F3" {...props}/>
    if(type === "smallBox") return <Skeleton height="48px" width="50%"  borderRadius="12px" startColor="#F0F0F0" endColor="#F3F3F3" {...props}/>
    if(type === "bnt") return <Skeleton height="40px" borderRadius="12px" startColor="#F0F0F0" endColor="#F3F3F3" {...props}/>
  }

  if(!clientSecret) return (
    <Stack flex={1}>
      <Stack width="100%" flexDirection="row" spacing={0} gap="8px" marginBottom="16px !important">
        <Stack width="100%"  spacing={0} gap="8px">
          <SkeletonBox type="text"/>
          <SkeletonBox type="smallBox" width="100%"/>
        </Stack>
        <Stack width="100%" spacing={0} gap="8px">
          <SkeletonBox type="text"/>
          <SkeletonBox type="smallBox" width="100%"/>
        </Stack>
      </Stack>

      <SkeletonBox type="text"/>
      <SkeletonBox type="box"/>

      <Stack width="100%" flexDirection="row" spacing={0} gap="8px" marginBottom="16px !important">
        <Stack width="100%"  spacing={0} gap="8px">
          <SkeletonBox type="text"/>
          <SkeletonBox type="smallBox" width="100%"/>
        </Stack>
        <Stack width="100%" spacing={0} gap="8px">
          <SkeletonBox type="text"/>
          <SkeletonBox type="smallBox" width="100%"/>
        </Stack>
      </Stack>

      <SkeletonBox type="bnt"/>
    </Stack>
  )

  return (
    <Elements options={options} stripe={stripePromise}>
      <PaymentForm
        clientSecret={options.clientSecret}
        userData={userData}
        onSucess={onSucess}
        onErro={onErro}
      />
    </Elements>
  )
}