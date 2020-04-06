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
                    name="Название директории"
                    rules="required"
                  >
                    <v-text-field
                      color="info"
                      label="Название директории"
                      required
                      v-model="directoryName"
                      :error-messages="errors"
                    ></v-text-field>
                  </ValidationProvider>
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
import treeUtil from '@/utils/treeUtil.js';

export default {
  name: 'DirectoryCreateEditDialog',
  props: {
    selectedDirectory: {
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
    ...mapGetters('invCardTreeStore', {
      backendAddress: 'getBackendAddress'
    }),
    directory() {
      return {
        directoryName: this.selectedDirectory
          ? this.selectedDirectory.directoryName
          : null
      };
    },
    dialogTitle() {
      return this.selectedDirectory
        ? 'Редактировать директорию'
        : 'Создать директорию';
    }
  },
  watch: {
    dialog: function(oldVal, newVal) {
      this.$refs.observer.reset();
      this.directoryName = this.selectedDirectory
        ? this.selectedDirectory.directoryName
        : null;
    }
  },
  methods: {
    ...mapActions('invCardTreeStore', ['openBranchAndSetActive']),
    async createOrUpdateDirectory() {
      this.$refs.observer.validate().then(success => {
        this.isValid = success;
      });
      if (!isValid) {
        alert('Введены некорректные данные!');
        return;
      }
      if (this.selectedDirectory) {
        const directory = {
          id: this.selectedDirectory.id,
          directoryName: this.directoryName
        };
        try {
          const response = await fetch(
            this.backendAddress + '/directory/update',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json;charset=utf-8'
              },
              body: JSON.stringify(directory)
            }
          );
          const updatedItem = await response.json();
          updatedItem.name = updatedItem.directoryName;
          const mergedItem = { ...this.selectedDirectory, ...updatedItem };
          const pathToItem = mergedItem.parentId
            ? [mergedItem.parentId]
            : [mergedItem.themeId];
          this.openBranchAndSetActive({
            branchPath: pathToItem,
            active: mergedItem
          });
          this.dialog = false;
        } catch (err) {
          console.warn(err);
        }
      } else {
        try {
          const directory = {
            directoryName: this.directoryName,
            parentId: this.parentDirectory.id,
            themeId: this.parentDirectory.themeId
          };
          const response = await fetch(
            this.backendAddress + '/directory/create',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json;charset=utf-8'
              },
              body: JSON.stringify(directory)
            }
          );
          const createdItem = await response.json();
          treeUtil.enrichDirectory(createdItem);
          const pathToItem = createdItem.parentId
            ? [createdItem.parentId]
            : [createdItem.themeId];
          this.openBranchAndSetActive({
            branchPath: pathToItem,
            active: createdItem
          });
          this.dialog = false;
        } catch (err) {
          console.warn(err);
        }
      }
    }
  }
};
</script>
