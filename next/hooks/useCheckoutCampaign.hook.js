import { useEffect } from "react"
import { useRouter } from "next/router"
import { consumeCheckoutCampaignRedirect } from "../utils"

export default function useCheckoutCampaign() {
  const router = useRouter()

  useEffect(() => {
    consumeCheckoutCampaignRedirect(router)
  }, [router.isReady, router.asPath])
}
