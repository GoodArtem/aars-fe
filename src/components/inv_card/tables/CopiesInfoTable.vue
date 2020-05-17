<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :loading="loading"
    :items-per-page="-1"
    hide-default-footer
    locale="ru"
    class="elevation-1"
  >
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
    <template v-slot:no-data>
      Нет данных
    </template>
  </v-data-table>
</template>

<script>
import { mapGetters } from 'vuex';
import { RepositoryFactory } from '../../../utils/repository/RepositoryFactory';

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
      { text: 'Списано', value: 'annulledCopy' }
    ]
  }),
  computed: {
    ...mapGetters('invCardTreeStore', {
      selectedItem: 'getSelectedItem',
      backendAddress: 'getBackendAddress'
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
  }
};
</script>
