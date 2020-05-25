<template>
  <v-toolbar-items>
    <ThemeCreateEditDialog></ThemeCreateEditDialog>
    <InventoryCardSearchDialog></InventoryCardSearchDialog>
  </v-toolbar-items>
</template>

<script>
import ThemeCreateEditDialog from '../dialogs/theme/ThemeCreateEditDialog.vue';
import InventoryCardSearchDialog from '../dialogs/inventoryCard/InventoryCardSearchDialog.vue';

export default {
  name: 'RootToolbarItems',
  components: {
    ThemeCreateEditDialog,
    InventoryCardSearchDialog
  }
};
</script>
