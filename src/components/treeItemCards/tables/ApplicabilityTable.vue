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
        <ApplicabilityCreateEditDialog
          v-bind:all-items="items"
          v-bind:parent-item-id="selectedItem.id"
        ></ApplicabilityCreateEditDialog>
      </v-toolbar>
    </template>
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
    <template v-slot:item.actions="{ item }">
      <ApplicabilityCreateEditDialog
        v-bind:all-items="items"
        v-bind:selected-item="item"
        v-bind:parent-item-id="selectedItem.id"
        btn-icon="mdi-pencil"
        dialog-title="Редактировать"
      ></ApplicabilityCreateEditDialog>
      <ApplicabilityDeleteDialog
        v-bind:all-items="items"
        v-bind:selected-item="item"
      ></ApplicabilityDeleteDialog>
    </template>
    <template v-slot:no-data>
      Нет данных
    </template>
  </v-data-table>
</template>

<script>
import { mapGetters } from 'vuex';
import { RepositoryFactory } from '../../../utils/repository/RepositoryFactory';
import { EventBus } from '@/plugins/event-bus';
import ApplicabilityCreateEditDialog from '@/components/dialogs/applicability/ApplicabilityCreateEditDialog.vue';
import ApplicabilityDeleteDialog from '@/components/dialogs/applicability/ApplicabilityDeleteDialog.vue';

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
      { text: 'Шифр', value: 'cipher' },
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
        EventBus.$emit('global-error', err);
      }
    }
  },
  components: {
    ApplicabilityCreateEditDialog,
    ApplicabilityDeleteDialog
  }
};
</script>
