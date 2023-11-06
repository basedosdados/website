import cookies from "js-cookie";
import { validateToken } from "../pages/api/user";

async function isJWTInvalid(token) {
  if (!token) return true

  try {
    const decoded = await validateToken(token)
    if (decoded?.payload?.email) {
      return false
    }

    return true;
  } catch (error) {
    console.log(error)

    return true
  }
}


export default async function authUser(context, destiny) {
  const { req, res } = context

  const invalidToken = await isJWTInvalid(req.cookies.token)
  // const invalidToken = true

  if (invalidToken) {
    cookies.remove('user', { path: '/' })
    cookies.remove('token', { path: '/' })

    res.setHeader('Set-Cookie', [
      `user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
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
