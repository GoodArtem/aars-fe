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
                    name="'Абонент'"
                    rules="required"
                  >
                    <v-text-field
                      label="Абонент"
                      required
                      v-model="selectedItemInternal.subscriberName"
                      :error-messages="errors"
                    ></v-text-field>
                  </ValidationProvider>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-menu
                    v-model="subscribeDateMenu"
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
                          v-model="selectedItemInternal.subscribeDate"
                          label="Дата"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-on="on"
                          :error-messages="errors"
                        ></v-text-field>
                      </ValidationProvider>
                    </template>
                    <v-date-picker
                      v-model="selectedItemInternal.subscribeDate"
                      locale="ru"
                      @input="subscribeDateMenu = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <ValidationProvider
                    v-slot="{ errors }"
                    name="'Кол. экз.'"
                    rules="required"
                  >
                    <v-text-field
                      label="Кол. экз."
                      required
                      v-model="selectedItemInternal.exNumber"
                      :error-messages="errors"
                    ></v-text-field>
                  </ValidationProvider>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <ValidationProvider
                    v-slot="{ errors }"
                    name="'Обозначение'"
                    rules="required"
                  >
                    <v-text-field
                      label="Обозначение"
                      required
                      v-model="selectedItemInternal.designation"
                      :error-messages="errors"
                    ></v-text-field>
                  </ValidationProvider>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <ValidationProvider v-slot="{ errors }" name="'Списано'">
                    <v-text-field
                      label="Списано"
                      v-model="selectedItemInternal.annulled"
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

const repository = RepositoryFactory.get('subscriber');

export default {
  name: 'SubscriberCreateEditDialog',
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
      default: 'Добавить абонента'
    }
  },
  data: () => ({
    dialog: false,
    subscribeDateMenu: false,
    selectedItemInternal: {
      id: null,
      subscriberName: null,
      subscribeDate: null,
      exNumber: null,
      designation: null,
      annulled: null
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
        this.selectedItemInternal.subscribeDate = this.selectedItem.subscribeDate.substr(
          0,
          10
        );
      } else {
        this.selectedItemInternal = {
          id: null,
          subscriberName: null,
          subscribeDate: null,
          exNumber: null,
          designation: null,
          annulled: null
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
        let createdOrUpdatedItem = null;
        let selectedIdx = null;
        const subscriber = {
          themeId: this.parentItemId,
          subscriberName: this.selectedItemInternal.subscriberName,
          subscribeDate: new Date(
            this.selectedItemInternal.subscribeDate
          ).toISOString(),
          exNumber: this.selectedItemInternal.exNumber,
          designation: this.selectedItemInternal.designation,
          annulled: this.selectedItemInternal.annulled
        };
        if (this.selectedItem) {
          subscriber.id = this.selectedItemInternal.id;
          const response = await repository.update(subscriber);
          createdOrUpdatedItem = {
            ...this.selectedItem,
            ...response.data
          };
          selectedIdx = this.allItems.indexOf(this.selectedItem);
        } else {
          const response = await repository.create(subscriber);
          createdOrUpdatedItem = response.data;
          selectedIdx = this.allItems.length;
        }
        Vue.set(this.allItems, selectedIdx, createdOrUpdatedItem);
        this.dialog = false;
      } catch (err) {
        EventBus.$emit('global-error', err);
      }
    }
  }
};
</script>
