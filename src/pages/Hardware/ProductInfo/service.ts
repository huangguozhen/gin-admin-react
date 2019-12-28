import request from '@/utils/request';

export async function query(params: { key: string }) {
  return request(`/products/${params.key}`, { method: 'GET' });
}
