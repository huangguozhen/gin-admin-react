import request from '@/utils/request';

export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryCurrent(): Promise<any> {
  return request('/pub/current/user');
}

export async function queryMenuTree(): Promise<any> {
  return request('/pub/current/menutree');
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}
