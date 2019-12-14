import Vue from 'vue'
import treeUtil from '../../utils/treeUtil'

const state = {
  selectedItem: undefined,
  backendAddress: window.location.protocol + '//' + window.location.hostname + ':8081',
  items: [
    {
      id: '0',
      name: 'Темы',
      isRootObject: true,
      children: []
    }
  ]
}

// getters
const getters = {
  getSelectedItem: (state, getters, rootState) => {
    return state.selectedItem
  },
  getBackendAddress: (state, getters, rootState) => {
    return state.backendAddress
  },
  getItems: (state, getters, rootState) => {
    return state.items
  }
}

// actions
const actions = {
  onSelectItem ({ commit, state }, item) {
    commit('setSelectedItem', item)
  },
  async loadItems ({ commit, state }, item) {
    if (item.isRootObject) {
      try {
        const response = await fetch(state.backendAddress + '/theme/all')
        const json = await response.json()
        const childItems = json.map(element => {
          element.isTheme = true
          element.children = []
          element.name = element.themeName + ' ' + element.cipher
          return element
        })
        commit('setChildItems', { item: item, childItems: childItems })
      } catch (err) {
        console.warn(err)
      }
    } else if (item.isTheme) {
      try {
        const response = await fetch(state.backendAddress + '/directory/getByTheme/' + item.id)
        const json = await response.json()
        const childItems = json.map(element => {
          element.isDirectory = true
          element.children = []
          element.name = element.directoryName
          return element
        })
        commit('setChildItems', { item: item, childItems: childItems })
      } catch (err) {
        console.warn(err)
      }
    } else if (item.isDirectory) {
      try {
        const direcotryResponse = await fetch(state.backendAddress + '/directory/getByDirectory/' + item.id)
        const directoryJson = await direcotryResponse.json()
        const childDirectories = directoryJson.map(element => {
          element.isDirectory = true
          element.children = []
          element.name = element.directoryName
          return element
        })

        const invCardResponse = await fetch(state.backendAddress + '/inventoryCard/getByDirectory/' + item.id)
        const invCardJson = await invCardResponse.json()
        const childCards = invCardJson.map(element => {
          element.isInventoryCard = true
          element.name = element.cardName + ' ' + element.designation
          return element
        })

        const childItems = childDirectories.concat(childCards)
        commit('setChildItems', { item: item, childItems: childItems })
      } catch (err) {
        console.warn(err)
      }
    }
  }
}

// mutations
const mutations = {
  setSelectedItem (state, item) {
    state.selectedItem = item
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
