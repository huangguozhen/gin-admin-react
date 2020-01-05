import request from '@/utils/request';
import { TableListItem, TableListParams, TableListData } from '@/pages/Hardware/Product/data.d';

export async function query(params?: TableListParams): Promise<any> {
  const data: TableListData = await request('/products', { params });
  return {
    data: data.list,
    ...data.pagination,
  };
}

export async function del(params: { product_key: string }): Promise<any> {
  return request(`/products/${params.product_key}`, { method: 'DELETE' });
}

export async function create(params: TableListItem ): Promise<any> {
  return request('/products', {
    method: 'POST',
    data: params,
  });
}

export async function update(params: TableListItem): Promise<any> {
  return request(`/products/${params.product_key}`, {
    method: 'PUT',
    data: params,
  });
}

export async function queryOne(params: { key: string }): Promise<any> {
  return request(`/products/${params.key}`, { method: 'GET' });
}
