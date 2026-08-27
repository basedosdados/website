import cookies from 'js-cookie';

export async function clearClientSession() {
  cookies.remove('userBD', { path: '/' });
  try {
    await fetch('/api/user/clearSession', { method: 'POST', credentials: 'same-origin' });
  } catch (_) {}
}

// Returns the brand domain this build is serving. Prefers the build-time
// NEXT_PUBLIC_DOMAIN (baked per Docker image: basedosdados.org, data-basis.org,
// basedelosdatos.org) so it is correct on the server and under Docker, where the
// browser hostname is localhost. Falls back to the hostname for local npm dev.
export function getDomain() {
  if (process.env.NEXT_PUBLIC_DOMAIN) return process.env.NEXT_PUBLIC_DOMAIN.replace(/^www\./, "");
  if (typeof window !== "undefined") return window.location.hostname.replace(/^www\./, "");
  return "";
}

// True only on the Brazilian branch (basedosdados.org), which is the only one
// that offers consulting services and Brazil-specific content.
export function isBasedosdadosDomain() {
  return getDomain() === "basedosdados.org";
}

// Community Discord invite per interface language. Each locale has its own
// server, so links must follow the site language rather than always pointing
// at the Portuguese community.
export function getDiscordUrl(locale) {
  const byLocale = {
    pt: "https://discord.gg/huKWpsVYx4",
    en: "https://discord.gg/tx57ek6zqQ",
    es: "https://discord.gg/nNfQYcmrvM",
  };
  return byLocale[locale] || byLocale.pt;
}

// The backend query generator (getTableOneBigTableQuery) always aliases the
// table as `dados`. Rename that alias to match the interface language so the
// generated SQL reads naturally per site: pt -> dados, en -> data, es -> datos.
// The replace is targeted at the alias declaration (`AS dados`) and the column
// prefixes (`dados.`); word boundaries keep it from touching the project path
// `basedosdados.<dataset>.<table>` or any other identifier.
export function localizeQueryTableAlias(query, locale) {
  const aliasByLocale = { pt: "dados", en: "data", es: "datos" };
  const alias = aliasByLocale[locale] || "dados";
  if (alias === "dados" || typeof query !== "string") return query;
  return query
    .replace(/\bAS dados\b/g, `AS ${alias}`)
    .replace(/\bdados\./g, `${alias}.`);
}

export function filterOnlyValidValues(obj, validValues = null) {
  return Object.entries(obj).filter(
    ([k, v]) =>
      ["", null, " "].indexOf(v) == -1 &&
      ["columns"].indexOf(k) == -1 &&
      (validValues == null || (validValues && validValues.indexOf(k) != -1))
  );
}

export function formatObjectsInArray(arr) {
  return arr.map(([k, v]) => {
    if (v instanceof Object) {
      return [
        k,
        filterOnlyValidValues(v)
          .map(([k, v]) => `${isNumeric(k) ? "" : k + ": "} ${v}`)
          .join("\n"),
      ];
    }

    return [k, v];
  });
}

function isNumeric(str) {
  var code, i, len;

  for (i = 0, len = str.length; i < len; i++) {
    code = str.charCodeAt(i);
    if (
      !(code > 47 && code < 58) // numeric (0-9)
    ) {
      return false;
    }
  }
  return true;
}

export function translate(keyTranslations, valueTranslations, object) {
  const formatObject = (value) => {
    if(typeof value === "object") {
      return formatJson(JSON.stringify(value), true)
    }

    return value
  }

  return object.map(([k, v]) => {
    const newKey = k in keyTranslations ? keyTranslations[k] : k;
    let newValue = v in valueTranslations ? valueTranslations[v] : v;

    if (Array.isArray(newValue)) {
      newValue = newValue
        .map((v) => (v in valueTranslations ? valueTranslations[v] : formatObject(v)))
        .join(", ");
    }

    newValue = formatObject(newValue)

    return [newKey, newValue];
  });
}

export function unionArrays(arrays) {
  const array = arrays.flat(3);
  const result = [];

  array.forEach((v) => (result.indexOf(v) === -1 ? result.push(v) : null));

  return result;
}

export function addParametersToCurrentURL(params) {
  const originalUrl = window.location.href;
  const splitUrl = originalUrl.split("?");
  const urlParams = new URLSearchParams(splitUrl.length > 0 ? splitUrl[1] : "");

  Object.assign(urlParams, params);

  window.history.pushState(
    {},
    "",
    splitUrl[0] +
      "?" +
      Object.entries(urlParams)
        .map(([k, v]) => `${k}=${v}`)
        .join("&")
  );
}

export function repeat(s, count) {
  return new Array(count + 1).join(s);
}

