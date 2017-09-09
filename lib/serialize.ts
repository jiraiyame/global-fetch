import isObject from './is-object';

function encode(val: string) {
  return encodeURIComponent(val)
    .replace(/%40/gi, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']');
}

// Creats a query string in URL-encoded notation
export default function serialize(params: { [key: string]: any }): string {
  if (!isObject(params)) {
    return '';
  }
  const pairs: string[] = [];
  Object.keys(params).forEach((key) => {
    let val = params[key];
    if (Array.isArray(val)) {
      val = val.join(',');
    }
    pairs.push(`${encode(key)}=${encode(val)}`);
  });
  return pairs.join('&');
}
