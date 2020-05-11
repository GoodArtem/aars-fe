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
                  <v-menu
                    v-model="archiveDateMenu"
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
                          v-model="archiveDate"
                          label="Дата"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-on="on"
                          :error-messages="errors"
                        ></v-text-field>
                      </ValidationProvider>
                    </template>
                    <v-date-picker
                      v-model="archiveDate"
                      locale="ru"
                      @input="archiveDateMenu = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="createOrUpdateDirectory"
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
import { RepositoryFactory } from '../../../utils/repository/RepositoryFactory';

const repository = RepositoryFactory.get('applicability');

export default {
  name: 'ApplicabilityCreateEditDialog',
  props: {
    selectedItem: {
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
      default: 'mdi-folder-plus-outline'
    }
  },
  data: () => ({
    dialog: false,
    directoryName: null,
    isValid: null
  }),
  computed: {
    dialogTitle() {
      return this.selectedItem ? 'Редактировать' : 'Добавить';
    }
  },
  watch: {
    dialog: function(oldVal, newVal) {
      if (this.$refs.observer) {
        this.$refs.observer.reset();
      }
      this.directoryName = this.selectedItem
        ? this.selectedItem.directoryName
        : null;
    }
  },
  methods: {
    ...mapActions('invCardTreeStore', ['openBranchAndSetActive']),
    async createOrUpdateDirectory() {
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
        const directory = {
          directoryName: this.directoryName
        };
        if (this.selectedItem) {
          directory.id = this.selectedItem.id;
          const response = await repository.update(directory);
          createdOrUpdatedItem = {
            ...this.selectedItem,
            ...response.data
          };
        } else {
          directory.parentId = this.parentDirectory.id;
          directory.themeId = this.parentDirectory.themeId;
          const response = await repository.create(directory);
          createdOrUpdatedItem = response.data;
        }
        treeUtil.enrichDirectory(createdOrUpdatedItem);
        const pathToItem = createdOrUpdatedItem.parentId
          ? [createdOrUpdatedItem.parentId]
          : [createdOrUpdatedItem.themeId];
        this.openBranchAndSetActive({
          branchPath: pathToItem,
          active: createdOrUpdatedItem
        });
        this.dialog = false;
      } catch (err) {
        console.warn(err);
      }
    }
  }
};
</script>
