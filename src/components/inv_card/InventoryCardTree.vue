<template>
  <v-treeview
    :active.sync="active"
    :items="items"
    :load-children="fetchItems"
    :open.sync="open"
    dense
    return-object
    activatable
    color="info"
    transition
    >
    <template v-slot:prepend="{ item }">
      <v-icon v-if="item.isInventoryCard && item.state === 0">mdi-card-bulleted-outline</v-icon>
      <v-icon v-else-if="item.isInventoryCard && item.state === 1">mdi-card-bulleted-off-outline</v-icon>
      <v-icon v-else-if="item.isDirectory">mdi-folder-open-outline</v-icon>
      <v-icon v-else-if="item.isTheme">mdi-format-list-checks</v-icon>
      <v-icon v-else-if="item.isRootObject">mdi-format-list-checkbox</v-icon>
    </template>
  </v-treeview>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'InventoryCardTree',
  created: function () {
    this.prevOpened.push(...this.open)
  },
  mounted: function () {
    this.onExpandCollapseNode(this.prevOpened)
  },
  data: () => ({
    prevOpened: []
  }),
  computed: {
    ...mapGetters('invCardTree', {
      items: 'getItems',
      getterOpen: 'getOpenItems',
      getterActive: 'getActiveItems',
      updIdx: 'getUpdIdx'
    }),
    open: {
      get () {
        return this.getterOpen
      },
      set (value) {
        this.onExpandCollapseNode(value)
      }
    },
    active: {
      get () {
        return this.getterActive
      },
      set (value) {
        this.onChangeSelection(value)
      }
    }
  },
  methods: {
    ...mapActions('invCardTree', [
      'loadItems',
      'onExpandCollapseNode',
      'onChangeSelection'
    ]),
    async fetchItems (item) {
      return this.loadItems(item)
    }
  }
}
</script>
