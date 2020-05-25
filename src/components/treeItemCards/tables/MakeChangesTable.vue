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
        <MakeChangesDialog
          v-bind:all-items="items"
          @onUpdateData="fetchData"
        ></MakeChangesDialog>
      </v-toolbar>
    </template>
    <template v-slot:item.state="{ item }">
      <v-icon v-if="item.state === 0">mdi-card-bulleted-outline</v-icon>
      <v-icon v-else-if="item.state === 1"
        >mdi-card-bulleted-off-outline</v-icon
      >
    </template>
    <template v-slot:item.dateLastChange="{ item }">
      {{
        item.dateLastChange
          ? new Date(item.dateLastChange)
              .toISOString()
              .substr(0, 10)
              .split('-')
              .reverse()
              .join('.')
          : ''
      }}
    </template>
    <template v-slot:item.changedSheets="props">
      <v-edit-dialog
        :return-value.sync="props.item.changedSheets"
        large
        persistent
        save-text="Сохранить"
        cancel-text="Отмена"
      >
        <div>{{ props.item.changedSheets }}</div>
        <template v-slot:input>
          <div class="mt-4 title">Внести изменения</div>
        </template>
        <template v-slot:input>
          <v-text-field
            v-model="props.item.changedSheets"
            label="Редактировать"
            single-line
            counter
            autofocus
          ></v-text-field>
        </template>
      </v-edit-dialog>
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
import MakeChangesDialog from '@/components/dialogs/directory/MakeChangesDialog.vue';

const repository = RepositoryFactory.get('inventoryCard');

export default {
  name: 'MakeChangesTable',
  data: () => ({
    loading: true,
    items: [],
    headers: [
      { text: '', value: 'state' },
      { text: 'Инвентарный номер', value: 'fullInventoryNumber' },
      { text: 'Обозначение', value: 'designation' },
      { text: 'Наименование', value: 'cardName' },
      { text: 'Кол-во листов', value: 'sheetCount' },
      { text: 'Дата посл. изм.', value: 'dateLastChange' },
      { text: 'Ном. посл. изм.', value: 'lastChanging' },
      { text: 'Изм. листы', value: 'changedSheets' }
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
        let response;
        if (this.selectedItem.directoryType !== 0) {
          response = await repository.getAllByThemeIdWithLastChange({
            themeId: this.selectedItem.themeId,
            directoryType: this.selectedItem.directoryType
          });
        } else {
          response = await repository.getAllByDirectoryIdWithLastChange(
            this.selectedItem.id
          );
        }
        this.items = [...response.data];
        this.loading = false;
      } catch (err) {
        EventBus.$emit('global-error', err);
      }
    }
  },
  components: {
    MakeChangesDialog
  }
};
</script>
