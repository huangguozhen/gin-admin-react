import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { query } from './service';

export interface StateType {}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
  };
  reducers: {
    show: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'product',

  state: {
    basicGoods: [],
  },

  effects: {
    *fetch({ key }, { call, put }) {
      const response = yield call(query, { key });
      yield put({
        type: 'show',
        payload: response,
      });
    },
  },

  reducers: {
    show(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default Model;
