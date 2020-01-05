import { Effect } from 'dva';
import { Reducer } from 'redux';
import { message } from 'antd';
import * as roleService from './service';

export interface ModelState {
  search?: any;
  pagination?: any;
  data?: {
    list?: any;
    pagination?: any;
  };
  submitting?: boolean;
  formTitle?: string;
  formType?: string;
  formID?: string;
  formVisible?: boolean;
  formData?: any;
  selectData?: any;
}

export interface RoleModelType {
  namespace: string;
  state: ModelState;
  effects: {
    fetch: Effect;
    loadForm: Effect;
    fetchForm: Effect;
    submit: Effect;
    del: Effect;
    fetchSelect: Effect;
  };
  reducers: {
    saveData: Reducer<ModelState>;
    saveSearch: Reducer<ModelState>;
    savePagination: Reducer<ModelState>;
    changeFormVisible: Reducer<ModelState>;
    saveFormTitle: Reducer<ModelState>;
    saveFormType: Reducer<ModelState>;
    saveFormID: Reducer<ModelState>;
    saveFormData: Reducer<ModelState>;
    changeSubmitting: Reducer<ModelState>;
    saveSelectData: Reducer<ModelState>;
  };
}

const RoleModel: RoleModelType = {
  namespace: 'role',
  state: {
    search: {},
    pagination: {},
    data: {
      list: [],
      pagination: {},
    },
    submitting: false,
    formTitle: '',
    formID: '',
    formVisible: false,
    formData: {},
    selectData: [],
  },
  effects: {
    *fetch({ search, pagination }, { call, put, select }) {
      let params = {};

      if (search) {
        params = { ...params, ...search };
        yield put({
          type: 'saveSearch',
          payload: search,
        });
      } else {
        const s = yield select((state: any) => state.role.search);
        if (s) {
          params = { ...params, ...s };
        }
      }

      if (pagination) {
        params = { ...params, ...pagination };
        yield put({
          type: 'savePagination',
          payload: pagination,
        });
      } else {
        const p = yield select((state: any) => state.role.pagination);
        if (p) {
          params = { ...params, ...p };
        }
      }

      const response = yield call(roleService.query, params);
      yield put({
        type: 'saveData',
        payload: response,
      });
    },
    *loadForm({ payload }, { put }) {
      yield put({
        type: 'changeFormVisible',
        payload: true,
      });

      yield [
        put({
          type: 'saveFormType',
          payload: payload.type,
        }),
        put({
          type: 'saveFormTitle',
          payload: '新建角色',
        }),
        put({
          type: 'saveFormID',
          payload: '',
        }),
        put({
          type: 'saveFormData',
          payload: {},
        }),
      ];

      if (payload.type === 'E') {
        yield [
          put({
            type: 'saveFormTitle',
            payload: '编辑角色',
          }),
          put({
            type: 'saveFormID',
            payload: payload.id,
          }),
          put({
            type: 'fetchForm',
            payload: { role_id: payload.id },
          }),
        ];
      }
    },
    *fetchForm({ payload }, { call, put }) {
      const response = yield call(roleService.get, payload);
      yield [
        put({
          type: 'saveFormData',
          payload: response,
        }),
      ];
    },
    *submit({ payload }, { call, put, select }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });

      const params = { ...payload };
      const formType = yield select((state: any) => state.role.formType);

      let response;
      if (formType === 'E') {
        params.role_id = yield select((state: any) => state.role.formID);
        response = yield call(roleService.update, params);
      } else {
        response = yield call(roleService.create, params);
      }

      yield put({
        type: 'changeSubmitting',
        payload: false,
      });

      if (response.role_id && response.role_id !== '') {
        message.success('保存成功');
        yield put({
          type: 'changeFormVisible',
          payload: false,
        });
        yield put({
          type: 'fetch',
        });
      }
    },
    *del({ payload }, { call, put }) {
      const response = yield call(roleService.del, payload);
      if (response.status === 'OK') {
        message.success('删除成功');
        yield put({ type: 'fetch' });
      }
    },
    *fetchSelect(_, { call, put }) {
      const response = yield call(roleService.querySelect);
      yield put({
        type: 'saveSelectData',
        payload: response.list || [],
      });
    },
  },

  reducers: {
    saveData(state, { payload }) {
      return { ...state, data: payload };
    },
    saveSearch(state, { payload }) {
      return { ...state, search: payload };
    },
    savePagination(state, { payload }) {
      return { ...state, pagination: payload };
    },
    changeFormVisible(state, { payload }) {
      return { ...state, formVisible: payload };
    },
    saveFormTitle(state, { payload }) {
      return { ...state, formTitle: payload };
    },
    saveFormType(state, { payload }) {
      return { ...state, formType: payload };
    },
    saveFormID(state, { payload }) {
      return { ...state, formID: payload };
    },
    saveFormData(state, { payload }) {
      return { ...state, formData: payload };
    },
    changeSubmitting(state, { payload }) {
      return { ...state, submitting: payload };
    },
    saveSelectData(state, { payload }) {
      return { ...state, selectData: payload };
    },
  },
};

export default RoleModel;
