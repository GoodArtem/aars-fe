<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :loading="loading"
    :items-per-page="-1"
    hide-default-footer
    class="elevation-1"
    locale="ru"
  >
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
    <template v-slot:no-data>
      Нет данных
    </template>
  </v-data-table>
</template>

<script>
import { mapGetters } from 'vuex';
import { RepositoryFactory } from '../../../utils/repository/RepositoryFactory';

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
      { text: 'Кол. экз.', value: 'exNumber' }
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
