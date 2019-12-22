import request from '@/utils/request';

const router = 'menus';

export async function query(params: any) {
  return request(`/${router}`, {
    params,
  });
}

export async function queryTree(params: any) {
  return request(`/${router}.tree?${stringify(params)}`);
}

export async function get(params: any) {
  return request(`/${router}/${params.menu_id}`);
}

export async function create(params: any) {
  return request(`/${router}`, {
    method: 'POST',
    data: params,
  });
}

export async function update(params: any) {
  return request(`/${router}/${params.menu_id}`, {
    method: 'PUT',
    data: params,
  });
}

export async function del(params: any) {
  return request(`/${router}/${params.menu_id}`, {
    method: 'DELETE',
  });
}
