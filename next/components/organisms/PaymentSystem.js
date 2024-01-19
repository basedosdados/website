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
import cookies from "js-cookie";
import Button from "../atoms/RoundedButton";

import {
  getUser
} from "../../pages/api/user"

import {
  getPrices,
  createCustomer,
  createSubscription
} from "../../pages/api/stripe";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_KEY_STRIPE)

const PaymentForm = ({ userData }) => {
  const stripe = useStripe()
  const elements = useElements()

  const handlerSubmit = async (e) => {
    e.preventDefault()

    const data = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
      // confirmParams: {
      //   return_url: "/"
      // }
    })

    const user = await getUser(userData?.email)
    cookies.set('userBD', JSON.stringify(user))
    window.open(`/user/${user?.username}?plans_and_payment`, "_self")
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
    </VStack>
  )
}

export default function PaymentSystem({ userData }) {
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
          <PaymentForm userData={userData}/>
        </Elements>
      )}
    </>
  )
}