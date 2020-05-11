<template>
  <v-toolbar-items>
    <InventoryCardCreateEditDialog
      v-bind:parent-directory="selectedItem"
    ></InventoryCardCreateEditDialog>
    <v-divider class="mx-4" dark vertical></v-divider>
    <DirectoryCreateEditDialog
      v-bind:parent-directory="selectedItem"
    ></DirectoryCreateEditDialog>
    <template v-if="isSimpleDirectory">
      <DirectoryCreateEditDialog
        btn-icon="mdi-pencil"
        v-bind:selected-directory="selectedItem"
      ></DirectoryCreateEditDialog>
      <DirectoryDeleteDialog
        v-bind:selected-directory="selectedItem"
      ></DirectoryDeleteDialog>
    </template>
  </v-toolbar-items>
</template>

<script>
import DirectoryCreateEditDialog from '../dialogs/directory/DirectoryCreateEditDialog.vue';
import DirectoryDeleteDialog from '../dialogs/directory/DirectoryDeleteDialog.vue';
import InventoryCardCreateEditDialog from '../dialogs/inventoryCard/InventoryCardCreateEditDialog.vue';

export default {
  name: 'DirectoryToolbarItems',
  props: {
    selectedItem: {
      required: true,
      type: Object
    }
  },
  computed: {
    isSimpleDirectory() {
      return this.selectedItem.directoryType === 0;
    }
  },
  components: {
    DirectoryCreateEditDialog,
    DirectoryDeleteDialog,
    InventoryCardCreateEditDialog
  }
};
</script>
