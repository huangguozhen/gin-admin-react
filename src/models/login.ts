import { Reducer } from 'redux';
import { Effect } from 'dva';
import { stringify } from 'querystring';
import router from 'umi/router';

import {
  fakeAccountLogin,
  fakeAccountLogout,
  getFakeCaptchaId,
  getFakeCaptcha,
  queryCurrent,
  queryMenuTree,
} from '@/services/login';
import { setAccessToken, clearAccessToken, setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { ConnectState } from './connect.d';

export interface CurrentUser {
  avatar?: string;
  nickname?: string;
  username?: string;
  role_names?: Array<string>;
}

export interface MenuAction {
  code?: string;
  name?: string;
}

export interface MenuResource {
  code?: string;
  name?: string;
  method?: string;
  path?: string;
}

export interface MenuParam {
  menu_id?: string;
  name?: string;
  sequence?: number;
  icon?: string;
  router?: string;
  hidden?: number;
  parent_id?: string;
  parent_path?: string;
  actions?: MenuAction[];
  resources?: MenuResource[];
  children?: MenuParam[];
}

export interface LoginModelState {
  status?: 'ok' | 'error';
  message?: string;
  type?: string;
  captchaId?: string;
  captcha?: string;
  currentUser?: CurrentUser;
  menus?: MenuParam[];
}

export interface LoginModelType {
  namespace: string;
  state: LoginModelState;
  effects: {
    login: Effect;
    getCaptcha: Effect;
    logout: Effect;
    reloadCaptcha: Effect;
    fetchCurrent: Effect;
    fetchMenuTree: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<LoginModelState>;
    saveCaptcha: Reducer<LoginModelState>;
    saveCurrentUser: Reducer<LoginModelState>;
    saveMenus: Reducer<LoginModelState>;
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
          },
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
        const {
          error: { message },
        } = yield response.json();
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: 'error',
            message,
          },
        });
        yield put({ type: 'getCaptcha' });
      }
    },

    *getCaptcha(_, { call, put }) {
      const { captcha_id: captchaId } = yield call(getFakeCaptchaId);
      yield put({
        type: 'saveCaptcha',
        payload: {
          id: captchaId,
          captcha: getFakeCaptcha(captchaId),
        },
      });
    },

    *reloadCaptcha(_, { put, select }) {
      const captchaId = yield select((state: ConnectState) => state.login.captchaId);
      yield put({
        type: 'saveCaptcha',
        payload: {
          id: captchaId,
          captcha: `${getFakeCaptcha(captchaId)}&reload=${Math.random()}`,
        },
      });
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
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
    *fetchMenuTree(_, { call, put }) {
      const response = yield call(queryMenuTree);
      const menuData = response.list || [];
      yield put({
        type: 'saveMenus',
        payload: menuData,
      });

      const authority: string[] = [];
      function fillAuthority(data: MenuParam[]) {
        for (let i = 0; i < data.length; i += 1) {
          if (<string>data[i].name !== '') {
            authority.push(<string>data[i].name);
          }
          if (data[i].children && (<MenuParam[]>data[i].children).length > 0) {
            fillAuthority(<MenuParam[]>data[i].children);
          }
        }
      }
      fillAuthority(menuData);
      setAuthority(authority);
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
        captcha: payload.captcha,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    saveMenus(state, action) {
      return {
        ...state,
        menus: action.payload || [],
      };
    },
  },
};

export default Model;
