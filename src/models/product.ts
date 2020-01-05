import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { TableListItem } from '@/pages/Hardware/Product/data.d';
import { queryOne, query } from '@/services/product';

export interface ProductStateType {
  data?: TableListItem;
  list?: TableListItem[];
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: ProductStateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: ProductStateType;
  effects: {
    fetch: Effect;
    fetchAll: Effect;
  };
  reducers: {
    save: Reducer<ProductStateType>;
    saveList: Reducer<ProductStateType>;
  };
}

const Model: ModelType = {
  namespace: 'product',

  state: {
    data: {
      name: '',
    },
  },

  effects: {
    *fetch({ key }, { call, put }) {
      const response = yield call(queryOne, { key });
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchAll(_, { call, put }) {
      const response = yield call(query, { pageSize: 50 });
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, data: payload };
    },
    saveList(state, { payload }) {
      return { ...state, list: payload.data };
    },
  },
};

export default Model;
