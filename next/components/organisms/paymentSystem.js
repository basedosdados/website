import {
  VStack,
  Text
} from "@chakra-ui/react"
import { useState, useEffect } from 'react';
import { loadStripe} from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import Button from "../atoms/RoundedButton";

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
      redirect: 'if_required',
      // confirmParams: {
      //   return_url: "https://google.com"
      // }
    })

    console.log(data)

    if (error) {
      setMessages(`${messages}<br />${error.message}`)
    }
  }

  return (
    <VStack spacing={0} alignItems="start">
      <form onSubmit={handlerSubmit}>
        <PaymentElement />

        <Button type="submit" marginTop="20px !important">Pagar</Button>
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

  return (
    <>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <PaymentForm />
        </Elements>
      )}
    </>
  )
}