export function formatJson(json, replace) {
  var i           = 0,
    il          = 0,
    tab         = "    ",
    newJson     = "",
    indentLevel = 0,
    inString    = false,
    currentChar = null;

  for (i = 0, il = json.length; i < il; i += 1) {
    currentChar = json.charAt(i);

    switch (currentChar) {
    case '{':
    case '[':
      if (!inString) {
        newJson += currentChar + "\n" + repeat(tab, indentLevel + 1);
        indentLevel += 1;
      } else {
        newJson += currentChar;
      }
      break;
    case '}':
    case ']':
      if (!inString) {
        indentLevel -= 1;
        newJson += "\n" + repeat(tab, indentLevel) + currentChar;
      } else {
        newJson += currentChar;
      }
      break;
    case ',':
      if (!inString) {
        newJson += ",\n" + repeat(tab, indentLevel);
      } else {
        newJson += currentChar;
      }
      break;
    case ':':
      if (!inString) {
        newJson += ": ";
      } else {
        newJson += currentChar;
      }
      break;
    case ' ':
    case "\n":
    case "\t":
      if (inString) {
        newJson += currentChar;
      }
      break;
    case '"':
      if (i > 0 && json.charAt(i - 1) !== '\\') {
        inString = !inString;
      }
      newJson += currentChar;
      break;
    default:
      newJson += currentChar;
      break;
    }
  }

  if(replace){
    return newJson.replace(/[\[\]{\{\}'"]+/g, '')
  }
  return newJson;
}

export const cleanGraphQLResponse = (input) => {
  if (!input) return null

  const isPrimitiveType = (test) => {
    return test !== Object(test)
  }

  if (isPrimitiveType(input)) return input

  const output = {}
  const isObject = (obj) => {
    return obj !== null && typeof obj === 'object' && !Array.isArray(obj)
  }

  Object.keys(input).forEach((key) => {
    if (input[key] && input[key].edges) {
      output[key] = input[key].edges.map((edge) =>
        cleanGraphQLResponse(edge.node),
      )
    } else if (isObject(input[key])) {
      output[key] = cleanGraphQLResponse(input[key])
    } else if (key !== '__typename') {
      output[key] = input[key]
    }
  })

  return removeEmpty(output)
}

export function removeEmpty(obj) {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, v]) => v != null)
      .map(([k, v]) => [k, v === Object(v) ? removeEmpty(v) : v])
  );
}

export function triggerGAEvent(category, action) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'event': `${category}`,
    'value': `${action}`
  });
}

export function triggerGAEventWithData(category, data) {
  window.dataLayer = window.dataLayer || [];

  const eventData = {
    event: category,
    ...data,
  };

  window.dataLayer.push(eventData);
}

const CHATBOT_LP_DESKTOP_PLACEMENTS = new Set([
  "desktop_header_right",
  "desktop_solutions_dropdown",
]);

export function trackNavigateToChatbotLp({
  value,
  placement,
  pagePath,
  isMobile,
}) {
  if (typeof window === "undefined") return;

  const user = getUserFromCookie();

  triggerGAEventWithData("navigating_to_chatbot_lp", {
    value,
    menu_placement: placement,
    is_mobile: isMobile ?? !CHATBOT_LP_DESKTOP_PLACEMENTS.has(placement),
    is_logged_in: isUserLoggedIn(user),
    is_bd_pro: hasBDProSubscription(user),
    page_path: pagePath || window.location.pathname,
  });
}

export function cleanString(string) {
  const newString = string.trim()
  const returnString = newString.replace(/\s+/g, ' ')

  return returnString
}

export const UserPagePath = "/user"

export function isUserLoggedIn(user) {
  return Boolean(user?.id || user?.email)
}

