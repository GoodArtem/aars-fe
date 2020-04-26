<template>
  <v-data-table :headers="headers" :items="items" :loading="loading">
    <template v-slot:item.applicabilityDate="{ item }">
      {{
        new Date(item.applicabilityDate)
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

const repository = RepositoryFactory.get('applicability');

export default {
  name: 'ApplicabilityTable',
  data: () => ({
    loading: true,
    items: [],
    noDataText: 'Нет данных',
    headers: [
      { text: 'Дата', value: 'applicabilityDate' },
      { text: 'Обозначение', value: 'designation' },
      { text: 'Шифр', value: 'cipher' }
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
