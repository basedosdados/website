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
      alignItems="start"
    >
      <form
        className={styles.content}
        onSubmit={handlerSubmit}
      >
        <PaymentElement className={styles.payment}/>

        <Button
          type="submit"
          height="40px"
          fontSize="20px"
          lineHeight="30px"
          fontFamily="Roboto"
          fontWeight="500"
          pointerEvents={isLoading ? "none" : "default"}
          color={"#FFFFFF"}
          backgroundColor={"#0D99FC"}
          _hover={{
            color: "#FAFAFA",
            backgroundColor: "#0B89E2"
          }}
        >
          {isLoading ? <Spinner /> : "Iniciar inscrição"}
        </Button>
      </form>
    </VStack>
  )
}

export default function PaymentSystem({ userData, plan, onSucess, onErro }) {
  const [clientSecret, setClientSecret] = useState("")

  const appearance = {
    theme: "stripe",
    variables: {
      fontSizeBase: "16px",
      fontSizeSm: "16px",
      fontFamily: "Ubuntu",
      borderRadius: "14px",
      colorPrimary: "#42B0FF",
      colorTextPlaceholder: "#A3A3A3",
      colorDanger: "#D93B3B",
      colorBackground: "#FFF",
      colorText: "#252A32",
    },
    rules: {
      ".Input": {
        border: "1px solid #DEDFE0",
      },
      ".Input:hover": {
        border: "2px solid #42B0FF",
      },
    }
  }

  const options = {
    clientSecret,
    appearance,
    fonts: [{ cssSrc: 'https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;700&display=swap' }],
  }

  const customerCreatPost = async (id) => {
    const clientSecret = await fetch(`/api/stripe/createSubscription?p=${btoa(id)}`, {method: "GET"})
      .then(res => res.json())

    if (clientSecret) {
      setClientSecret(clientSecret)
    }
  }

  useEffect(() => {
    customerCreatPost(plan.id)
  }, [])

  const SkeletonBox = ({ type, ...props }) => {
    if(type === "text") return <Skeleton height="17px" borderRadius="12px" startColor="#F0F0F0" endColor="#F3F3F3" {...props}/>
    if(type === "box") return <Skeleton height="45px" marginBottom="12px !important"  borderRadius="12px" startColor="#F0F0F0" endColor="#F3F3F3" {...props}/>
    if(type === "smallBox") return <Skeleton height="48px" width="50%"  borderRadius="12px" startColor="#F0F0F0" endColor="#F3F3F3" {...props}/>
    if(type === "bnt") return <Skeleton height="40px" borderRadius="12px" startColor="#F0F0F0" endColor="#F3F3F3" {...props}/>
  }

  if(!clientSecret) return (
    <Stack>
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