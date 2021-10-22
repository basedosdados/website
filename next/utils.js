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
          .join(",\t"),
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
  console.log(valueTranslations);
  return object.map(([k, v]) => {
    const newKey = k in keyTranslations ? keyTranslations[k] : k;
    const newValue = v in valueTranslations ? valueTranslations[v] : v;

    return [newKey, newValue];
  });
}

export function unionArrays(arrays) {
  const array = arrays.flat(3);
  const result = [];

  array.forEach((v) => (result.indexOf(v) === -1 ? result.push(v) : null));

  return result;
}
