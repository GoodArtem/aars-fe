<template>
  <v-dialog
    v-model="dialog"
    persistent
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on: dialog }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on: tooltip }">
          <v-btn icon v-on="{ ...dialog, ...tooltip }">
            <v-icon>{{ btnIcon }}</v-icon>
          </v-btn>
        </template>
        <span>{{ dialogTitle }}</span>
      </v-tooltip>
    </template>
    <v-card>
      <v-card-title>
        <v-text-field
          label="Поиск"
          required
          v-model="searchString"
        ></v-text-field>
        <v-btn dark color="blue darken-1" text @click="searchCards"
          >Найти</v-btn
        >
      </v-card-title>
      <v-card-text>
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
          <template v-slot:item.state="{ item }">
            <v-icon v-if="item.state === 0">mdi-card-bulleted-outline</v-icon>
            <v-icon v-else-if="item.state === 1"
              >mdi-card-bulleted-off-outline</v-icon
            >
          </template>
          <template v-slot:item.cardDate="{ item }">
            {{
              item.cardDate
                ? new Date(item.cardDate)
                    .toISOString()
                    .substr(0, 10)
                    .split('-')
                    .reverse()
                    .join('.')
                : ''
            }}
          </template>
          <template v-slot:item.goToCard="{ item }">
            <v-btn small icon @click="goToCard(item)">
              <v-icon small>mdi-open-in-new</v-icon>
            </v-btn>
          </template>
          <template v-slot:no-data>
            Нет данных
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false"
          >Закрыть</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';
import { RepositoryFactory } from '../../../utils/repository/RepositoryFactory';
import { EventBus } from '../../../plugins/event-bus';

const repository = RepositoryFactory.get('inventoryCard');

export default {
  name: 'InventoryCardSearchDialog',
  props: {
    btnIcon: {
      type: String,
      default: 'mdi-magnify'
    }
  },
  data: () => ({
    dialog: false,
    loading: false,
    items: [],
    searchString: null,
    headers: [
      { text: '', value: 'state' },
      { text: 'Инвентарный номер', value: 'fullInventoryNumber' },
      { text: 'Шифр', value: 'cipher' },
      { text: 'Обозначение', value: 'designation' },
      { text: 'Наименование', value: 'cardName' },
      { text: 'Дата поступления', value: 'cardDate' },
      { text: 'Кол-во листов', value: 'sheetCount' },
      { text: '', value: 'goToCard' }
    ]
  }),
  computed: {
    dialogTitle() {
      return 'Поиск инвентарной карточки';
    }
  },
  methods: {
    ...mapActions('invCardTreeStore', {
      openCard: 'openCard'
    }),
    async searchCards() {
      if (this.searchString) {
        try {
          this.loading = true;
          const response = await repository.getInventoryCardBySearchString(
            this.searchString
          );
          this.items = [...response.data];
          this.loading = false;
        } catch (err) {
          EventBus.$emit('global-error', err);
        }
      }
    },
    async goToCard(item) {
      this.openCard(item);
      this.dialog = false;
    }
  }
};
</script>
