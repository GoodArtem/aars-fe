<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :loading="loading"
    :items-per-page="-1"
    dense
    hide-default-footer
    fixed-header
    height="calc(100vh - 223px)"
    locale="ru"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar>
        <v-spacer></v-spacer>
        <SubscriberCreateEditDialog
          v-bind:all-items="items"
          v-bind:parent-item-id="selectedItem.id"
        ></SubscriberCreateEditDialog>
      </v-toolbar>
    </template>
    <template v-slot:item.subscribeDate="{ item }">
      {{
        new Date(item.subscribeDate)
          .toISOString()
          .substr(0, 10)
          .split('-')
          .reverse()
          .join('.')
      }}
    </template>
    <template v-slot:item.actions="{ item }">
      <SubscriberCreateEditDialog
        v-bind:all-items="items"
        v-bind:selected-item="item"
        v-bind:parent-item-id="selectedItem.id"
        btn-icon="mdi-pencil"
        dialog-title="Редактировать"
      ></SubscriberCreateEditDialog>
      <SubscriberDeleteDialog
        v-bind:all-items="items"
        v-bind:selected-item="item"
      ></SubscriberDeleteDialog>
    </template>
    <template v-slot:no-data>
      Нет данных
    </template>
  </v-data-table>
</template>

<script>
import { mapGetters } from 'vuex';
import { RepositoryFactory } from '../../../utils/repository/RepositoryFactory';
import SubscriberCreateEditDialog from '@/components/dialogs/subscriber/SubscriberCreateEditDialog.vue';
import SubscriberDeleteDialog from '@/components/dialogs/subscriber/SubscriberDeleteDialog.vue';

const repository = RepositoryFactory.get('subscriber');

export default {
  name: 'SubscriberTable',
  data: () => ({
    loading: true,
    items: [],
    noDataText: 'Нет данных',
    headers: [
      { text: 'Абонент', value: 'subscriberName' },
      { text: 'Дата', value: 'subscribeDate' },
      { text: 'Кол. экз.', value: 'exNumber' },
      { text: 'Обозначение', value: 'designation' },
      { text: 'Списано', value: 'annulled' },
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
        const response = await repository.getByThemeId(this.selectedItem.id);
        this.items = [...response.data];
        this.loading = false;
      } catch (err) {
        console.warn(err);
      }
    }
  },
  components: {
    SubscriberCreateEditDialog,
    SubscriberDeleteDialog
  }
};
</script>
