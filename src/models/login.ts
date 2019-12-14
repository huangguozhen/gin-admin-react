import { Reducer } from 'redux';
import { Effect } from 'dva';
import { stringify } from 'querystring';
import router from 'umi/router';

import { fakeAccountLogin, fakeAccountLogout, getFakeCaptchaId, getFakeCaptcha } from '@/services/login';
import { setAccessToken, clearAccessToken } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { ConnectState } from './connect.d';

export interface StateType {
  status?: 'ok' | 'error';
  message?: string;
  type?: string;
  captchaId?: string;
  captcha?: string;
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    getCaptcha: Effect;
    logout: Effect;
    reloadCaptcha: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
    saveCaptcha: Reducer<StateType>;
  };
}

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
    type: 'account',
  },

  effects: {
    *login({ payload }, { call, put }) {
      try {
        const response = yield call(fakeAccountLogin, payload);
        // Login successfully
        yield put({ 
          type: 'changeLoginStatus', 
          payload: {
            status: 'ok',
          } 
        });
        // 保存访问令牌
        setAccessToken(response);

        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }
        router.replace(redirect || '/');
      } catch (response) {
        const { error: { message } } = yield response.json();
        yield put({ 
          type: 'changeLoginStatus', 
          payload: {
            status: 'error',
            message: message,
          } 
        });
        yield put({ type: 'getCaptcha' });
      }
    },

    *getCaptcha(_, { call, put }) {
      const { captcha_id } = yield call(getFakeCaptchaId);
      yield put({
        type: 'saveCaptcha',
        payload: {
          id: captcha_id,
          captcha: getFakeCaptcha(captcha_id),
        },
      })
    },

    *reloadCaptcha(_, { put, select }) {
      const captchaId = yield select((state: ConnectState) => state.login.captchaId);
      yield put({
        type: 'saveCaptcha',
        payload: {
          id: captchaId,
          captcha: `${getFakeCaptcha(captchaId)}&reload=${Math.random()}`,
        }
      })
    },

    *logout(_, { call }) {
      yield call(fakeAccountLogout);
      const { redirect } = getPageQuery();
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/user/login' && !redirect) {
        router.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
      // 清空访问令牌
      clearAccessToken();
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: payload.status,
        message: payload.message,
      };
    },
    saveCaptcha(state, { payload }) {
      return {
        ...state,
        captchaId: payload.id,
        captcha: payload.captcha
      }
    },
  },
};

export default Model;
