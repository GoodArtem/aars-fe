import Vue from 'vue';
import Vuex from 'vuex';
import invCardTreeStore from './modules/invCardTreeStore';
import employeeStore from './modules/employeeStore';
import formatStore from './modules/formatStore';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    invCardTreeStore,
    employeeStore,
    formatStore
  }
});
