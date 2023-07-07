import cookies from "js-cookie";
import { isJWTInvalid } from "../utils";

export default function authUser(context, destiny) {
  const { req, res } = context

  if (isJWTInvalid(req.cookies.token)) {
    cookies.remove('user', { path: '/' })
    cookies.remove('token', { path: '/' })

    res.setHeader('Set-Cookie', [
      `user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
      `token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    ]);

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