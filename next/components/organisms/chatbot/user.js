import cookies from "js-cookie";

// The signed-in user, parsed from the `userBD` cookie (see pages/user/login.js).
export function getUserFromCookie() {
  try {
    const raw = cookies.get("userBD");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getUserEmailFromCookie() {
  return getUserFromCookie()?.email || null;
}

// A name derived from an email's local part. `full` title-cases every
// dot/underscore/hyphen segment ("joao.silva" -> "Joao Silva"); otherwise it
// takes just the first dot-segment, capitalized ("joao.silva" -> "Joao").
export function nameFromEmail(email, { full = false } = {}) {
  const local = (email || "").split("@")[0];
  if (!local) return "";
  const segments = full ? local.split(/[._-]+/).filter(Boolean) : [local.split(".")[0]];
  return segments
    .map((word) => {
      const rest = full ? word.slice(1).toLowerCase() : word.slice(1);
      return word.charAt(0).toUpperCase() + rest;
    })
    .join(" ");
}
