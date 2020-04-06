import Vue from 'vue';
import { RepositoryFactory } from '../../utils/repository/RepositoryFactory';

const state = {
  formats: []
};

const getters = {
  getFormats: (state, getters, rootState) => {
    return state.formats;
  }
};

const actions = {
  async loadItems({ commit, state }, item) {
    try {
      const response = await RepositoryFactory.get('format').getAll();
      commit('setItems', response.data);
    } catch (err) {
      console.warn(err);
    }
  },
  async onCreateItem({ commit, state }, item) {
    try {
      const response = await RepositoryFactory.get('format').create(item);
      commit('createItem', response.data);
    } catch (err) {
      console.warn(err);
    }
  },
  async onUpdateItem({ commit, state }, payload) {
    try {
      const response = await RepositoryFactory.get('format').update(
        payload.item
      );
      payload.item = response.data;
      commit('updateItem', payload);
    } catch (err) {
      console.warn(err);
    }
  },
  async onDeleteItem({ commit, state }, idx) {
    try {
      const response = await RepositoryFactory.get('format').delete(
        state.formats[idx]
      );
      commit('deleteItem', idx);
    } catch (err) {
      console.warn(err);
    }
  }
};

const mutations = {
  setItems(state, items) {
    Vue.set(state, 'formats', items);
  },
  createItem(state, item) {
    const formats = state.formats;
    Vue.set(formats, formats.length, item);
  },
  updateItem(state, payload) {
    const formats = state.formats;
    Vue.set(formats, payload.idx, payload.item);
  },
  deleteItem(state, idx) {
    const formats = state.formats;
    Vue.delete(formats, idx);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
