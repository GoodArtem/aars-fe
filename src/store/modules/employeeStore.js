import Vue from 'vue';
import { RepositoryFactory } from '../../utils/repository/RepositoryFactory';
import { EventBus } from '../../plugins/event-bus';

const state = {
  employees: []
};

const getters = {
  getEmployees: (state, getters, rootState) => {
    return state.employees;
  }
};

const actions = {
  async loadItems({ commit, state }, item) {
    try {
      const response = await RepositoryFactory.get('employee').getAll();
      commit('setItems', response.data);
    } catch (err) {
      EventBus.$emit('global-error', err);
    }
  },
  async onCreateItem({ commit, state }, item) {
    try {
      const response = await RepositoryFactory.get('employee').create(item);
      commit('createItem', response.data);
    } catch (err) {
      EventBus.$emit('global-error', err);
    }
  },
  async onUpdateItem({ commit, state }, payload) {
    try {
      const response = await RepositoryFactory.get('employee').update(
        payload.item
      );
      payload.item = response.data;
      commit('updateItem', payload);
    } catch (err) {
      EventBus.$emit('global-error', err);
    }
  },
  async onDeleteItem({ commit, state }, idx) {
    try {
      const response = await RepositoryFactory.get('employee').delete(
        state.employees[idx]
      );
      commit('deleteItem', idx);
    } catch (err) {
      EventBus.$emit('global-error', err);
    }
  }
};

const mutations = {
  setItems(state, items) {
    Vue.set(state, 'employees', items);
  },
  createItem(state, item) {
    const employees = state.employees;
    Vue.set(employees, employees.length, item);
  },
  updateItem(state, payload) {
    const employees = state.employees;
    Vue.set(employees, payload.idx, payload.item);
  },
  deleteItem(state, idx) {
    const employees = state.employees;
    Vue.delete(employees, idx);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
