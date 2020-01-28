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
                  label="Название темы"
                  required
                  v-model="themeName"
                  :error-messages="themeNameErrors"
                  @input="$v.themeName.$touch()"
                  @blur="$v.themeName.$touch()"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  color="info"
                  label="Шифр"
                  required
                  v-model="cipher"
                  :error-messages="cipherErrors"
                  @input="$v.cipher.$touch()"
                  @blur="$v.cipher.$touch()"
                ></v-text-field>
              </v-col>
            </v-row>
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
                    <v-text-field
                      v-model="archiveDate"
                      label="Дата закладки в архив"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-on="on"
                      :error-messages="archiveDateErrors"
                      @input="$v.archiveDate.$touch()"
                      @blur="$v.archiveDate.$touch()"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="archiveDate"
                    @input="archiveDateMenu = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-form>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="createOrUpdateTheme"
          >Сохранить</v-btn
        >
        <v-btn color="blue darken-1" text @click="dialog = false"
          >Закрыть</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { mapGetters, mapActions } from 'vuex'
import treeUtil from '@/utils/treeUtil.js'

export default {
  mixins: [validationMixin],
  name: 'ThemeCreateEditDialog',
  validations: {
    archiveDate: { required },
    themeName: { required },
    cipher: { required }
  },
  props: {
    selectedTheme: {
      required: false,
      type: Object,
      default: () => undefined
    },
    btnIcon: {
      type: String,
      default: 'mdi-plus'
    }
  },
  data: () => ({
    dialog: false,
    archiveDateMenu: false,
    archiveDate: null,
    themeName: null,
    cipher: null
  }),
  watch: {
    dialog: function(oldVal, newVal) {
      this.$v.$reset()
      this.themeName = this.selectedTheme ? this.selectedTheme.themeName : null
      this.cipher = this.selectedTheme ? this.selectedTheme.cipher : null
      this.archiveDate = this.selectedTheme
        ? this.selectedTheme.archiveDate.substr(0, 10)
        : null
    }
  },
  computed: {
    ...mapGetters('invCardTree', {
      backendAddress: 'getBackendAddress'
    }),
    dialogTitle() {
      return this.selectedTheme ? 'Редактировать тему' : 'Создать тему'
    },
    archiveDateErrors() {
      const errors = []
      if (!this.$v.archiveDate.$dirty) return errors
      !this.$v.archiveDate.required &&
        errors.push('Дата закладки в архив обязательна для заполнения')
      return errors
    },
    cipherErrors() {
      const errors = []
      if (!this.$v.cipher.$dirty) return errors
      !this.$v.cipher.required && errors.push('Шифр обязателен для заполнения')
      return errors
    },
    themeNameErrors() {
      const errors = []
      if (!this.$v.themeName.$dirty) return errors
      !this.$v.themeName.required &&
        errors.push('Имя темы обязателено для заполнения')
      return errors
    }
  },
  methods: {
    ...mapActions('invCardTree', ['openBranchAndSetActive']),
    async createOrUpdateTheme() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        alert('Введены некорректные данные!')
        return
      }
      if (this.selectedTheme) {
        const theme = {
          id: this.selectedTheme.id,
          themeName: this.themeName,
          cipher: this.cipher,
          archiveDate: new Date(this.archiveDate).toISOString()
        }
        try {
          const response = await fetch(this.backendAddress + '/theme/update', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(theme)
          })
          const updatedItem = await response.json()
          updatedItem.name = updatedItem.themeName + ' ' + updatedItem.cipher
          const mergedItem = { ...this.selectedTheme, ...updatedItem }
          this.openBranchAndSetActive({ branchPath: ['0'], active: mergedItem })
          this.dialog = false
        } catch (err) {
          console.warn(err)
        }
      } else {
        const theme = {
          themeName: this.themeName,
          cipher: this.cipher,
          archiveDate: new Date(this.archiveDate).toISOString()
        }
        try {
          const response = await fetch(this.backendAddress + '/theme/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(theme)
          })
          const createdItem = await response.json()
          treeUtil.enrichTheme(createdItem)
          this.openBranchAndSetActive({
            branchPath: ['0'],
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
