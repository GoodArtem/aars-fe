<template>
      <v-treeview
        v-model="tree"
        :active.sync="active"
        :items="items"
        :load-children="fetchItems"
        :open.sync="open"
        return-object
        activatable
        color="info"
        transition
        >
        <template v-slot:prepend="{ item }">
          <v-icon v-if="item.isInventoryCard && item.state === 0">mdi-card-bulleted-outline</v-icon>
          <v-icon v-if="item.isInventoryCard && item.state === 1">mdi-card-bulleted-off-outline</v-icon>
          <v-icon v-else-if="item.isDirectory">mdi-folder-open-outline</v-icon>
          <v-icon v-else-if="item.isTheme">mdi-format-list-checks</v-icon>
          <v-icon v-else-if="item.isRootObject">mdi-format-list-checkbox</v-icon>
        </template>
      </v-treeview>
</template>

<script>
export default {
  data: () => ({
    tree: [],
    active: [],
    avatar: null,
    open: [],
    themes: [],
    directoryMap: {},
    inventoryCardMap: {},
    items: [
      {
        id: '0',
        name: 'Темы',
        isRootObject: true,
        children: []
      }
    ]
  }),
  watch: {
    themes (val) {
    },
    directoryMap (val) {
    },
    inventoryCardMap (val) {
    }
  },
  methods: {
    async fetchItems (item) {
      if (item.isRootObject) {
        try {
          const response = await fetch('http://localhost:8081/theme/all')
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
          const response = await fetch('http://localhost:8081/directory/getByTheme/' + item.id)
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
          const direcotryResponse = await fetch('http://localhost:8081/directory/getByDirectory/' + item.id)
          const directoryJson = await direcotryResponse.json()
          const childDirectories = directoryJson.map(element => {
            element.isDirectory = true
            element.children = []
            element.name = element.directoryName
            return element
          })

          const invCardResponse = await fetch('http://localhost:8081/inventoryCard/getByDirectory/' + item.id)
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
    },
    getName (item) {
      if (item.isTheme) {
        return item.themeName
      } else if (item.isDirectory) {
        return item.directoryName
      } else if (item.isInventoryCard) {
        return item.cardName
      }
      return ''
    },
    gatherChildren (item) {
      const childItems = []

      if (item.isTheme || item.isDirectory) {
        const childrenDir = this.directoryMap[item.id]
        if (childrenDir !== null && childrenDir !== undefined) {
          for (const directory of childrenDir) {
            childItems.push({
              ...directory,
              isDirectory: true,
              children: this.gatherChildren(directory),
              name: this.getName(directory)
            })
          }
        }
      }
      if (item.isDirectory) {
        const childCards = this.inventoryCardMap[item.id]
        if (childCards !== null && childCards !== undefined) {
          for (const card of childCards) {
            childItems.push({
              ...card,
              isInventoryCard: true,
              name: this.getName(card)
            })
          }
        }
      }

      return childItems
    }
  }
}
</script>
