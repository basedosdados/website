import {VStack} from "@chakra-ui/react";
import Menu from "../components/molecules/Menu";
import SiteHead from "../components/atoms/SiteHead";

export default function Home() {
  return (
    <>
        <SiteHead/>
        <VStack>
            <Menu/>
            <VStack width="100%" height="100vh" background="linear-gradient(180deg, #3A761E 0%, #66A24A 10.42%, #6CA850 100%);">
            </VStack>
        </VStack>
    </>
  )
}
