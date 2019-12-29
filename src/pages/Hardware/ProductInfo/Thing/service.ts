import request from '@/utils/request';
import { TableListData, TableListParams, TableListItem } from './data.d';

export async function query(params?: TableListParams) {
  const data: TableListData = await request('/things', { params });
  return {
    data: data.list,
    ...data.pagination,
  };
}

export async function del(params: { thing_id: string }) {
  return request(`/things/${params.thing_id}`, { method: 'DELETE' });
}

export async function create(data: TableListItem) {
  return request('/things', {
    data,
    method: 'POST',
  });
}

export async function update(data: TableListItem) {
  return request(`/things/${data.thing_id}`, {
    data,
    method: 'PUT',
  });
}
