import { useState, useEffect } from 'react';
import { loadStripe} from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  CardElement,
  BillingAddressFields,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_XKUpwPvvEnNxMsSzoLm8H3i8')

export default function PaymentSystem() {
  const [clientSecret, setClientSecret] = useState("pi_3OAILWJxRPM20N1w0d8Rm69A_secret_Cu5T0wtbTmi9oZKtEcFeVyBnK")

  const appearance = {
    theme: 'stripe',
  }

  const options = {
    clientSecret,
    appearance,
  }

  return (
    <>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <BillingAddressFields />
        </Elements>
      )}
    </>
  )
}