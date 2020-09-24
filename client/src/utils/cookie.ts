export const getCookie = (name: string) => {
  const regex = new RegExp(`(?:(?:^|.*;*)${name}*=*([^;]*).*$)|^.*$`);
  return document.cookie.replace(regex, '$1');
}

export const setCookie = (name: string, value: string, ttl?: number) => {
  document.cookie = `${name}=${value};path=/;max-age=${ttl || 31536000}`;
}