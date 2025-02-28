import { parse } from "cookie";

export default function handler(req, res) {
  const cookies = parse(req.headers.cookie || "");
  const permission = cookies.permission_sudo
    ? JSON.parse(cookies.permission_sudo)
    : null;

  res.status(200).json({ permission });
}
