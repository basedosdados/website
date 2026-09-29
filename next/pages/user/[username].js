export async function getServerSideProps(context) {
  const { query } = context
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(query)) {
    if (key === "username") continue
    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, item))
    } else {
      params.append(key, value)
    }
  }

  const qs = params.toString()

  return {
    redirect: {
      destination: qs ? `/user?${qs}` : "/user",
      permanent: true,
    },
  }
}

export default function UserPageRedirect() {
  return null
}
