import { useRouter } from "next/router";

export default function DomainComponent({ domains = [], children }) {
  const router = useRouter();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  // Check if current hostname matches any of the allowed domains
  const shouldRender = domains.includes(hostname);

  return shouldRender ? children : null;
}
