<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on: dialog }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on: tooltip }">
          <v-btn
            :small="!isCreatingDialog"
            :icon="!isCreatingDialog"
            :dark="isCreatingDialog"
            :fab="isCreatingDialog"
            :color="btnColor"
            v-on="{ ...dialog, ...tooltip }"
          >
            <v-icon :small="!isCreatingDialog">{{ btnIcon }}</v-icon>
          </v-btn>
        </template>
        <span>{{ dialogTitle }}</span>
      </v-tooltip>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">{{ dialogTitle }}</span>
      </v-card-title>
      <ValidationObserver ref="observer">
        <v-form>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <ValidationProvider
                    v-slot="{ errors }"
                    name="'Номер документа'"
                    rules="required"
                  >
                    <v-text-field
                      label="Номер документа"
                      required
                      v-model="selectedItemInternal.docNumber"
                      :error-messages="errors"
                    ></v-text-field>
                  </ValidationProvider>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-menu
                    v-model="dateChangingMenu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <ValidationProvider
                        v-slot="{ errors }"
                        name="'Дата'"
                        rules="required"
                      >
                        <v-text-field
                          v-model="selectedItemInternal.dateChanging"
                          label="Дата"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-on="on"
                          :error-messages="errors"
                        ></v-text-field>
                      </ValidationProvider>
                    </template>
                    <v-date-picker
                      v-model="selectedItemInternal.dateChanging"
                      locale="ru"
                      @input="dateChangingMenu = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <ValidationProvider
                    v-slot="{ errors }"
                    name="'Измененные листы'"
                    rules="required"
                  >
                    <v-text-field
                      label="Измененные листы"
                      required
                      v-model="selectedItemInternal.changedSheets"
                      :error-messages="errors"
                    ></v-text-field>
                  </ValidationProvider>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="createOrUpdateItem"
              >Сохранить</v-btn
            >
            <v-btn color="blue darken-1" text @click="dialog = false"
              >Закрыть</v-btn
            >
          </v-card-actions>
        </v-form>
      </ValidationObserver>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from 'vue';
import { RepositoryFactory } from '../../../utils/repository/RepositoryFactory';
import { EventBus } from '../../../plugins/event-bus';

const repository = RepositoryFactory.get('stocktaking');

export default {
  name: 'StocktakingCreateEditDialog',
  props: {
    allItems: {
      required: true,
      type: Array
    },
    selectedItem: {
      required: false,
      type: Object,
      default: () => undefined
    },
    parentItemId: {
      required: false,
      type: String,
      default: () => undefined
    },
    btnIcon: {
      type: String,
      default: 'mdi-plus'
    },
    dialogTitle: {
      type: String,
      default: 'Внести изменение'
    }
  },
  data: () => ({
    dialog: false,
    dateChangingMenu: false,
    selectedItemInternal: {
      id: null,
      docNumber: null,
      dateChanging: null,
      changedSheets: null
    },
    isValid: null
  }),
  computed: {
    isCreatingDialog() {
      return this.btnIcon === 'mdi-plus';
    },
    btnColor() {
      return this.isCreatingDialog ? 'blue darken-1' : undefined;
    }
  },
  watch: {
    dialog: function(oldVal, newVal) {
      if (this.$refs.observer) {
        this.$refs.observer.reset();
      }
      if (this.selectedItem) {
        this.selectedItemInternal = {
          ...this.selectedItem
        };
        this.selectedItemInternal.dateChanging = this.selectedItem.dateChanging.substr(
          0,
          10
        );
      } else {
        this.selectedItemInternal = {
          id: null,
          docNumber: null,
          dateChanging: null,
          changedSheets: null
        };
      }
    }
  },
  methods: {
    async createOrUpdateItem() {
      await this.$refs.observer.validate().then(success => {
        this.isValid = success;
        if (!success) {
          alert('Введены некорректные данные!');
        }
        return;
      });
      if (!this.isValid) {
        return;
      }
      try {
        const stocktaking = {
          inventoryCardId: this.parentItemId,
          docNumber: this.selectedItemInternal.docNumber,
          dateChanging: new Date(
            this.selectedItemInternal.dateChanging
          ).toISOString(),
          changedSheets: this.selectedItemInternal.changedSheets
        };
        if (this.selectedItem) {
          stocktaking.id = this.selectedItemInternal.id;
          const response = await repository.update(stocktaking);
        } else {
          const response = await repository.create(stocktaking);
        }
        this.$emit('onUpdateData');
        this.dialog = false;
      } catch (err) {
        EventBus.$emit('global-error', err);
      }
    }
  }
};
</script>
