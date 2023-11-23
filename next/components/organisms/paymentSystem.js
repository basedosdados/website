import {
  VStack,
  Text,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage
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
import Exclamation from "../../public/img/icons/exclamationIcon";

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
      redirect: 'if_required',
      // confirmParams: {
      //   return_url: "https://google.com"
      // }
    })
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

const LabelTextForm = ({ text, ...props }) => {
  return (
    <FormLabel
      color="#252A32"
      fontFamily="ubuntu"
      letterSpacing="0.2px"
      fontSize="16px"
      fontWeight="400"
      lineHeight="16px"
      {...props}
    >{text}</FormLabel>
  )
}

function CustomerCreat ({ setClientSecret }) {
  const [formData, setFormData] = useState({
    country: "",
    state: "",
    city: "",
    line: "" ,
    postalCode: ""
  })
  const [errors, setErrors] = useState({
    country: "",
    state: "",
    city: "",
    line: "" ,
    postalCode: ""
  })

  const handleInputChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const customerCreatPost = async ({ country, state, city, line, postalCode }) => {
    let clientSecret = ""
    const result = await createCustomer({ country, state, city, line, postalCode })

    if(result?.id) {
      const subscriptionCreate = await createSubscription("19")
      clientSecret = subscriptionCreate?.clientSecret
    }

    return setClientSecret(clientSecret)
  }

  const handleSubmit = (e) => {
    const validationErrors = {}
    e.preventDefault()

    if(!formData.country) {
      validationErrors.country = "Por favor, insira o país que se localiza"
    }
    if(!formData.state) {
      validationErrors.state = "Por favor, insira o estado que se localiza"
    }
    if(!formData.city) {
      validationErrors.city = "Por favor, insira o cidade que se localiza"
    }
    if(!formData.line) {
      validationErrors.line = "Por favor, insira o endereço que se localiza"
    }
    if(!formData.postalCode) {
      validationErrors.postalCode = "Por favor, insira o CEP da sua localidade"
    }

    setErrors(validationErrors)
    if (Object.keys(validationErrors).length === 0) {
      customerCreatPost(formData)
    }
  }

  return (
    <VStack maxWidth="300px" alignItems="flex-start">
      <FormControl isInvalid={!!errors.country}>
        <LabelTextForm text="País"/>
        <Input
          id="country"
          name="country"
          value={formData.country}
          onChange={handleInputChange}
          placeholder="Insira seu país"
          fontFamily="ubuntu"
          height="40px"
          fontSize="14px"
          borderRadius="16px"
          _placeholder={{color: "#A3A3A3"}}
          _invalid={{boxShadow:"0 0 0 2px #D93B3B"}}
        />
        <FormErrorMessage fontSize="12px" color="#D93B3B" display="flex" flexDirection="row" gap="4px" alignItems="flex-start">
          <Exclamation marginTop="3px" fill="#D93B3B"/>{errors.country}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.state}>
        <LabelTextForm text="Estado"/>
        <Input
          id="state"
          name="state"
          value={formData.state}
          onChange={handleInputChange}
          placeholder="Insira seu Estado"
          fontFamily="ubuntu"
          height="40px"
          fontSize="14px"
          borderRadius="16px"
          _placeholder={{color: "#A3A3A3"}}
          _invalid={{boxShadow:"0 0 0 2px #D93B3B"}}
        />
        <FormErrorMessage fontSize="12px" color="#D93B3B" display="flex" flexDirection="row" gap="4px" alignItems="flex-start">
          <Exclamation marginTop="3px" fill="#D93B3B"/>{errors.state}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.city}>
        <LabelTextForm text="Cidade"/>
        <Input
          id="city"
          name="city"
          value={formData.city}
          onChange={handleInputChange}
          placeholder="Insira sua cidade"
          fontFamily="ubuntu"
          height="40px"
          fontSize="14px"
          borderRadius="16px"
          _placeholder={{color: "#A3A3A3"}}
          _invalid={{boxShadow:"0 0 0 2px #D93B3B"}}
        />
        <FormErrorMessage fontSize="12px" color="#D93B3B" display="flex" flexDirection="row" gap="4px" alignItems="flex-start">
          <Exclamation marginTop="3px" fill="#D93B3B"/>{errors.city}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.line}>
        <LabelTextForm text="Endereço"/>
        <Input
          id="line"
          name="line"
          value={formData.line}
          onChange={handleInputChange}
          placeholder="Insira seu endereço"
          fontFamily="ubuntu"
          height="40px"
          fontSize="14px"
          borderRadius="16px"
          _placeholder={{color: "#A3A3A3"}}
          _invalid={{boxShadow:"0 0 0 2px #D93B3B"}}
        />
        <FormErrorMessage fontSize="12px" color="#D93B3B" display="flex" flexDirection="row" gap="4px" alignItems="flex-start">
          <Exclamation marginTop="3px" fill="#D93B3B"/>{errors.line}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.postalCode}>
        <LabelTextForm text="CEP"/>
        <Input
          id="postalCode"
          name="postalCode"
          value={formData.postalCode}
          onChange={handleInputChange}
          placeholder="Insira seu CEP"
          fontFamily="ubuntu"
          height="40px"
          fontSize="14px"
          borderRadius="16px"
          _placeholder={{color: "#A3A3A3"}}
          _invalid={{boxShadow:"0 0 0 2px #D93B3B"}}
        />
        <FormErrorMessage fontSize="12px" color="#D93B3B" display="flex" flexDirection="row" gap="4px" alignItems="flex-start">
          <Exclamation marginTop="3px" fill="#D93B3B"/>{errors.postalCode}
        </FormErrorMessage>
      </FormControl>

      <Button
        onClick={(e) => handleSubmit(e)}
        borderRadius="30px"
        marginTop="24px !important"
      >
        Cadastrar endereço de cobraça
      </Button>
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
      {!clientSecret &&
        <CustomerCreat setClientSecret={(e) => setClientSecret(e)}/>
      }

      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <PaymentForm />
        </Elements>
      )}
    </>
  )
}