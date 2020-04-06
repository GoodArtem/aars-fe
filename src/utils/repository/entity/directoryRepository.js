import Vue from 'vue';
import { DIRECTORY } from '../../../plugins/axios';

import { CREATE } from '../../../plugins/axios';
import { UPDATE } from '../../../plugins/axios';
import { DELETE } from '../../../plugins/axios';
import { GET_BY_CONDITION } from '../../../plugins/axios';
import { GET_BY_THEME_ID } from '../../../plugins/axios';
import { GET_BY_DIRECTORY_ID } from '../../../plugins/axios';

export default {
  getById(id) {
    let promise = Vue.axios.get(`${DIRECTORY}/${id}`);
    return promise;
  },
  create(payload) {
    let promise = Vue.axios.post(`${DIRECTORY}${CREATE}`, payload);
    return promise;
  },
  update(payload) {
    let promise = Vue.axios.post(`${DIRECTORY}${UPDATE}`, payload);
    return promise;
  },
  delete(payload) {
    let promise = Vue.axios.post(`${DIRECTORY}${DELETE}`, payload);
    return promise;
  },
  getByCondtition(payload) {
    let promise = Vue.axios.post(`${DIRECTORY}${GET_BY_CONDITION}`, payload);
    return promise;
  },
  getByThemeId(id) {
    let promise = Vue.axios.get(`${DIRECTORY}${GET_BY_THEME_ID}/${id}`);
    return promise;
  },
  getByDirectoryId(id) {
    let promise = Vue.axios.get(`${DIRECTORY}${GET_BY_DIRECTORY_ID}/${id}`);
    return promise;
  },
  getPathToTheme(id) {
    let promise = Vue.axios.get(`${DIRECTORY}/getPathToTheme/${id}`);
    return promise;
  }
};
