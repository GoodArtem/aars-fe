<template>
  <v-data-table
    :headers="headers"
    :items="formats"
    :items-per-page="-1"
    dense
    hide-default-footer
    fixed-header
    height="calc(100vh - 96px)"
    locale="ru"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar>
        <v-spacer></v-spacer>
        <FormatCreateEditDialog></FormatCreateEditDialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <FormatCreateEditDialog
        v-bind:selected-item="item"
        btn-icon="mdi-pencil"
        dialog-title="Редактировать"
      ></FormatCreateEditDialog>
      <FormatDeleteDialog v-bind:selected-item="item"></FormatDeleteDialog>
    </template>
  </v-data-table>
</template>

<script>
import { mapGetters } from 'vuex';
import FormatCreateEditDialog from '@/components/dialogs/format/FormatCreateEditDialog.vue';
import FormatDeleteDialog from '@/components/dialogs/format/FormatDeleteDialog.vue';

export default {
  name: 'FormatsTable',
  data: () => ({
    headers: [
      { text: 'Название формата', value: 'formatName' },
      {
        text: '',
        sortable: false,
        value: 'actions',
        width: '90px'
      }
    ]
  }),
  computed: {
    ...mapGetters('formatStore', {
      formats: 'getFormats'
    })
  },
  components: {
    FormatCreateEditDialog,
    FormatDeleteDialog
  }
};
</script>
