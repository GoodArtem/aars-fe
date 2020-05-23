<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on: dialog }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on: tooltip }">
          <v-btn small icon v-on="{ ...dialog, ...tooltip }">
            <v-icon small>{{ btnIcon }}</v-icon>
          </v-btn>
        </template>
        <span>{{ dialogTitle }}</span>
      </v-tooltip>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">{{ dialogTitle }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-card-text>
                Вы действительно хотите удалить абонента "{{
                  selectedItem.subscriberName
                }}
                (основание: {{ selectedItem.designation }}, кол. экз.:
                {{ selectedItem.exNumber }}, списано:
                {{ selectedItem.annulled }})" от "{{ subscriberDate }}"?
              </v-card-text>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="deleteItem">Удалить</v-btn>
        <v-btn color="blue darken-1" text @click="dialog = false"
          >Закрыть</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from 'vue';
import { RepositoryFactory } from '../../../utils/repository/RepositoryFactory';
import { EventBus } from '../../../plugins/event-bus';

const repository = RepositoryFactory.get('subscriber');

export default {
  name: 'SubscriberDeleteDialog',
  props: {
    allItems: {
      required: true,
      type: Array
    },
    selectedItem: {
      required: false,
      type: Object
    },
    btnIcon: {
      type: String,
      default: 'mdi-delete'
    }
  },
  data: () => ({
    dialog: false
  }),
  computed: {
    dialogTitle() {
      return 'Удалить разовую выдачу';
    },
    subscriberDate() {
      if (this.selectedItem && this.selectedItem.subscriberDate) {
        return new Date(this.selectedItem.subscriberDate)
          .toISOString()
          .substr(0, 10)
          .split('-')
          .reverse()
          .join('.');
      }
      return '';
    }
  },
  methods: {
    async deleteItem() {
      if (this.selectedItem) {
        try {
          await repository.delete(this.selectedItem);
          const selectedIdx = this.allItems.indexOf(this.selectedItem);
          Vue.delete(this.allItems, selectedIdx);
          this.dialog = false;
        } catch (err) {
          EventBus.$emit('global-error', err);
        }
      }
    }
  }
};
</script>
