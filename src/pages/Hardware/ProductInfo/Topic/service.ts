import request from '@/utils/request';
import { TableListData, TableListParams, TableListItem } from './data.d';

export async function query(params?: TableListParams) {
  const data: TableListData = await request('/topics', { params });
  return {
    data: data.list,
    ...data.pagination,
  };
}

export async function del(params: { topic_id: string }) {
  return request(`/topics/${params.topic_id}`, {
    method: 'DELETE',
  });
}

export async function create(data: TableListItem) {
  return request('/topics', {
    data,
    method: 'POST',
  });
}

export async function update(data: TableListItem) {
  return request(`/topics/${data.topic_id}`, {
    data,
    method: 'PUT',
  });
}
