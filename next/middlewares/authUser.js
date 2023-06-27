import cookies from "js-cookie";
import { isJWTInvalid } from "../utils";

export default function authUser(context, destiny) {
  const { req } = context

  if (isJWTInvalid(req.cookies.token)) {
    cookies.remove('user', { path: '/' })
    cookies.remove('token', { path: '/' })

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