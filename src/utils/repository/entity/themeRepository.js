import Vue from 'vue';
import { THEME } from '../../../plugins/axios';
import { ALL } from '../../../plugins/axios';
import { CREATE } from '../../../plugins/axios';
import { UPDATE } from '../../../plugins/axios';
import { DELETE } from '../../../plugins/axios';
import { GET_BY_CONDITION } from '../../../plugins/axios';

export default {
  getById(id) {
    let promise = Vue.axios.get(`${THEME}/${id}`);
    return promise;
  },
  getAll(payload) {
    let promise = Vue.axios.get(`${THEME}${ALL}`, payload);
    return promise;
  },
  create(payload) {
    let promise = Vue.axios.post(`${THEME}${CREATE}`, payload);
    return promise;
  },
  update(payload) {
    let promise = Vue.axios.post(`${THEME}${UPDATE}`, payload);
    return promise;
  },
  delete(payload) {
    let promise = Vue.axios.post(`${THEME}${DELETE}`, payload);
    return promise;
  },
  getByCondtition(payload) {
    let promise = Vue.axios.post(`${THEME}${GET_BY_CONDITION}`, payload);
    return promise;
  }
};
