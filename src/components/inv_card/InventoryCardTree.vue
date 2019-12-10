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
    open: [],
    items: [
      {
        id: '0',
        name: 'Темы',
        isRootObject: true,
        children: []
      }
    ]
  }),
  computed: {
    ...mapGetters('invCardTree', {
      backendAddress: 'getBackendAddress'
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
      'onSelectItem'
    ]),
    async fetchItems (item) {
      if (item.isRootObject) {
        try {
          const response = await fetch(this.backendAddress + '/theme/all')
          const json = await response.json()
          const childItems = json.map(element => {
            element.isTheme = true
            element.children = []
            element.name = element.themeName + ' ' + element.cipher
            return element
          })
          item.children.push(...childItems)
        } catch (err) {
          console.warn(err)
        }
      } else if (item.isTheme) {
        try {
          const response = await fetch(this.backendAddress + '/directory/getByTheme/' + item.id)
          const json = await response.json()
          const childItems = json.map(element => {
            element.isDirectory = true
            element.children = []
            element.name = element.directoryName
            return element
          })
          item.children.push(...childItems)
        } catch (err) {
          console.warn(err)
        }
      } else if (item.isDirectory) {
        try {
          const direcotryResponse = await fetch(this.backendAddress + '/directory/getByDirectory/' + item.id)
          const directoryJson = await direcotryResponse.json()
          const childDirectories = directoryJson.map(element => {
            element.isDirectory = true
            element.children = []
            element.name = element.directoryName
            return element
          })

          const invCardResponse = await fetch(this.backendAddress + '/inventoryCard/getByDirectory/' + item.id)
          const invCardJson = await invCardResponse.json()
          const childCards = invCardJson.map(element => {
            element.isInventoryCard = true
            element.name = element.cardName + ' ' + element.designation
            return element
          })

          const childItems = childDirectories.concat(childCards)
          item.children.push(...childItems)
        } catch (err) {
          console.warn(err)
        }
      }
    }
  }
}
</script>
