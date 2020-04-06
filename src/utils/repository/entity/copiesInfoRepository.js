import Vue from 'vue';
import { COPIES_INFO } from '../../../plugins/axios';
import { CREATE } from '../../../plugins/axios';
import { UPDATE } from '../../../plugins/axios';
import { DELETE } from '../../../plugins/axios';
import { GET_BY_CONDITION } from '../../../plugins/axios';
import { GET_BY_INVENTORY_CARD_ID } from '../../../plugins/axios';

export default {
  getById(id) {
    let promise = Vue.axios.get(`${COPIES_INFO}/${id}`);
    return promise;
  },
  create(payload) {
    let promise = Vue.axios.post(`${COPIES_INFO}${CREATE}`, payload);
    return promise;
  },
  update(payload) {
    let promise = Vue.axios.post(`${COPIES_INFO}${UPDATE}`, payload);
    return promise;
  },
  delete(payload) {
    let promise = Vue.axios.post(`${COPIES_INFO}${DELETE}`, payload);
    return promise;
  },
  getByCondtition(payload) {
    let promise = Vue.axios.post(`${COPIES_INFO}${GET_BY_CONDITION}`, payload);
    return promise;
  },
  getByInventoryCardId(id) {
    let promise = Vue.axios.get(
      `${COPIES_INFO}${GET_BY_INVENTORY_CARD_ID}/${id}`
    );
    return promise;
  }
};
