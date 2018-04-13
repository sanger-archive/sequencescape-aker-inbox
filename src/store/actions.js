import axios from 'axios';
import { AUTH_SUCCESS, AUTH_ERROR } from './mutation-types';
import { AUTH_REQUEST, AUTH_LOGOUT } from './action-types';

const actions = {
  [AUTH_REQUEST]: ({ commit }, user) => new Promise((resolve, reject) => {
    commit(AUTH_REQUEST);
    axios({ url: 'http://localhost:3000/auth', data: user, method: 'POST' })
      .then((resp) => {
        console.log(resp);
        const token = resp.data.access_token;
        localStorage.setItem('user-token', token);
        axios.defaults.headers.common.Authorization = token;
        commit(AUTH_SUCCESS, token);
        // dispatch(USER_REQUEST);
        resolve(resp);
      })
      .catch((err) => {
        commit(AUTH_ERROR, err);
        localStorage.removeItem('user-token');
        reject(err);
      });
  }),
  [AUTH_LOGOUT]: ({ commit }) => new Promise((resolve) => {
    commit(AUTH_LOGOUT);
    localStorage.removeItem('user-token');
    resolve();
  }),
  // [USER_REQUEST]: ({ commit, dispatch }) => {
  //   commit(USER_REQUEST);
  //
  // }
};

export { actions as default };
