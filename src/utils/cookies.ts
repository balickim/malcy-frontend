import Cookies from 'js-cookie';

export function getAccessToken(): string | undefined {
  return Cookies.get('accessToken');
}

export function setAccessToken(token: string): string | undefined {
  return Cookies.set('accessToken', token);
}