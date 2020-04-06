import Vue from 'vue';
import { RepositoryFactory } from '../../utils/repository/RepositoryFactory';
import treeUtil from '../../utils/treeUtil';

const state = {
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
};

// getters
const getters = {
  getSelectedItem: (state, getters, rootState) => {
    if (!state.active.length) return undefined;
    const item = state.active[0];
    return item;
  },
  getItems: (state, getters, rootState) => {
    return state.items;
  },
  getOpenItems: (state, getters, rootState) => {
    return state.open;
  },
  getActiveItems: (state, getters, rootState) => {
    return state.active;
  }
};

// actions
const actions = {
  onExpandCollapseNode({ commit, state }, items) {
    commit('setOpenItems', items);
  },
  onChangeSelection({ commit, state }, items) {
    commit('setActiveItems', items);
  },
  openBranchAndSetActive({ commit, state }, payload) {
    let timerId = setTimeout(function run() {
      if (!state.isItemsLoading) {
        const itemForOpening = payload.branchPath.pop();
        if (itemForOpening !== undefined) {
          commit('addOpenItem', itemForOpening);
          timerId = setTimeout(run, 50);
        } else {
          const activeArray = [payload.active];
          commit('updateOrAddChildIfNeeded', payload.active);
          commit('setActiveItems', activeArray);
          clearTimeout(timerId);
        }
      } else {
        timerId = setTimeout(run, 50);
      }
    }, 1);
  },
  onDeleteItem({ commit, state }, item) {
    commit('deleteItem', item);
  },
  async loadItems({ commit, state }, item) {
    commit('setItemsLoading', true);
    if (item.isRootObject) {
      try {
        const response = await RepositoryFactory.get('theme').getAll();
        const childItems = response.data.map(element =>
          treeUtil.enrichTheme(element)
        );
        commit('setChildItems', { item: item, childItems: childItems });
      } catch (err) {
        console.warn(err);
      }
    } else if (item.isTheme) {
      try {
        const response = await RepositoryFactory.get('directory').getByThemeId(
          item.id
        );
        const childItems = response.data.map(element =>
          treeUtil.enrichDirectory(element)
        );
        commit('setChildItems', { item: item, childItems: childItems });
      } catch (err) {
        console.warn(err);
      }
    } else if (item.isDirectory) {
      try {
        const directoryResponse = await RepositoryFactory.get(
          'directory'
        ).getByDirectoryId(item.id);
        const childDirectories = directoryResponse.data.map(element =>
          treeUtil.enrichDirectory(element)
        );

        const invCardResponse = await RepositoryFactory.get(
          'inventoryCard'
        ).getByDirectoryId(item.id);
        const childCards = invCardResponse.data.map(element =>
          treeUtil.enrichInvCard(element)
        );

        const childItems = childDirectories.concat(childCards);
        commit('setChildItems', { item: item, childItems: childItems });
      } catch (err) {
        console.warn(err);
      }
    }
    commit('setItemsLoading', false);
  }
};

// mutations
const mutations = {
  setOpenItems(state, items) {
    Vue.set(state, 'open', items);
  },
  addOpenItem(state, item) {
    Vue.set(state.open, state.open.length, { id: item });
  },
  updateOrAddChildIfNeeded(state, item) {
    if (item.isTheme) {
      const rootChildren = state.items[0].children;
      if (rootChildren) {
        const itemIndex = treeUtil.indexOfTheme(rootChildren, item.id);
        if (itemIndex === -1) {
          Vue.set(rootChildren, rootChildren.length, item);
        } else {
          Vue.set(rootChildren, itemIndex, item);
        }
      }
    } else if (item.isDirectory || item.isInventoryCard) {
      const themeForUpdate = state.items[0].children.find(
        cur => cur.id === item.themeId
      );
      const directoryForUpdate = treeUtil.findDirectory(
        item.isDirectory ? item.parentId : item.directoryId,
        themeForUpdate.children
      );
      const parentChildren = directoryForUpdate
        ? directoryForUpdate.children
        : undefined;
      if (parentChildren) {
        const itemIndex = treeUtil.idndexOfDirectoryOrInvCard(
          parentChildren,
          item.id,
          item.isDirectory
        );
        if (itemIndex === -1) {
          Vue.set(parentChildren, parentChildren.length, item);
        } else {
          Vue.set(parentChildren, itemIndex, item);
        }
      }
    }
  },
  deleteItem(state, item) {
    if (item.isTheme) {
      const rootChildren = state.items[0].children;
      if (rootChildren) {
        const itemIndex = treeUtil.indexOfTheme(rootChildren, item.id);
        if (itemIndex !== -1) {
          Vue.delete(rootChildren, itemIndex);
          Vue.set(state, 'active', state.items);
        }
      }
    } else if (item.isDirectory || item.isInventoryCard) {
      const themeForUpdate = state.items[0].children.find(
        cur => cur.id === item.themeId
      );
      const directoryForUpdate = treeUtil.findDirectory(
        item.isDirectory ? item.parentId : item.directoryId,
        themeForUpdate.children
      );
      const parentChildren = directoryForUpdate
        ? directoryForUpdate.children
        : undefined;
      if (parentChildren) {
        const itemIndex = treeUtil.idndexOfDirectoryOrInvCard(
          parentChildren,
          item.id,
          item.isDirectory
        );
        if (itemIndex !== -1) {
          Vue.delete(parentChildren, itemIndex);
          Vue.set(state, 'active', [directoryForUpdate]);
        }
      }
    }
  },
  setActiveItems(state, items) {
    Vue.set(state, 'active', items);
  },
  setItemsLoading(state, isLoading) {
    Vue.set(state, 'isItemsLoading', isLoading);
  },
  setChildItems(state, payload) {
    if (payload.item.isRootObject) {
      Vue.set(state.items[0], 'children', payload.childItems);
    } else if (payload.item.isTheme) {
      const themeForUpdate = state.items[0].children.find(
        cur => cur.id === payload.item.id
      );
      Vue.set(themeForUpdate, 'children', payload.childItems);
    } else if (payload.item.isDirectory) {
      const themeForUpdate = state.items[0].children.find(
        cur => cur.id === payload.item.themeId
      );
      const directoryForUpdate = treeUtil.findDirectory(
        payload.item.id,
        themeForUpdate.children
      );
      Vue.set(directoryForUpdate, 'children', payload.childItems);
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
