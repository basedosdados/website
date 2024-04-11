import cookies from "js-cookie";

async function isJWTInvalid() {
  try {
    const decoded = await fetch(`/api/user/validateToken`, {method: "GET"})
      .then(res => res.json())

    return decoded.success
  } catch (error) {
    console.log(error)

    return true
  }
}


export default async function authUser(context, destiny) {
  const { req, res } = context

  const invalidToken = await isJWTInvalid()

  if (invalidToken) {
    cookies.remove('userBD', { path: '/' })
    cookies.remove('token', { path: '/' })

    res.setHeader('Set-Cookie', [
      `userBD=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
      `token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    ])

    return {
      redirect: {
        destination: destiny,
        permanent: false,
      },
    }
  }

  return {
    props: {
    }
  }
}
