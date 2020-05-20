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
        <StocktakingCreateEditDialog
          v-bind:all-items="items"
          v-bind:parent-item-id="selectedItem.id"
          @onUpdateData="fetchData"
        ></StocktakingCreateEditDialog>
      </v-toolbar>
    </template>
    <template v-slot:item.dateChanging="{ item }">
      {{
        new Date(item.dateChanging)
          .toISOString()
          .substr(0, 10)
          .split('-')
          .reverse()
          .join('.')
      }}
    </template>
    <template v-slot:item.actions="{ item }">
      <StocktakingCreateEditDialog
        v-bind:all-items="items"
        v-bind:selected-item="item"
        v-bind:parent-item-id="selectedItem.id"
        @onUpdateData="fetchData"
        btn-icon="mdi-pencil"
        dialog-title="Редактировать"
      ></StocktakingCreateEditDialog>
      <StocktakingDeleteDialog
        v-bind:all-items="items"
        v-bind:selected-item="item"
        @onUpdateData="fetchData"
      ></StocktakingDeleteDialog>
    </template>
    <template v-slot:no-data>
      Нет данных
    </template>
  </v-data-table>
</template>

<script>
import { mapGetters } from 'vuex';
import { RepositoryFactory } from '../../../utils/repository/RepositoryFactory';
import StocktakingCreateEditDialog from '@/components/dialogs/stocktaking/StocktakingCreateEditDialog.vue';
import StocktakingDeleteDialog from '@/components/dialogs/stocktaking/StocktakingDeleteDialog.vue';

const repository = RepositoryFactory.get('stocktaking');

export default {
  name: 'StocktakingTable',
  data: () => ({
    loading: true,
    items: [],
    headers: [
      { text: 'Номер изменения', value: 'changing' },
      { text: 'Номер документа', value: 'docNumber' },
      { text: 'Дата внесения', value: 'dateChanging' },
      { text: 'Листы', value: 'changedSheets' },
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
    StocktakingCreateEditDialog,
    StocktakingDeleteDialog
  }
};
</script>
