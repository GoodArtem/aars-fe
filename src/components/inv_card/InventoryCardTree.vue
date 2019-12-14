<template>
  <v-treeview
    v-model="tree"
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
  data: () => ({
    tree: [],
    active: [],
    open: []
  }),
  computed: {
    ...mapGetters('invCardTree', {
      backendAddress: 'getBackendAddress',
      items: 'getItems'
    }),
    selectedItem () {
      if (!this.active.length) return undefined
      const item = this.active[0]
      return item
    }
  },
  watch: {
    selectedItem (newVal) {
      this.onSelectItem(newVal)
    }
  },
  methods: {
    ...mapActions('invCardTree', [
      'onSelectItem',
      'loadItems'
    ]),
    async fetchItems (item) {
      return this.loadItems(item)
    }
  }
}
</script>
