import Vue from 'vue';
import { SUBSCRIBER } from '../../../plugins/axios';
import { CREATE } from '../../../plugins/axios';
import { UPDATE } from '../../../plugins/axios';
import { DELETE } from '../../../plugins/axios';
import { GET_BY_CONDITION } from '../../../plugins/axios';
import { GET_BY_THEME_ID } from '../../../plugins/axios';

export default {
  getById(id) {
    let promise = Vue.axios.get(`${SUBSCRIBER}/${id}`);
    return promise;
  },
  create(payload) {
    let promise = Vue.axios.post(`${SUBSCRIBER}${CREATE}`, payload);
    return promise;
  },
  update(payload) {
    let promise = Vue.axios.post(`${SUBSCRIBER}${UPDATE}`, payload);
    return promise;
  },
  delete(payload) {
    let promise = Vue.axios.post(`${SUBSCRIBER}${DELETE}`, payload);
    return promise;
  },
  getByCondtition(payload) {
    let promise = Vue.axios.post(`${SUBSCRIBER}${GET_BY_CONDITION}`, payload);
    return promise;
  },
  getByThemeId(id) {
    let promise = Vue.axios.get(`${SUBSCRIBER}${GET_BY_THEME_ID}/${id}`);
    return promise;
  }
};