export function getUserDisplayName(user) {
  return [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim()
}

export function getUserPageHref(section) {
  if (!section) return UserPagePath
  return `${UserPagePath}?${section}`
}

const PhoneE164Pattern = /^\+[1-9]\d{7,14}$/

export const PhoneCountries = [
  { callingCode: "55", maxDigits: 11, placeholder: "(11) 9 9999-9999", iso: "BR" },
  { callingCode: "1", maxDigits: 10, placeholder: "(555) 123-4567", iso: "US" },
  { callingCode: "52", maxDigits: 10, placeholder: "55 1234 5678", iso: "MX" },
  { callingCode: "54", maxDigits: 10, placeholder: "11 1234-5678", iso: "AR" },
  { callingCode: "57", maxDigits: 10, placeholder: "300 123 4567", iso: "CO" },
  { callingCode: "56", maxDigits: 9, placeholder: "9 1234 5678", iso: "CL" },
  { callingCode: "51", maxDigits: 9, placeholder: "912 345 678", iso: "PE" },
  { callingCode: "34", maxDigits: 9, placeholder: "612 34 56 78", iso: "ES" },
  { callingCode: "351", maxDigits: 9, placeholder: "912 345 678", iso: "PT" },
  { callingCode: "44", maxDigits: 10, placeholder: "7400 123456", iso: "GB" },
]

const PhoneCountryByCode = Object.fromEntries(
  PhoneCountries.map((country) => [country.callingCode, country])
)

const DefaultCallingCodeByLocale = {
  pt: "55",
  en: "1",
  es: "52",
}

export function getDefaultCallingCode(locale) {
  return DefaultCallingCodeByLocale[locale] || DefaultCallingCodeByLocale.pt
}

export function getPhoneCountry(callingCode) {
  return PhoneCountryByCode[callingCode] || PhoneCountryByCode[getDefaultCallingCode("pt")]
}

export function sanitizePhoneInput(value) {
  return String(value || "").replace(/\D/g, "")
}

function localPhoneDigits(value, callingCode) {
  const country = getPhoneCountry(callingCode)
  let digits = sanitizePhoneInput(value)

  if (digits.startsWith(callingCode) && digits.length > country.maxDigits) {
    digits = digits.slice(callingCode.length)
  }

  return digits.slice(0, country.maxDigits)
}

function formatGroupedPhone(digits, groups, joiner = " ") {
  if (!digits) return ""

  const parts = []
  let index = 0

  for (const size of groups) {
    if (index >= digits.length) break
    parts.push(digits.slice(index, index + size))
    index += size
  }

  if (index < digits.length) parts.push(digits.slice(index))
  return parts.join(joiner)
}

function formatBrazilLocal(digits) {
  if (digits.length === 0) return ""
  if (digits.length < 2) return `(${digits}`
  if (digits.length === 2) return `(${digits})`

  const ddd = digits.slice(0, 2)
  const subscriber = digits.slice(2)

  if (subscriber.length === 1) return `(${ddd}) ${subscriber}`
  if (subscriber.length <= 5) {
    return `(${ddd}) ${subscriber.slice(0, 1)} ${subscriber.slice(1)}`
  }

  return `(${ddd}) ${subscriber.slice(0, 1)} ${subscriber.slice(1, 5)}-${subscriber.slice(5, 9)}`
}

function formatUsLocal(digits) {
  if (digits.length === 0) return ""
  if (digits.length < 3) return `(${digits}`
  if (digits.length === 3) return `(${digits})`
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
}

function formatArLocal(digits) {
  if (digits.length <= 2) return digits
  if (digits.length <= 6) return `${digits.slice(0, 2)} ${digits.slice(2)}`
  return `${digits.slice(0, 2)} ${digits.slice(2, 6)}-${digits.slice(6, 10)}`
}

export function formatPhoneInput(value, callingCode) {
  const digits = localPhoneDigits(value, callingCode)

  if (callingCode === "55") return formatBrazilLocal(digits)
  if (callingCode === "1") return formatUsLocal(digits)
  if (callingCode === "52") return formatGroupedPhone(digits, [2, 4, 4])
  if (callingCode === "54") return formatArLocal(digits)
  if (callingCode === "57") return formatGroupedPhone(digits, [3, 3, 4])
  if (callingCode === "56") return formatGroupedPhone(digits, [1, 4, 4])
  if (callingCode === "51" || callingCode === "351") return formatGroupedPhone(digits, [3, 3, 3])
  if (callingCode === "34") return formatGroupedPhone(digits, [3, 2, 2, 2])
  if (callingCode === "44") return formatGroupedPhone(digits, [4, 6])

  return digits
}

export function handlePhoneInputChange(previousValue, nextValue, callingCode) {
  const nextDigits = sanitizePhoneInput(nextValue)
  const prevDigits = sanitizePhoneInput(previousValue)

  if (
    String(nextValue).length < String(previousValue || "").length &&
    nextDigits === prevDigits
  ) {
    return formatPhoneInput(prevDigits.slice(0, -1), callingCode)
  }

  return formatPhoneInput(nextValue, callingCode)
}

export function splitStoredPhone(value, locale) {
  const defaultCallingCode = getDefaultCallingCode(locale)
  const digits = sanitizePhoneInput(value)

  if (!digits) {
    return { callingCode: defaultCallingCode, localNumber: "" }
  }

  const sortedCodes = PhoneCountries
    .map((country) => country.callingCode)
    .sort((a, b) => b.length - a.length)

  for (const callingCode of sortedCodes) {
    const country = getPhoneCountry(callingCode)
    if (digits.startsWith(callingCode) && digits.length > callingCode.length) {
      const localNumber = digits.slice(callingCode.length)
      if (localNumber.length <= country.maxDigits) {
        return { callingCode, localNumber }
      }
    }
  }

  return { callingCode: defaultCallingCode, localNumber: digits }
}

export function formatPhoneDisplay(value, locale) {
  if (!value) return ""
  const { callingCode, localNumber } = splitStoredPhone(value, locale)
  const formattedLocal = formatPhoneInput(localNumber, callingCode)
  return formattedLocal ? `+${callingCode} ${formattedLocal}` : `+${callingCode}`
}

export function normalizePhone(value, callingCode = getDefaultCallingCode("pt")) {
  const country = getPhoneCountry(callingCode)
  const digits = localPhoneDigits(value, callingCode)
  if (!digits) return ""
  return `+${country.callingCode}${digits}`
}

export function isValidE164Phone(value) {
  return PhoneE164Pattern.test(value)
}

export function formatBytes(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`
  } else if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  } else if (bytes < 1024 * 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
  } else {
    return `${(bytes / (1024 * 1024 * 1024 * 1024)).toFixed(2)} TB`
  }
}

const BD_PRO_SUBSCRIPTIONS = ["bd_pro", "bd_pro_empresas"]
const matchesBDProSubscription = (value) => {
  const normalized = (value || "").toLowerCase()
  return normalized.includes("bd_pro") || normalized.includes("empresas")
}

export function hasBDProSubscription(user) {
  return BD_PRO_SUBSCRIPTIONS.includes(user?.proSubscription)
}

export function getActiveInternalSubscription(user) {
  const subscriptions = user?.internalSubscription?.edges?.map((edge) => edge?.node) || []
  const bdProSubscription = subscriptions.find((subscription) =>
    matchesBDProSubscription(subscription?.stripeSubscription)
  )
  if (bdProSubscription) return bdProSubscription
  return subscriptions[0] || null
}

export function hasChatbotSubscription(user) {
  const subscriptions = user?.internalSubscription?.edges?.map((edge) => edge?.node) || []
  return subscriptions.some((subscription) =>
    (subscription?.stripeSubscription || "").toLowerCase().includes("chatbot")
  )
}

export function isSubscriptionTrialing(subscription) {
  return (subscription?.stripeSubscriptionStatus || "").toLowerCase() === "trialing"
}

export function getSubscriptionStatusKey(subscription) {
  if (isSubscriptionTrialing(subscription)) return "trial"
  if (subscription?.canceledAt) return "canceled"
  return "active"
}

export function getSubscriptionType(user) {
  if (hasBDProSubscription(user)) return "bd_pro"
  if (hasChatbotSubscription(user)) return "chatbot"
  if (user?.isSubscriber) return "unknown"
  return "none"
}

function filterConsumerChatbotPlans(edges) {
  return (edges || []).filter((item) => {
    const name = item?.node?.productName?.toLowerCase() || ""
    const slug = item?.node?.productSlug?.toLowerCase() || ""
    const isConsumerChatbot =
      (name.includes("chatbot") || slug.includes("chatbot")) &&
      !name.includes("empresas")
    return isConsumerChatbot && item?.node?.isActive === true
  })
}

export async function fetchChatbotPlan(interval = "year") {
  const amounts = { month: 30, year: 326 }
  const amount = amounts[interval] || amounts.year

  try {
    const result = await fetch("/api/stripe/getPlans", { method: "GET" }).then((res) =>
      res.json()
    )
    if (!result?.success) return null

    const chatbotPlans = filterConsumerChatbotPlans(result.data)
    return (
      chatbotPlans.find(
        (item) => item?.node?.interval === interval && item?.node?.amount === amount
      )?.node ?? null
    )
  } catch {
    return null
  }
}

export function getUserFromCookie() {
  try {
    const raw = cookies.get("userBD")
    if (!raw || raw === "undefined") return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export async function redirectToChatbotCheckout(router, { interval = "year" } = {}) {
  const plan = await fetchChatbotPlan(interval)

  if (plan?._id) {
    cookies.set("plan_selected", plan._id, { expires: 1, path: "/" })
  }

  const user = getUserFromCookie()

  if (!isUserLoggedIn(user)) {
    if (typeof window !== "undefined") {
      localStorage.setItem("previousPath", window.location.href)
    }
    return router.push("/user/login")
  }

  const query = { plans_and_payment: "" }
  if (!plan?._id) {
    query.checkout = "chatbot"
  }

  return router.push({
    pathname: UserPagePath,
    query,
  })
}
