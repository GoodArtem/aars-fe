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
                  <v-menu
                    v-model="copyDateMenu"
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
                          v-model="selectedItemInternal.copyDate"
                          label="Дата"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-on="on"
                          :error-messages="errors"
                        ></v-text-field>
                      </ValidationProvider>
                    </template>
                    <v-date-picker
                      v-model="selectedItemInternal.copyDate"
                      locale="ru"
                      @input="copyDateMenu = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <ValidationProvider
                    v-slot="{ errors }"
                    name="'Обозначение'"
                    rules="required"
                  >
                    <v-select
                      v-model="selectedItemInternal.employeeId"
                      :items="allEmployees"
                      item-text="employeeName"
                      item-value="id"
                      label="Обозначение"
                      required
                      :error-messages="errors"
                    ></v-select>
                  </ValidationProvider>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <ValidationProvider
                    v-slot="{ errors }"
                    name="'Поступило'"
                    rules="required"
                  >
                    <v-text-field
                      label="Поступило"
                      required
                      v-model="selectedItemInternal.receivedCopy"
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
                      v-model="selectedItemInternal.annulledCopy"
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
import { mapGetters } from 'vuex';
import { RepositoryFactory } from '../../../utils/repository/RepositoryFactory';
import { EventBus } from '../../../plugins/event-bus';

const repository = RepositoryFactory.get('copiesInfo');

export default {
  name: 'CopiesInfoCreateEditDialog',
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
      default: 'Выдать копию'
    }
  },
  data: () => ({
    dialog: false,
    copyDateMenu: false,
    selectedItemInternal: {
      id: null,
      copyDate: null,
      employeeId: null,
      designation: null,
      receivedCopy: null,
      annulledCopy: null
    },
    isValid: null
  }),
  computed: {
    isCreatingDialog() {
      return this.btnIcon === 'mdi-plus';
    },
    btnColor() {
      return this.isCreatingDialog ? 'blue darken-1' : undefined;
    },
    ...mapGetters('employeeStore', {
      allEmployees: 'getEmployees'
    })
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
        this.selectedItemInternal.copyDate = this.selectedItem.copyDate.substr(
          0,
          10
        );
      } else {
        this.selectedItemInternal = {
          id: null,
          copyDate: null,
          employeeId: null,
          designation: null,
          receivedCopy: null,
          annulledCopy: null
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
        const copiesInfo = {
          inventoryCardId: this.parentItemId,
          copyDate: new Date(this.selectedItemInternal.copyDate).toISOString(),
          employeeId: this.selectedItemInternal.employeeId,
          designation: this.selectedItemInternal.designation,
          receivedCopy: this.selectedItemInternal.receivedCopy,
          annulledCopy: this.selectedItemInternal.annulledCopy
        };
        if (this.selectedItem) {
          copiesInfo.id = this.selectedItem.id;
          const response = await repository.update(copiesInfo);
          createdOrUpdatedItem = {
            ...this.selectedItem,
            ...response.data
          };
          selectedIdx = this.allItems.indexOf(this.selectedItem);
        } else {
          const response = await repository.create(copiesInfo);
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
