import {
  VStack,
  Text,
} from "@chakra-ui/react"
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  AddressElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import Button from "../atoms/RoundedButton";

import {
  getPrices,
  createCustomer,
  createSubscription
} from "../../pages/api/stripe";

const stripePromise = loadStripe(`${process.env.NEXT_PUBLIC_KEY_STRIPE}`)

const PaymentForm = () => {
  const stripe = useStripe()
  const elements = useElements()
  const [messages, setMessages] = useState("")

  const handlerSubmit = async (e) => {
    e.preventDefault()

    setMessages(`${messages}<br />Submitting payment...`)
    
    const data = await stripe.confirmPayment({
      elements,
      // redirect: 'if_required',
      confirmParams: {
        return_url: "/"
      }
    })
  }

  return (
    <VStack
      spacing={0}
      alignItems="start"
    >
      <form onSubmit={handlerSubmit}>
        <PaymentElement />

        <Button width="100%" type="submit" marginTop="20px !important">Iniciar inscrição</Button>
      </form>

      {messages && <Text marginTop="20px !important">{messages}</Text>}
    </VStack>
  )
}

export default function PaymentSystem() {
  const [clientSecret, setClientSecret] = useState("")

  const appearance = {
    theme: "stripe",
  }

  const options = {
    clientSecret,
    appearance,
  }

  const customerCreatPost = async () => {
    let secret = ""
    
    const subscriptionCreate = await createSubscription("19")
    if(subscriptionCreate?.clientSecret) {
      secret = subscriptionCreate?.clientSecret
    }
    if(secret !== "") return setClientSecret(secret)

    const result = await createCustomer()
    if(result?.id) {
      const subscriptionCreate = await createSubscription("19")
      secret = subscriptionCreate?.clientSecret
    }

    return setClientSecret(secret)
  }

  useEffect(() => {
    customerCreatPost()
  }, [])

  return (
    <>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <AddressElement options={{mode:'billing'}}/>
          <PaymentForm />
        </Elements>
      )}
    </>
  )
}