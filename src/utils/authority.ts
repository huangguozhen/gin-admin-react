import { reloadAuthorized } from './Authorized';

// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str?: string): string | string[] {
  const authorityString =
    typeof str === 'undefined' && localStorage ? localStorage.getItem('antd-pro-authority') : str;
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
  // preview.pro.ant.design only do not use in your production.
  // preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  if (!authority && ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return ['admin'];
  }
  return authority;
}

export function setAuthority(authority: string | string[]): void {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
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