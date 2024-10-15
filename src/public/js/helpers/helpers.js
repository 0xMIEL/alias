function parseCookies() {
  const cookies = document.cookie.split('; ');
  const cookieObj = {};

  cookies.forEach((cookie) => {
    const [name, value] = cookie.split('=');
    cookieObj[decodeURIComponent(name)] = decodeURIComponent(value);
  });

  return cookieObj;
}

export function getUsernameFromCookies() {
  return parseCookies(document.cookie).username;
}
