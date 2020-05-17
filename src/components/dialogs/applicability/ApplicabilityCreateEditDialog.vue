<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on: dialog }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on: tooltip }">
          <v-btn icon v-on="{ ...dialog, ...tooltip }">
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
      <ValidationObserver ref="observer">
        <v-form>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-menu
                    v-model="applicabilityDateMenu"
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
                          v-model="selectedItemInternal.applicabilityDate"
                          label="Дата"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-on="on"
                          :error-messages="errors"
                        ></v-text-field>
                      </ValidationProvider>
                    </template>
                    <v-date-picker
                      v-model="selectedItemInternal.applicabilityDate"
                      locale="ru"
                      @input="applicabilityDateMenu = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <SelectApplicabilityInvCardDialog
                    v-bind:selected-applicability="selectedItemInternal"
                  ></SelectApplicabilityInvCardDialog>
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
import SelectApplicabilityInvCardDialog from '@/components/dialogs/applicability/SelectApplicabilityInvCardDialog.vue';

const repository = RepositoryFactory.get('applicability');

export default {
  name: 'ApplicabilityCreateEditDialog',
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
      default: 'Добавить'
    }
  },
  data: () => ({
    dialog: false,
    applicabilityDateMenu: false,
    selectedItemInternal: {
      id: null,
      applicabilityDate: null,
      designation: null,
      appInventoryCardId: null
    },
    isValid: null
  }),
  watch: {
    dialog: function(oldVal, newVal) {
      if (this.$refs.observer) {
        this.$refs.observer.reset();
      }
      if (this.selectedItem) {
        this.selectedItemInternal = {
          ...this.selectedItem
        };
        this.selectedItemInternal.applicabilityDate = this.selectedItem.applicabilityDate.substr(
          0,
          10
        );
      } else {
        this.selectedItemInternal = {
          id: null,
          applicabilityDate: null,
          designation: null,
          appInventoryCardId: null
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
        const applicability = {
          applicabilityDate: new Date(
            this.selectedItemInternal.applicabilityDate
          ).toISOString(),
          appInventoryCardId: this.selectedItemInternal.appInventoryCardId
        };
        if (this.selectedItem) {
          applicability.id = this.selectedItem.id;
          const response = await repository.update(applicability);
          createdOrUpdatedItem = {
            ...this.selectedItem,
            ...response.data
          };
          selectedIdx = this.allItems.indexOf(this.selectedItem);
        } else {
          applicability.inventoryCardId = this.parentItemId;
          const response = await repository.create(applicability);
          createdOrUpdatedItem = response.data;
          selectedIdx = this.allItems.length;
        }
        Vue.set(this.allItems, selectedIdx, createdOrUpdatedItem);
        this.dialog = false;
      } catch (err) {
        console.warn(err);
        EventBus.$emit('global-error', err);
      }
    }
  },
  components: {
    SelectApplicabilityInvCardDialog
  }
};
</script>
