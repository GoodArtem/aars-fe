<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
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
                    name="'Обозначение'"
                    rules="required"
                  >
                    <v-text-field
                      label="Обозначение"
                      required
                      v-model="designation"
                      :error-messages="errors"
                    ></v-text-field>
                  </ValidationProvider>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <ValidationProvider
                    v-slot="{ errors }"
                    name="'Наименование'"
                    rules="required"
                  >
                    <v-text-field
                      label="Наименование"
                      required
                      v-model="cardName"
                      :error-messages="errors"
                    ></v-text-field>
                  </ValidationProvider>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="8">
                  <ValidationProvider
                    v-slot="{ errors }"
                    name="'Инвентарный номер'"
                    rules="required"
                  >
                    <v-text-field
                      label="Инвентарный номер"
                      required
                      v-model="inventoryNumber"
                      :error-messages="errors"
                    ></v-text-field>
                  </ValidationProvider>
                </v-col>
                <v-col cols="4">
                  <ValidationProvider v-slot="{ errors }" name="'Суффикс'">
                    <v-text-field
                      label="Суффикс"
                      v-model="inventoryNumberSuf"
                      :error-messages="errors"
                    ></v-text-field>
                  </ValidationProvider>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-menu
                    v-model="cardDateMenu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <ValidationProvider
                        v-slot="{ errors }"
                        name="'Дата создания'"
                        rules="required"
                      >
                        <v-text-field
                          v-model="cardDate"
                          label="Дата создания"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-on="on"
                          :error-messages="errors"
                        ></v-text-field>
                      </ValidationProvider>
                    </template>
                    <v-date-picker
                      v-model="cardDate"
                      locale="ru"
                      @input="cardDateMenu = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <ValidationProvider
                    v-slot="{ errors }"
                    name="'Формат'"
                    rules="required"
                  >
                    <v-select
                      v-model="formatSet"
                      :items="allFormats"
                      item-text="formatName"
                      item-value="id"
                      label="Формат"
                      return-object
                      multiple
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
                    name="'Количество листов'"
                    rules="required|between:1,9999"
                  >
                    <v-text-field
                      label="Количество листов"
                      required
                      v-model="sheetCount"
                      :error-messages="errors"
                    ></v-text-field>
                  </ValidationProvider>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <ValidationProvider v-slot="{ errors }" name="'Аннулировано'">
                    <v-switch
                      label="Аннулировано"
                      v-model="isAnnulled"
                      :error-messages="errors"
                    ></v-switch>
                  </ValidationProvider>
                </v-col>
              </v-row>
              <v-row v-if="isAnnulled">
                <v-col cols="12">
                  <v-menu
                    v-model="annulledDateMenu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <ValidationProvider
                        v-slot="{ errors }"
                        name="'Дата аннулирования'"
                        :rules="`${isAnnulled ? 'required' : ''}`"
                      >
                        <v-text-field
                          v-model="annulledDate"
                          label="Дата аннулирования"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-on="on"
                          :error-messages="errors"
                        ></v-text-field>
                      </ValidationProvider>
                    </template>
                    <v-date-picker
                      v-model="annulledDate"
                      locale="ru"
                      @input="annulledDateMenu = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="createOrUpdateCard"
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
import { mapGetters, mapActions } from 'vuex';
import { EventBus } from '../../../plugins/event-bus';
import treeUtil from '@/utils/treeUtil.js';
import { RepositoryFactory } from '../../../utils/repository/RepositoryFactory';

const repository = RepositoryFactory.get('inventoryCard');

export default {
  name: 'InventoryCardCreateEditDialog',
  props: {
    selectedCard: {
      required: false,
      type: Object,
      default: () => undefined
    },
    parentDirectory: {
      required: false,
      type: Object,
      default: () => undefined
    },
    btnIcon: {
      type: String,
      default: 'mdi-card-plus-outline'
    }
  },
  data: () => ({
    dialog: false,
    designation: null,
    cardName: null,
    inventoryNumber: null,
    inventoryNumberSuf: null,
    cardDate: null,
    cardDateMenu: false,
    sheetCount: null,
    formatSet: null,
    state: null,
    isAnnulled: false,
    annulledDate: null,
    annulledDateMenu: false
  }),
  computed: {
    ...mapGetters('formatStore', {
      allFormats: 'getFormats'
    }),
    dialogTitle() {
      return this.selectedCard
        ? 'Редактировать инвентарную карточку'
        : 'Создать инвентарную карточку';
    }
  },
  watch: {
    dialog: function(oldVal, newVal) {
      if (this.$refs.observer) {
        this.$refs.observer.reset();
      }
      this.designation = this.selectedCard
        ? this.selectedCard.designation
        : null;
      this.cardName = this.selectedCard ? this.selectedCard.cardName : null;
      this.inventoryNumber = this.selectedCard
        ? this.selectedCard.inventoryNumber
        : repository
            .getNextSequenceInventoryNumber(this.parentDirectory.id)
            .then(response => (this.inventoryNumber = response.data));
      this.inventoryNumberSuf = this.selectedCard
        ? this.selectedCard.inventoryNumberSuf
        : null;
      this.cardDate = this.selectedCard
        ? this.selectedCard.cardDate.substr(0, 10)
        : null;
      this.sheetCount = this.selectedCard ? this.selectedCard.sheetCount : null;
      this.formatSet = this.selectedCard ? this.selectedCard.formatSet : null;
      this.isAnnulled = this.selectedCard
        ? this.selectedCard.state === 1
        : false;
      this.annulledDate =
        this.selectedCard && this.selectedCard.annulledDate
          ? this.selectedCard.annulledDate.substr(0, 10)
          : null;
    }
  },
  methods: {
    ...mapActions('invCardTreeStore', ['openBranchAndSetActive']),
    async createOrUpdateCard() {
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
        const inventoryCard = {
          designation: this.designation,
          cardName: this.cardName,
          inventoryNumber: this.inventoryNumber,
          inventoryNumberSuf: this.inventoryNumberSuf,
          cardDate: new Date(this.cardDate).toISOString(),
          formatSet: this.formatSet,
          sheetCount: this.sheetCount,
          state: this.isAnnulled ? 1 : 0,
          annulledDate: this.isAnnulled
            ? new Date(this.annulledDate).toISOString
            : null
        };
        if (this.selectedCard) {
          inventoryCard.id = this.selectedCard.id;
          const response = await repository.update(inventoryCard);
          createdOrUpdatedItem = {
            ...this.selectedCard,
            ...response.data
          };
        } else {
          inventoryCard.directoryId = this.parentDirectory.id;
          inventoryCard.themeId = this.parentDirectory.themeId;
          const response = await repository.create(inventoryCard);
          createdOrUpdatedItem = response.data;
        }
        treeUtil.enrichInvCard(createdOrUpdatedItem);
        this.openBranchAndSetActive({
          branchPath: [createdOrUpdatedItem.directoryId],
          active: createdOrUpdatedItem
        });
        this.dialog = false;
      } catch (err) {
        EventBus.$emit('global-error', err);
      }
    }
  }
};
</script>
