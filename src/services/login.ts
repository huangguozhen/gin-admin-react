import request from '@/utils/request';

export interface LoginParamsType {
  username: string;
  password: string;
  captcha_id: string;
  captcha_code: string;
}

export async function fakeAccountLogin(params: LoginParamsType): Promise<any> {
  return request('/pub/login', {
    method: 'POST',
    data: params,
  });
}

export async function fakeAccountLogout(): Promise<any> {
  return request('/pub/login/exit', {
    method: 'POST',
  });
}

export async function getFakeCaptchaId(): Promise<any> {
  return request('/pub/login/captchaid');
}

export function getFakeCaptcha(id: string): string {
  return `/api/v1/pub/login/captcha?id=${id}`;
}
