import isImage from 'is-image';
import isUrl from 'is-url';
import { parse } from 'url';

export const isValidImageUrl = (url: string) => {
  if (!url) return false;
  const http = url.lastIndexOf('http');
  if (http !== -1) url = url.substring(http);
  if (!isUrl(url)) return isImage(url);
  let pathname = parse(url).pathname;
  if (!pathname) return false;
  const last = pathname.search(/[:?&]/);
  if (last !== -1) pathname = pathname.substring(0, last);
  if (isImage(pathname)) return true;
  if (/styles/i.test(pathname)) return false;
  return false;
}

export const isReachableUrl = (url: string, cb: (err: boolean) => void) => {
  const image = new Image();
  image.onload = () => cb(false);
  image.onerror = () => cb(true);
  image.src = url;
}
