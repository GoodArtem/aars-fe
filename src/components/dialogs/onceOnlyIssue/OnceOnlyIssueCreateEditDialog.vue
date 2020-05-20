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
                    name="'Кому'"
                    rules="required"
                  >
                    <v-text-field
                      label="Кому"
                      required
                      v-model="selectedItemInternal.toWhom"
                      :error-messages="errors"
                    ></v-text-field>
                  </ValidationProvider>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-menu
                    v-model="issueDateMenu"
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
                          v-model="selectedItemInternal.issueDate"
                          label="Дата"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-on="on"
                          :error-messages="errors"
                        ></v-text-field>
                      </ValidationProvider>
                    </template>
                    <v-date-picker
                      v-model="selectedItemInternal.issueDate"
                      locale="ru"
                      @input="issueDateMenu = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <ValidationProvider
                    v-slot="{ errors }"
                    name="'Основание'"
                    rules="required"
                  >
                    <v-text-field
                      label="Основание"
                      required
                      v-model="selectedItemInternal.designation"
                      :error-messages="errors"
                    ></v-text-field>
                  </ValidationProvider>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <ValidationProvider
                    v-slot="{ errors }"
                    name="'Количество экземпляров'"
                    rules="required"
                  >
                    <v-text-field
                      label="Количество экземпляров"
                      required
                      v-model="selectedItemInternal.exNumber"
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

const repository = RepositoryFactory.get('onceOnlyIssue');

export default {
  name: 'OnceOnlyIssueCreateEditDialog',
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
      default: 'Добавить разовую выдачу'
    }
  },
  data: () => ({
    dialog: false,
    issueDateMenu: false,
    selectedItemInternal: {
      id: null,
      toWhom: null,
      issueDate: null,
      designation: null,
      exNumber: null
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
        this.selectedItemInternal.issueDate = this.selectedItem.issueDate.substr(
          0,
          10
        );
      } else {
        this.selectedItemInternal = {
          id: null,
          toWhom: null,
          issueDate: null,
          designation: null,
          exNumber: null
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
        const onceOnlyIssue = {
          inventoryCardId: this.parentItemId,
          toWhom: this.selectedItemInternal.toWhom,
          issueDate: new Date(
            this.selectedItemInternal.issueDate
          ).toISOString(),
          designation: this.selectedItemInternal.designation,
          exNumber: this.selectedItemInternal.exNumber
        };
        if (this.selectedItem) {
          onceOnlyIssue.id = this.selectedItem.id;
          const response = await repository.update(onceOnlyIssue);
          createdOrUpdatedItem = {
            ...this.selectedItem,
            ...response.data
          };
          selectedIdx = this.allItems.indexOf(this.selectedItem);
        } else {
          const response = await repository.create(onceOnlyIssue);
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
