import request from '@/utils/request';

const router = 'roles';

export async function query(params: any) {
  return request(`/${router}`, {
    params,
  });
}

export async function querySelect(params: any) {
  return request(`/${router}.select`, {
    params,
  });
}

export async function get(params: any) {
  return request(`/${router}/${params.role_id}`);
}

export async function create(params: any) {
  return request(`/${router}`, {
    method: 'POST',
    data: params,
  });
}

export async function update(params: any) {
  return request(`/${router}/${params.role_id}`, {
    method: 'PUT',
    data: params,
  });
}

export async function del(params: any) {
  return request(`/${router}/${params.role_id}`, {
    method: 'DELETE',
  });
}
