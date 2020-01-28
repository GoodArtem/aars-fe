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
            <ThemeCreateEditDialog v-if="isRootObject"></ThemeCreateEditDialog>
            <v-btn v-if="isRootObject" icon>
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
            <ThemeCreateEditDialog
              v-if="isTheme"
              btn-icon="mdi-pencil"
              v-bind:selected-theme="selectedItem"
            ></ThemeCreateEditDialog>
            <ThemeDeleteDialog
              v-if="isTheme"
              v-bind:selected-theme="selectedItem"
            ></ThemeDeleteDialog>
            <DirectoryCreateEditDialog
              v-if="isDirectory"
              v-bind:parent-directory="selectedItem"
            ></DirectoryCreateEditDialog>
            <DirectoryCreateEditDialog
              v-if="isSimpleDirectory"
              btn-icon="mdi-pencil"
              v-bind:selected-directory="selectedItem"
            ></DirectoryCreateEditDialog>
            <DirectoryDeleteDialog
              v-if="isSimpleDirectory"
              v-bind:selected-directory="selectedItem"
            ></DirectoryDeleteDialog>
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
import ThemeCreateEditDialog from '@/components/dialogs/theme/ThemeCreateEditDialog.vue'
import ThemeDeleteDialog from '@/components/dialogs/theme/ThemeDeleteDialog.vue'
import DirectoryCreateEditDialog from '@/components/dialogs/directory/DirectoryCreateEditDialog.vue'
import DirectoryDeleteDialog from '@/components/dialogs/directory/DirectoryDeleteDialog.vue'

export default {
  name: 'InventoryCardView',
  computed: {
    ...mapGetters('invCardTree', {
      selectedItem: 'getSelectedItem'
    }),
    titleSelectedItem() {
      if (this.isRootObject) {
        return 'Архив инвентарных карточек'
      } else {
        return this.selectedItem.name
      }
    },
    isRootObject() {
      return !this.selectedItem || this.selectedItem.isRootObject
    },
    isTheme() {
      return this.selectedItem && this.selectedItem.isTheme
    },
    isDirectory() {
      return this.selectedItem && this.selectedItem.isDirectory
    },
    isSimpleDirectory() {
      return this.isDirectory && this.selectedItem.directoryType === 0
    },
    isInventoryCard() {
      return this.selectedItem && this.selectedItem.isInventoryCard
    }
  },
  components: {
    InventoryCardTree,
    InventoryCardGeneral,
    ThemeCreateEditDialog,
    ThemeDeleteDialog,
    DirectoryCreateEditDialog,
    DirectoryDeleteDialog
  }
}
</script>
