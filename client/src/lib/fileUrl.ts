const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api/';

export const FILE_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');

export function toAbsoluteFileUrl(path: string | undefined) {
  if (!path) {
    return '';
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  return `${FILE_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
