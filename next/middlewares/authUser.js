import { serializeClearedTokenCookie } from "../lib/authCookie";

async function isJWTInvalid(cookieHeader = "") {
  try {
    const decoded = await fetch(`/api/user/validateToken`, {
      method: "GET",
      headers: cookieHeader ? { Cookie: cookieHeader } : {},
    }).then((res) => res.json());

    return !decoded.success;
  } catch (error) {
    console.error(error);
    return true;
  }
}

export default async function authUser(context, destiny) {
  const { req, res } = context;

  const invalidToken = await isJWTInvalid(req.headers.cookie || "");

  if (invalidToken) {
    res.setHeader("Set-Cookie", [
      serializeClearedTokenCookie(),
      `userBD=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
    ]);

    return {
      redirect: {
        destination: destiny,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
