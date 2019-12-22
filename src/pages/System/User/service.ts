import request from '@/utils/request';

const router = 'users';

export async function query(params: any) {
  return request(`/${router}`, { params });
}

export async function get(params: any) {
  return request(`/${router}/${params.user_id}`);
}

export async function create(params: any) {
  return request(`/${router}`, {
    method: 'POST',
    data: params,
  });
}

export async function update(params: any) {
  return request(`/${router}/${params.user_id}`, {
    method: 'PUT',
    data: params,
  });
}

export async function del(params: any) {
  return request(`/${router}/${params.user_id}`, {
    method: 'DELETE',
  });
}

export async function enable(params: any) {
  return request(`/${router}/${params.user_id}/enable`, {
    method: 'PATCH',
  });
}

export async function disable(params: any) {
  return request(`/${router}/${params.user_id}/disable`, {
    method: 'PATCH',
  });
}
