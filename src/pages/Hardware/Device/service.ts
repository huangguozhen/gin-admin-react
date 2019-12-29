import request from '@/utils/request';
import { TableListParams, TableListData, TableListItem } from './data.d';

export async function query(params?: TableListParams) {
  const data: TableListData = await request('/devices', { params });
  return {
    data: data.list,
    ...data.pagination,
  };
}

export async function del(params: { iot_id: string }) {
  return request(`/devices/${params.iot_id}`, { method: 'DELETE' });
}

export async function create(data: TableListItem) {
  return request('/devices', {
    data,
    method: 'POST',
  });
}

export async function update(data: TableListItem) {
  return request(`/devices/${data.iot_id}`, {
    data,
    method: 'PUT',
  });
}
