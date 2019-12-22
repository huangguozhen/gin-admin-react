import request from '@/utils/request';
import { TableListItem, TableListParams, TableListData } from './data.d';

export async function query(params?: TableListParams): Promise<any> {
  const data: TableListData = await request('/products', { params });
  return {
    data: data.list,
    ...data.pagination,
  };
}

export async function del(params: { product_key: string }) {
  return request(`/products/${params.product_key}`, { method: 'DELETE' });
}

export async function create(params: TableListItem ) {
  return request('/products', {
    method: 'POST',
    data: params,
  });
}

export async function update(params: TableListItem) {
  return request(`/products/${params.product_key}`, {
    method: 'PUT',
    data: params,
  });
}
