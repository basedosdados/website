import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import cookies from "js-cookie";
import { redirectToChatbotCheckout, clearClientSession } from "../../../utils";

async function clearAuthCookiesAndRedirectLogin(router) {
  if (typeof window !== "undefined") {
    localStorage.setItem("previousPath", window.location.href);
  }
  await clearClientSession();
  router.replace("/user/login");
}

function hasUserCookie() {
  const userRaw = cookies.get("userBD");
  if (!userRaw || userRaw === "undefined") return false;
  try {
    JSON.parse(userRaw);
    return true;
  } catch {
    return false;
  }
}

export default function ChatbotAccessGate({ children }) {
  const router = useRouter();
  const [canEnter, setCanEnter] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function checkAccess() {
      if (typeof window === "undefined") return;
      if (!hasUserCookie()) {
        await clearAuthCookiesAndRedirectLogin(router);
        return;
      }
      try {
        const res = await fetch("/api/user/validateToken", {
          method: "GET",
          credentials: "same-origin"
        });
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok || !data.success) {
          await clearAuthCookiesAndRedirectLogin(router);
          return;
        }
        if (!data.has_chatbot_access) {
          await redirectToChatbotCheckout(router);
          return;
        }
        setCanEnter(true);
      } catch {
        if (!cancelled) await clearAuthCookiesAndRedirectLogin(router);
      }
    }

    checkAccess();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!canEnter) return null;
  return children;
}
