import { isJWTInvalid } from "../utils";

export default function authUser(context) {
  const { req } = context

  if (isJWTInvalid(req.cookies.token)) {
    return {
      redirect: {
        destination: '/user/login',
        permanent: false,
      },
    }
  }

  return {
    props: {
    }
  }
}