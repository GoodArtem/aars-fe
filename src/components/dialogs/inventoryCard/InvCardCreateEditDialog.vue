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
      <v-form>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  color="info"
                  label="Обозначение"
                  required
                  v-model="designation"
                  :error-messages="directoryNameErrors"
                  @input="$v.directoryName.$touch()"
                  @blur="$v.directoryName.$touch()"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  color="info"
                  label="Наименование"
                  required
                  v-model="cardName"
                  :error-messages="directoryNameErrors"
                  @input="$v.directoryName.$touch()"
                  @blur="$v.directoryName.$touch()"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="8">
                <v-text-field
                  color="info"
                  label="Инвентарный номер"
                  required
                  v-model="inventoryNumber"
                  :error-messages="directoryNameErrors"
                  @input="$v.directoryName.$touch()"
                  @blur="$v.directoryName.$touch()"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">
                <v-text-field
                  color="info"
                  label="Суффикс"
                  required
                  v-model="inventoryNumberSuf"
                  :error-messages="directoryNameErrors"
                  @input="$v.directoryName.$touch()"
                  @blur="$v.directoryName.$touch()"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="createOrUpdateDirectory">Сохранить</v-btn>
          <v-btn color="blue darken-1" text @click="dialog = false">Закрыть</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { mapGetters, mapActions } from 'vuex'
import treeUtil from '@/utils/treeUtil.js'

export default {
  name: 'InventoryCardCreateEditDialog',
  mixins: [validationMixin],
  validations: {
    directoryName: { required }
  },
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
    designation: null,
    cardName: null,
    inventoryNumber: null,
    inventoryNumberSuf: null,
    cardDate: null,
    sheetCount: null,
    directoryName: null,
    cipher: null
  }),
  computed: {
    ...mapGetters('invCardTree', {
      backendAddress: 'getBackendAddress'
    }),
    directory() {
      return {
        directoryName: this.selectedDirectory
          ? this.selectedDirectory.directoryName
          : null
      }
    },
    dialogTitle() {
      return this.selectedDirectory
        ? 'Редактировать инвентарную карточку'
        : 'Создать инвентарную карточку'
    },
    directoryNameErrors() {
      const errors = []
      if (!this.$v.directoryName.$dirty) return errors
      !this.$v.directoryName.required &&
        errors.push('Имя директории обязательно для заполнения')
      return errors
    }
  },
  watch: {
    dialog: function(oldVal, newVal) {
      this.$v.$reset()
      this.directoryName = this.selectedDirectory
        ? this.selectedDirectory.directoryName
        : null
    }
  },
  methods: {
    ...mapActions('invCardTree', ['openBranchAndSetActive']),
    async createOrUpdateDirectory() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        alert('Введены некорректные данные!')
        return
      }
      if (this.selectedDirectory) {
        const directory = {
          id: this.selectedDirectory.id,
          directoryName: this.directoryName
        }
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
          )
          const updatedItem = await response.json()
          updatedItem.name = updatedItem.directoryName
          const mergedItem = { ...this.selectedDirectory, ...updatedItem }
          const pathToItem = mergedItem.parentId
            ? [mergedItem.parentId]
            : [mergedItem.themeId]
          this.openBranchAndSetActive({
            branchPath: pathToItem,
            active: mergedItem
          })
          this.dialog = false
        } catch (err) {
          console.warn(err)
        }
      } else {
        try {
          const directory = {
            directoryName: this.directoryName,
            parentId: this.parentDirectory.id,
            themeId: this.parentDirectory.themeId
          }
          const response = await fetch(
            this.backendAddress + '/directory/create',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json;charset=utf-8'
              },
              body: JSON.stringify(directory)
            }
          )
          const createdItem = await response.json()
          treeUtil.enrichDirectory(createdItem)
          const pathToItem = createdItem.parentId
            ? [createdItem.parentId]
            : [createdItem.themeId]
          this.openBranchAndSetActive({
            branchPath: pathToItem,
            active: createdItem
          })
          this.dialog = false
        } catch (err) {
          console.warn(err)
        }
      }
    }
  }
}
</script>
