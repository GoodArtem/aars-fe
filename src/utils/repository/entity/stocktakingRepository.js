import Vue from 'vue';
import { STOCKTAKING } from '../../../plugins/axios';
import { CREATE } from '../../../plugins/axios';
import { UPDATE } from '../../../plugins/axios';
import { DELETE } from '../../../plugins/axios';
import { GET_BY_CONDITION } from '../../../plugins/axios';
import { GET_BY_INVENTORY_CARD_ID } from '../../../plugins/axios';

export default {
  getById(id) {
    let promise = Vue.axios.get(`${STOCKTAKING}/${id}`);
    return promise;
  },
  create(payload) {
    let promise = Vue.axios.post(`${STOCKTAKING}${CREATE}`, payload);
    return promise;
  },
  update(payload) {
    let promise = Vue.axios.post(`${STOCKTAKING}${UPDATE}`, payload);
    return promise;
  },
  delete(payload) {
    let promise = Vue.axios.post(`${STOCKTAKING}${DELETE}`, payload);
    return promise;
  },
  getByCondtition(payload) {
    let promise = Vue.axios.post(`${STOCKTAKING}${GET_BY_CONDITION}`, payload);
    return promise;
  },
  getByInventoryCardId(id) {
    let promise = Vue.axios.get(
      `${STOCKTAKING}${GET_BY_INVENTORY_CARD_ID}/${id}`
    );
    return promise;
  }
};
