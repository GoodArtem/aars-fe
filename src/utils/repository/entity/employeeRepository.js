import Vue from 'vue';
import { EMPLOYEE } from '../../../plugins/axios';
import { ALL } from '../../../plugins/axios';
import { CREATE } from '../../../plugins/axios';
import { UPDATE } from '../../../plugins/axios';
import { DELETE } from '../../../plugins/axios';
import { GET_BY_CONDITION } from '../../../plugins/axios';

export default {
  getById(id) {
    let promise = Vue.axios.get(`${EMPLOYEE}/${id}`);
    return promise;
  },
  getAll(payload) {
    let promise = Vue.axios.get(`${EMPLOYEE}${ALL}`, payload);
    return promise;
  },
  create(payload) {
    let promise = Vue.axios.post(`${EMPLOYEE}${CREATE}`, payload);
    return promise;
  },
  update(payload) {
    let promise = Vue.axios.post(`${EMPLOYEE}${UPDATE}`, payload);
    return promise;
  },
  delete(payload) {
    let promise = Vue.axios.post(`${EMPLOYEE}${DELETE}`, payload);
    return promise;
  },
  getByCondtition(payload) {
    let promise = Vue.axios.post(`${EMPLOYEE}${GET_BY_CONDITION}`, payload);
    return promise;
  }
};
