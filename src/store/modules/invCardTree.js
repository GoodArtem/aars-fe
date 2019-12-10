const state = {
  selectedItem: undefined,
  backendAddress: window.location.protocol + '//' + window.location.hostname + ':8081'
}

// getters
const getters = {
  getSelectedItem: (state, getters, rootState) => {
    return state.selectedItem
  },
  getBackendAddress: (state, getters, rootState) => {
    return state.backendAddress
  }
}

// actions
const actions = {
  onSelectItem ({ commit, state }, item) {
    commit('setSelectedItem', item)
  }
}

// mutations
const mutations = {
  setSelectedItem (state, item) {
    state.selectedItem = item
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
