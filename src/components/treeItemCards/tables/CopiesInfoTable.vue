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
        <CopiesInfoCreateEditDialog
          v-bind:all-items="items"
          v-bind:parent-item-id="selectedItem.id"
        ></CopiesInfoCreateEditDialog>
      </v-toolbar>
    </template>
    <template v-slot:item.copyDate="{ item }">
      {{
        new Date(item.copyDate)
          .toISOString()
          .substr(0, 10)
          .split('-')
          .reverse()
          .join('.')
      }}
    </template>
    <template v-slot:item.actions="{ item }">
      <CopiesInfoCreateEditDialog
        v-bind:all-items="items"
        v-bind:selected-item="item"
        v-bind:parent-item-id="selectedItem.id"
        btn-icon="mdi-pencil"
        dialog-title="Редактировать"
      ></CopiesInfoCreateEditDialog>
      <CopiesInfoDeleteDialog
        v-bind:all-items="items"
        v-bind:selected-item="item"
      ></CopiesInfoDeleteDialog>
    </template>
    <template v-slot:no-data>
      Нет данных
    </template>
  </v-data-table>
</template>

<script>
import { mapGetters } from 'vuex';
import { RepositoryFactory } from '../../../utils/repository/RepositoryFactory';
import CopiesInfoCreateEditDialog from '@/components/dialogs/copiesInfo/CopiesInfoCreateEditDialog.vue';
import CopiesInfoDeleteDialog from '@/components/dialogs/copiesInfo/CopiesInfoDeleteDialog.vue';

const repository = RepositoryFactory.get('copiesInfo');

export default {
  name: 'CopiesInfoTable',
  data: () => ({
    loading: true,
    items: [],
    headers: [
      { text: 'Дата', value: 'copyDate' },
      { text: 'Обозначение', value: 'designation' },
      { text: 'Поступило', value: 'receivedCopy' },
      { text: 'Списано', value: 'annulledCopy' },
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
    CopiesInfoCreateEditDialog,
    CopiesInfoDeleteDialog
  }
};
</script>
