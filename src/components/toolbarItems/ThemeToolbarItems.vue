<template>
  <v-toolbar-items>
    <ThemeCreateEditDialog
      btn-icon="mdi-pencil"
      v-bind:selected-theme="selectedItem"
    ></ThemeCreateEditDialog>
    <ThemeDeleteDialog v-bind:selected-theme="selectedItem"></ThemeDeleteDialog>
  </v-toolbar-items>
</template>

<script>
import ThemeCreateEditDialog from '../dialogs/theme/ThemeCreateEditDialog.vue';
import ThemeDeleteDialog from '../dialogs/theme/ThemeDeleteDialog.vue';

export default {
  name: 'ThemeToolbarItems',
  props: {
    selectedItem: {
      required: true,
      type: Object
    }
  },
  components: {
    ThemeCreateEditDialog,
    ThemeDeleteDialog
  }
};
</script>
