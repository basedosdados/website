import { serialize } from "cookie";

export default function handler(req, res) {
  const permission = JSON.stringify({
    hasSudo: atob(req.query.p),
    email: atob(req.query.q)
  })

  res.setHeader("Set-Cookie", serialize("permission_sudo", permission, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  }));

  res.status(200).json({ success: true });
}
