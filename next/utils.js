export function filterOnlyValidValues(obj) {
  return Object.entries(obj).filter(
    ([k, v]) => ["", null, " "].indexOf(v) == -1 && ["columns"].indexOf(k) == -1
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
  return dataset.resources.some((r) => r.resource_type === "bdm_table");
}

export function translate(translations, object) {
  const newObj = {};

  if (!object) return {};

  Object.entries(object).forEach(([k, v]) => {
    if (k in translations) newObj[translations[k]] = v;
    else newObj[k] = v;
  });

  return newObj;
}
