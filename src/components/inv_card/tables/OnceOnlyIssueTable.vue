<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :loading="loading"
    :items-per-page="-1"
    dense
    hide-default-footer
    fixed-header
    height="calc(100vh - 489px)"
    locale="ru"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar>
        <v-spacer></v-spacer>
        <OnceOnlyIssueCreateEditDialog
          v-bind:all-items="items"
          v-bind:parent-item-id="selectedItem.id"
        ></OnceOnlyIssueCreateEditDialog>
      </v-toolbar>
    </template>
    <template v-slot:item.issueDate="{ item }">
      {{
        new Date(item.issueDate)
          .toISOString()
          .substr(0, 10)
          .split('-')
          .reverse()
          .join('.')
      }}
    </template>
    <template v-slot:item.actions="{ item }">
      <OnceOnlyIssueCreateEditDialog
        v-bind:all-items="items"
        v-bind:selected-item="item"
        v-bind:parent-item-id="selectedItem.id"
        btn-icon="mdi-pencil"
        dialog-title="Редактировать"
      ></OnceOnlyIssueCreateEditDialog>
      <OnceOnlyIssueDeleteDialog
        v-bind:all-items="items"
        v-bind:selected-item="item"
      ></OnceOnlyIssueDeleteDialog>
    </template>
    <template v-slot:no-data>
      Нет данных
    </template>
  </v-data-table>
</template>

<script>
import { mapGetters } from 'vuex';
import { RepositoryFactory } from '../../../utils/repository/RepositoryFactory';
import OnceOnlyIssueCreateEditDialog from '@/components/dialogs/onceOnlyIssue/OnceOnlyIssueCreateEditDialog.vue';
import OnceOnlyIssueDeleteDialog from '@/components/dialogs/onceOnlyIssue/OnceOnlyIssueDeleteDialog.vue';

const repository = RepositoryFactory.get('onceOnlyIssue');

export default {
  name: 'OnceOnlyIssueTable',
  data: () => ({
    loading: true,
    items: [],
    headers: [
      { text: 'Кому', value: 'toWhom' },
      { text: 'Дата', value: 'issueDate' },
      { text: 'Основание', value: 'designation' },
      { text: 'Кол. экз.', value: 'exNumber' },
      {
        text: '',
        sortable: false,
        value: 'actions',
        width: '90px'
      }
    ]
  }),
  computed: {
    ...mapGetters('invCardTreeStore', {
      selectedItem: 'getSelectedItem'
    })
  },
  mounted() {
    this.fetchData();
  },
  watch: {
    selectedItem() {
      this.fetchData();
    }
  },
  methods: {
    async fetchData() {
      try {
        this.loading = true;
        const response = await repository.getByInventoryCardId(
          this.selectedItem.id
        );
        this.items = [...response.data];
        this.loading = false;
      } catch (err) {
        console.warn(err);
      }
    }
  },
  components: {
    OnceOnlyIssueCreateEditDialog,
    OnceOnlyIssueDeleteDialog
  }
};
</script>
