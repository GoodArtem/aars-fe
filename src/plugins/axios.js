'use strict';

import Vue from 'vue';
import axios from 'axios';

export const APPLICABILITY = '/applicability';
export const COPIES_INFO = '/copiesInfo';
export const DIRECTORY = '/directory';
export const EMPLOYEE = '/employee';
export const FORMAT = '/format';
export const INVENTORY_CARD = '/inventoryCard';
export const ONCE_ONLY_ISSUE = '/onceOnlyIssue';
export const STOCKTAKING = '/stocktaking';
export const SUBSCRIBER = '/subscriber';
export const THEME = '/theme';

export const ALL = '/all';
export const CREATE = '/create';
export const UPDATE = '/update';
export const DELETE = '/delete';

export const GET_BY_CONDITION = '/getByCondition';
export const GET_BY_INVENTORY_CARD_ID = '/getByInventoryCard';
export const GET_BY_THEME_ID = '/getByTheme';
export const GET_BY_DIRECTORY_ID = '/getByDirectory';

const backendServiceUrl = 'http://localhost:8081';

let config = {
  baseURL: backendServiceUrl,
  timeout: 8 * 1000
};

const _axios = axios.create(config);

Plugin.install = function(Vue, options) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      }
    },
    $axios: {
      get() {
        return _axios;
      }
    }
  });
};

Vue.use(Plugin);

export default Plugin;
