import Vue from 'vue';
import { ONCE_ONLY_ISSUE } from '../../../plugins/axios';
import { CREATE } from '../../../plugins/axios';
import { UPDATE } from '../../../plugins/axios';
import { DELETE } from '../../../plugins/axios';
import { GET_BY_CONDITION } from '../../../plugins/axios';
import { GET_BY_INVENTORY_CARD_ID } from '../../../plugins/axios';

export default {
  getById(id) {
    let promise = Vue.axios.get(`${ONCE_ONLY_ISSUE}/${id}`);
    return promise;
  },
  create(payload) {
    let promise = Vue.axios.post(`${ONCE_ONLY_ISSUE}${CREATE}`, payload);
    return promise;
  },
  update(payload) {
    let promise = Vue.axios.post(`${ONCE_ONLY_ISSUE}${UPDATE}`, payload);
    return promise;
  },
  delete(payload) {
    let promise = Vue.axios.post(`${ONCE_ONLY_ISSUE}${DELETE}`, payload);
    return promise;
  },
  getByCondtition(payload) {
    let promise = Vue.axios.post(
      `${ONCE_ONLY_ISSUE}${GET_BY_CONDITION}`,
      payload
    );
    return promise;
  },
  getByInventoryCardId(id) {
    let promise = Vue.axios.get(
      `${ONCE_ONLY_ISSUE}${GET_BY_INVENTORY_CARD_ID}/${id}`
    );
    return promise;
  }
};
