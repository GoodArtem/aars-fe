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
                    name="'Название формата'"
                    rules="required"
                  >
                    <v-text-field
                      label="Название формата"
                      required
                      v-model="selectedItemInternal.formatName"
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
import { mapGetters, mapActions } from 'vuex';
import { EventBus } from '../../../plugins/event-bus';

export default {
  name: 'FormatCreateEditDialog',
  props: {
    selectedItem: {
      required: false,
      type: Object,
      default: () => undefined
    },
    btnIcon: {
      type: String,
      default: 'mdi-plus'
    },
    dialogTitle: {
      type: String,
      default: 'Добавить формат'
    }
  },
  data: () => ({
    dialog: false,
    dateChangingMenu: false,
    selectedItemInternal: {
      id: null,
      formatName: null
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
    ...mapGetters('formatStore', {
      formats: 'getFormats'
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
      } else {
        this.selectedItemInternal = {
          id: null,
          formatName: null
        };
      }
    }
  },
  methods: {
    ...mapActions('formatStore', ['onCreateItem', 'onUpdateItem']),
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
        const format = {
          formatName: this.selectedItemInternal.formatName
        };
        if (this.selectedItem) {
          format.id = this.selectedItem.id;
          const selectedIdx = this.formats.indexOf(this.selectedItem);
          await this.onUpdateItem({ idx: selectedIdx, item: format });
        } else {
          await this.onCreateItem(format);
        }
        this.dialog = false;
      } catch (err) {
        EventBus.$emit('global-error', err);
      }
    }
  }
};
</script>
