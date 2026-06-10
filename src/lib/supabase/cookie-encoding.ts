const PREFIX = "enc:";

export function encodeCookieValue(value: string): string {
  for (let i = 0; i < value.length; i++) {
    if (value.charCodeAt(i) > 255) {
      return PREFIX + encodeURIComponent(value);
    }
  }
  return value;
}

export function decodeCookieValue(value: string): string {
  if (value.startsWith(PREFIX)) {
    try {
      return decodeURIComponent(value.slice(PREFIX.length));
    } catch {
      return value;
    }
  }
  return value;
}
