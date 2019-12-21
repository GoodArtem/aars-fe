import Vue from 'vue'
import treeUtil from '../../utils/treeUtil'

const state = {
  backendAddress: window.location.protocol + '//' + window.location.hostname + ':8081',
  items: [
    {
      id: '0',
      name: 'Темы',
      isRootObject: true,
      children: []
    }
  ],
  open: [],
  active: [],
  isItemsLoading: false
}

// getters
const getters = {
  getSelectedItem: (state, getters, rootState) => {
    if (!state.active.length) return undefined
    const item = state.active[0]
    return item
  },
  getBackendAddress: (state, getters, rootState) => {
    return state.backendAddress
  },
  getItems: (state, getters, rootState) => {
    return state.items
  },
  getOpenItems: (state, getters, rootState) => {
    return state.open
  },
  getActiveItems: (state, getters, rootState) => {
    return state.active
  }
}

// actions
const actions = {
  onExpandCollapseNode ({ commit, state }, items) {
    commit('setOpenItems', items)
  },
  onChangeSelection ({ commit, state }, items) {
    commit('setActiveItems', items)
  },
  openBranchAndSetActive ({ commit, state }, payload) {
    let timerId = setTimeout(function run () {
      if (!state.isItemsLoading) {
        const itemForOpening = payload.branchPath.shift()
        if (itemForOpening !== undefined) {
          commit('addOpenItem', itemForOpening)
          timerId = setTimeout(run, 50)
        } else {
          const activeArray = [payload.active]
          commit('updateOrAddChildIfNeeded', payload.active)
          commit('setActiveItems', activeArray)
          clearTimeout(timerId)
        }
      } else {
        timerId = setTimeout(run, 50)
      }
    }, 1)
  },
  async loadItems ({ commit, state }, item) {
    commit('setItemsLoading', true)
    if (item.isRootObject) {
      try {
        const response = await fetch(state.backendAddress + '/theme/all')
        const json = await response.json()
        const childItems = json.map(element => treeUtil.enrichTheme(element))
        commit('setChildItems', { item: item, childItems: childItems })
      } catch (err) {
        console.warn(err)
      }
    } else if (item.isTheme) {
      try {
        const response = await fetch(state.backendAddress + '/directory/getByTheme/' + item.id)
        const json = await response.json()
        const childItems = json.map(element => treeUtil.enrichDirectory(element))
        commit('setChildItems', { item: item, childItems: childItems })
      } catch (err) {
        console.warn(err)
      }
    } else if (item.isDirectory) {
      try {
        const direcotryResponse = await fetch(state.backendAddress + '/directory/getByDirectory/' + item.id)
        const directoryJson = await direcotryResponse.json()
        const childDirectories = directoryJson.map(element => treeUtil.enrichDirectory(element))

        const invCardResponse = await fetch(state.backendAddress + '/inventoryCard/getByDirectory/' + item.id)
        const invCardJson = await invCardResponse.json()
        const childCards = invCardJson.map(element => treeUtil.enrichInvCard(element))

        const childItems = childDirectories.concat(childCards)
        commit('setChildItems', { item: item, childItems: childItems })
      } catch (err) {
        console.warn(err)
      }
    }
    commit('setItemsLoading', false)
  }
}

// mutations
const mutations = {
  setOpenItems (state, items) {
    Vue.set(state, 'open', items)
  },
  addOpenItem (state, item) {
    Vue.set(state.open, state.open.length, { id: item })
  },
  updateOrAddChildIfNeeded (state, item) {
    if (item.isTheme) {
      const rootChildren = state.items[0].children
      if (rootChildren) {
        const itemIndex = treeUtil.indexOfTheme(rootChildren, item.id)
        if (itemIndex === -1) {
          Vue.set(rootChildren, rootChildren.length, item)
        } else {
          Vue.set(rootChildren, itemIndex, item)
        }
      }
    } else if (item.isDirectory || item.isInventoryCard) {
      const themeForUpdate = state.items[0].children.find(cur => cur.id === item.id)
      const directoryForUpdate = treeUtil.findDirectory(item, themeForUpdate.children)
      const parentChildren = directoryForUpdate ? directoryForUpdate.children : undefined
      if (parentChildren) {
        const itemIndex = treeUtil.idndexOfDirectoryOrInvCard(parentChildren, item.id, item.isDirectory)
        if (itemIndex === -1) {
          Vue.set(parentChildren, parentChildren.length, item)
        } else {
          Vue.set(parentChildren, itemIndex, item)
        }
      }
    }
  },
  setActiveItems (state, items) {
    Vue.set(state, 'active', items)
  },
  setItemsLoading (state, isLoading) {
    Vue.set(state, 'isItemsLoading', isLoading)
  },
  setChildItems (state, payload) {
    if (payload.item.isRootObject) {
      Vue.set(state.items[0], 'children', payload.childItems)
    } else if (payload.item.isTheme) {
      const themeForUpdate = state.items[0].children.find(cur => cur.id === payload.item.id)
      Vue.set(themeForUpdate, 'children', payload.childItems)
    } else if (payload.item.isDirectory) {
      const themeForUpdate = state.items[0].children.find(cur => cur.id === payload.item.themeId)
      const directoryForUpdate = treeUtil.findDirectory(payload.item, themeForUpdate.children)
      Vue.set(directoryForUpdate, 'children', payload.childItems)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
