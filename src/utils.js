
export function isObject(obj) {
  return obj === Object(obj);
}

export function isArray(arr) {
  return Array.isArray(arr);
}

export function isArrayEqual(a, b) {
  if (a.length !== b.length) return false;
  return a.filter(aValue => {
    return b.filter(bValue => {
      return isEqual(aValue, bValue);
    }).length === 1;
  }).length === a.length;
}

export function isObjectEqual(a, b) {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  return aKeys.filter(aKey => {
    return bKeys.filter(bKey => {
      return aKey === bKey && isEqual(a[aKey], b[bKey]);
    }).length === 1;
  }).length === aKeys.length;
}

export function isEqual(a, b) {
  if (typeof a !== typeof b) return false;
  if (isArray(a) && isArray(b)) {
    return isArrayEqual(a, b);
  }
  if (isObject(a) && isObject(b)) {
    return isObjectEqual(a, b);
  }
  return a === b;
}