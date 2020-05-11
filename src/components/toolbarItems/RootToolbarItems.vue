<template>
  <v-toolbar-items>
    <ThemeCreateEditDialog></ThemeCreateEditDialog>
    <v-btn icon>
      <v-icon>mdi-magnify</v-icon>
    </v-btn>
  </v-toolbar-items>
</template>

<script>
import ThemeCreateEditDialog from '../dialogs/theme/ThemeCreateEditDialog.vue';

export default {
  name: 'RootToolbarItems',
  components: {
    ThemeCreateEditDialog
  }
};
</script>
