import { Effect } from 'dva';
import { Reducer } from 'redux';

import { queryCurrent, queryMenuTree, query as queryUsers } from '@/services/user';
import { setAuthority } from '@/utils/authority';

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

export interface UserModelState {
  currentUser?: CurrentUser;
  menus?: MenuParam[];
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetch: Effect;
    fetchCurrent: Effect;
    fetchMenuTree: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    saveMenus: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
    menus: [],
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
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
            authority.push(<string>data[i].name)
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

export default UserModel;
