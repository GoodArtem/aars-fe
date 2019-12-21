<template>
  <v-container>
    <v-row dense>
      <v-col cols="4">
        <v-card height="90vh" style="overflow-x:auto; overflow-y:auto">
            <InventoryCardTree></InventoryCardTree>
        </v-card>
      </v-col>
      <v-col cols="8">
        <v-card height="90vh">
          <v-toolbar color="info" dark>
            <v-toolbar-title>{{ titleSelectedItem }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <ThemeDialog></ThemeDialog>
            <ThemeDialog  v-if="isTheme" btn-icon="mdi-pencil" v-bind:selected-theme="selectedItem"></ThemeDialog>
            <v-btn icon>
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
          </v-toolbar>
          <InventoryCardGeneral v-if="isInventoryCard"></InventoryCardGeneral>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import InventoryCardTree from '@/components/inv_card/InventoryCardTree.vue'
import InventoryCardGeneral from '@/components/inv_card/InventoryCardGeneral.vue'
import ThemeDialog from '@/components/dialogs/ThemeDialog.vue'

export default {
  name: 'InventoryCardView',
  computed: {
    ...mapGetters('invCardTree', {
      selectedItem: 'getSelectedItem'
    }),
    titleSelectedItem () {
      if (this.isRootObject) {
        return 'Архив инвентарных карточек'
      } else {
        return this.selectedItem.name
      }
    },
    isRootObject () {
      return !this.selectedItem || this.selectedItem.isRootObject
    },
    isTheme () {
      return this.selectedItem && this.selectedItem.isTheme
    },
    isDirectory () {
      return this.selectedItem && this.selectedItem.isDirectory
    },
    isInventoryCard () {
      return this.selectedItem && this.selectedItem.isInventoryCard
    }
  },
  components: {
    InventoryCardTree,
    InventoryCardGeneral,
    ThemeDialog
  }
}
</script>
