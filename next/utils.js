import cookies from 'js-cookie';

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

export function cleanString(string) {
  const newString = string.trim()
  const returnString = newString.replace(/\s+/g, ' ')

  return returnString
}

export function formatBytes(bytes) {
  if (bytes < 1024) {
    return `${bytes}B`
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