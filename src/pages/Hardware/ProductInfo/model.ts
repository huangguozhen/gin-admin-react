import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { DataItem } from './data.d';
import { query } from './service';

export interface ProductStateType {
  data: DataItem;
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
  };
  reducers: {
    save: Reducer<ProductStateType>;
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
      const response = yield call(query, { key });
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, data: payload };
    },
  },
};

export default Model;
