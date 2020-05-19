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
export const GET_NEXT_SEQUENCE_INVENTORY_NUMBER =
  '/getNextSequenceInventoryNumber';

const backendServiceUrl = window.route['backendUrlAddress'];

let config = {
  baseURL: backendServiceUrl,
  timeout: 8 * 1000
};

const _axios = axios.create(config);

_axios.interceptors.response.use(
  function(response) {
    // Do something with response data
    return response;
  },
  function(error) {
    // Do something with response error
    if (
      error.request.responseType === 'blob' &&
      error.response &&
      error.response.data instanceof Blob &&
      error.response.data.type &&
      error.response.data.type.toLowerCase().indexOf('json') != -1
    ) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = () => {
          error.response.data = JSON.parse(reader.result);
          resolve(
            Promise.reject({
              message: error.response.data.errors[0].detail
                ? `${error.response.data.errors[0].error}: ${error.response.data.errors[0].detail}`
                : `${error.response.data.errors[0].error}: ${error.response.data.errors[0].message}`,
              status: `${error.response.data.errors[0].status}`,
              debugDetail: `${error.response.data.errors[0].debugDetail}`
            })
          );
        };

        reader.onerror = () => {
          reject(error);
        };

        reader.readAsText(error.response.data);
      });
    }
    if (
      error.response &&
      error.response.data &&
      error.response.data.errors &&
      error.response.data.errors.length > 0
    ) {
      return Promise.reject({
        message: error.response.data.errors[0].detail
          ? `${error.response.data.errors[0].error}: ${error.response.data.errors[0].detail}`
          : `${error.response.data.errors[0].error}: ${error.response.data.errors[0].message}`,
        status: `${error.response.data.errors[0].status}`,
        debugDetail: `${error.response.data.errors[0].debugDetail}`
      });
    }
    return Promise.reject({
      message: error
    });
  }
);

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
