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

export function limitTextSize(text, size) {
  if (text.length > size) {
    return text.slice(0, size) + "...";
  }

  return text;
}

export function isBdPlus(dataset) {
  return (dataset?.resources || [])
    .filter((r) => r && r?.resource_type)
    .some((r) => r && r?.resource_type === "bdm_table");
}

export function translate(keyTranslations, valueTranslations, object) {
  const formatObject = (value) => {
    if(typeof value === "object") {
      return formatJson(JSON.stringify(value))
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

export function formatJson(json) {
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

  return newJson;
}