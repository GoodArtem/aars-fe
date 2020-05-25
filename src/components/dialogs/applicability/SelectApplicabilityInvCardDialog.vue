<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on }">
      <ValidationProvider
        v-slot="{ errors }"
        name="'Обозначение'"
        rules="required"
      >
        <v-text-field
          v-model="selectedApplicability.designation"
          label="Обозначение"
          prepend-icon="mdi-card-bulleted-outline"
          readonly
          v-on="on"
          :error-messages="errors"
        ></v-text-field>
      </ValidationProvider>
    </template>
    <v-card>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-card
                flat
                height="600px"
                style="overflow-x:auto; overflow-y:auto"
              >
                <v-treeview
                  :active.sync="active"
                  :items="items"
                  :load-children="fetchItems"
                  :open.sync="open"
                  item-disabled="isTdCard"
                  dense
                  return-object
                  activatable
                  open-on-click
                  color="primary"
                  transition
                >
                  <template v-slot:prepend="{ item }">
                    <v-icon v-if="item.isInventoryCard && item.state === 0"
                      >mdi-card-bulleted-outline</v-icon
                    >
                    <v-icon v-else-if="item.isInventoryCard && item.state === 1"
                      >mdi-card-bulleted-off-outline</v-icon
                    >
                    <v-icon v-else-if="item.isDirectory"
                      >mdi-folder-open-outline</v-icon
                    >
                    <v-icon v-else-if="item.isTheme"
                      >mdi-format-list-checks</v-icon
                    >
                    <v-icon v-else-if="item.isRootObject"
                      >mdi-format-list-checkbox</v-icon
                    >
                  </template>
                </v-treeview>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="selectItem">Выбрать</v-btn>
        <v-btn color="blue darken-1" text @click="dialog = false">Отмена</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from 'vue';
import { EventBus } from '../../../plugins/event-bus';
import { RepositoryFactory } from '../../../utils/repository/RepositoryFactory';

const themeRepository = RepositoryFactory.get('theme');
const directoryRepository = RepositoryFactory.get('directory');
const invCardRepository = RepositoryFactory.get('inventoryCard');

export default {
  name: 'SelectApplicabilityInvCardDialog',
  props: {
    selectedApplicability: {
      required: true,
      type: Object
    }
  },
  watch: {
    dialog: function(newVal, oldVal) {
      if (newVal) {
        if (
          this.selectedApplicability &&
          this.selectedApplicability.appInventoryCardId
        ) {
          this.getOpenedBranch(
            this.selectedApplicability.appInventoryCardId
          ).then(response => {
            Vue.set(this.items[0], 'children', response.tree);
            open = [{ id: '0' }];
            Vue.set(this, 'open', open.concat(response.open));
            Vue.set(this, 'active', response.active);
          });
        } else {
          Vue.set(this, 'open', []);
          Vue.set(this, 'active', []);
        }
      }
    }
  },
  data: () => ({
    dialog: false,
    items: [
      {
        id: '0',
        name: 'Темы',
        isRootObject: true,
        children: []
      }
    ],
    open: [],
    active: []
  }),
  methods: {
    async fetchItems(item) {
      try {
        if (item.isRootObject) {
          const response = await themeRepository.getAll();
          Vue.set(item, 'children', response.data);
        } else if (item.isTheme) {
          const response = await directoryRepository.getByThemeId(item.id);
          Vue.set(item, 'children', response.data);
        } else if (item.isDirectory) {
          const directoryResponse = await directoryRepository.getByDirectoryId(
            item.id
          );
          const invCardResponse = await invCardRepository.getByDirectoryId(
            item.id
          );

          Vue.set(
            item,
            'children',
            directoryResponse.data.concat(invCardResponse.data)
          );
        }
      } catch (err) {
        EventBus.$emit('global-error', err);
      }
    },
    async getOpenedBranch(itemId) {
      try {
        const response = await invCardRepository.getTreeWithOpenedBranch(
          itemId
        );
        return response.data;
      } catch (err) {
        EventBus.$emit('global-error', err);
      }
    },
    selectItem() {
      const selectedItem = this.active.length == 0 ? undefined : this.active[0];
      if (selectedItem) {
        this.selectedApplicability.appInventoryCardId = selectedItem.id;
        this.selectedApplicability.designation = selectedItem.designation;
      } else {
        this.selectedApplicability.designation = null;
        this.selectedApplicability.appInventoryCardId = null;
      }
      this.dialog = false;
    }
  }
};
</script>
