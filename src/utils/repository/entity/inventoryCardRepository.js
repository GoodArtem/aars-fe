import Vue from 'vue';
import { INVENTORY_CARD } from '../../../plugins/axios';
import { CREATE } from '../../../plugins/axios';
import { UPDATE } from '../../../plugins/axios';
import { DELETE } from '../../../plugins/axios';
import { GET_BY_CONDITION } from '../../../plugins/axios';
import { GET_BY_THEME_ID } from '../../../plugins/axios';
import { GET_BY_DIRECTORY_ID } from '../../../plugins/axios';
import { GET_NEXT_SEQUENCE_INVENTORY_NUMBER } from '../../../plugins/axios';

export default {
  getById(id) {
    let promise = Vue.axios.get(`${INVENTORY_CARD}/${id}`);
    return promise;
  },
  create(payload) {
    let promise = Vue.axios.post(`${INVENTORY_CARD}${CREATE}`, payload);
    return promise;
  },
  update(payload) {
    let promise = Vue.axios.post(`${INVENTORY_CARD}${UPDATE}`, payload);
    return promise;
  },
  delete(payload) {
    let promise = Vue.axios.post(`${INVENTORY_CARD}${DELETE}`, payload);
    return promise;
  },
  getByCondtition(payload) {
    let promise = Vue.axios.post(
      `${INVENTORY_CARD}${GET_BY_CONDITION}`,
      payload
    );
    return promise;
  },
  getByThemeId(id) {
    let promise = Vue.axios.get(`${INVENTORY_CARD}${GET_BY_THEME_ID}/${id}`);
    return promise;
  },
  getByDirectoryId(id) {
    let promise = Vue.axios.get(
      `${INVENTORY_CARD}${GET_BY_DIRECTORY_ID}/${id}`
    );
    return promise;
  },
  getNextSequenceInventoryNumber(parentDirectoryId) {
    let promise = Vue.axios.get(
      `${INVENTORY_CARD}${GET_NEXT_SEQUENCE_INVENTORY_NUMBER}?parentDirectoryId=${parentDirectoryId}`
    );
    return promise;
  },
  getPathToInventoryCard(inventoryCardId) {
    let promise = Vue.axios.get(
      `${INVENTORY_CARD}/getPathToInventoryCard?id=${inventoryCardId}`
    );
    return promise;
  },
  getTreeWithOpenedBranch(inventoryCardId) {
    let promise = Vue.axios.get(
      `${INVENTORY_CARD}/getTreeWithOpenedBranch?id=${inventoryCardId}`
    );
    return promise;
  },
  getAllByThemeIdWithLastChange(payload) {
    let promise = Vue.axios.get(
      `${INVENTORY_CARD}/getAllByThemeIdWithLastChange/${payload.themeId}?cardType=${payload.directoryType}`
    );
    return promise;
  },
  getAllByDirectoryIdWithLastChange(directoryId) {
    let promise = Vue.axios.get(
      `${INVENTORY_CARD}/getAllByDirectoryIdWithLastChange/${directoryId}`
    );
    return promise;
  },
  getInventoryCardBySearchString(searchString) {
    let promise = Vue.axios.get(
      `${INVENTORY_CARD}/getInventoryCardBySearchString?searchString=${searchString}`
    );
    return promise;
  },
  downloadPdf(payload) {
    let promise = Vue.axios({
      url: `${INVENTORY_CARD}/downloadPdf/${payload.id}`,
      method: 'GET',
      responseType: 'blob'
    }).then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${payload.name}.pdf`);
      document.body.appendChild(link);
      link.click();
    });
    return promise;
  }
};
