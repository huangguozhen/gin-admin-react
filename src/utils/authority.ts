import { reloadAuthorized } from './Authorized';

// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str?: string): string | string[] {
  const authorityString =
    typeof str === 'undefined' && localStorage ? localStorage.getItem('authority') : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    if (authorityString) {
      authority = JSON.parse(authorityString);
    }
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }

  return authority;
}

export function setAuthority(authority: string | string[]): void {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  localStorage.setItem('authority', JSON.stringify(proAuthority));
  // auto reload
  reloadAuthorized();
}

const accessTokenKey = 'access_token';

interface TokenProps {
  access_token: string;
  expires_at: number;
  token_type?: string;
}

export function setAccessToken(token: TokenProps): void {
  sessionStorage.setItem(accessTokenKey, JSON.stringify(token));
}

export function getAccessToken(): TokenProps {
  const token = sessionStorage.getItem(accessTokenKey);
  if (!token || token === '') {
    return {
      access_token: '',
      expires_at: 0,
      token_type: '',
    };
  }

  return JSON.parse(token);
}

export function clearAccessToken() {
  sessionStorage.removeItem(accessTokenKey);
}
