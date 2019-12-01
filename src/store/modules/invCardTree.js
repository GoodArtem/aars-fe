const state = {
  selectedItem: undefined
}

// getters
const getters = {
  getSelectedItem: (state, getters, rootState) => {
    return state.selectedItem
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
