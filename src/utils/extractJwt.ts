export function extractJwtToken(cookieString: string) {
  if (!cookieString) {
    return null;
  }

  const cookiesArray = cookieString.split(';');

  for (const cookie of cookiesArray) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'jwtToken') {
      return value;
    }
  }

  return null;
}
