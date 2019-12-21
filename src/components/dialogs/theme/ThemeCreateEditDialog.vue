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
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field color="info" label="Название темы*" required v-model="theme.themeName"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field color="info" label="Шифр*" required v-model="theme.cipher"></v-text-field>
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
                      label="Дата закладки в архив*"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="archiveDate" @input="archiveDateMenu = false"></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
          </v-container>
          <small>*Обязательно к заполнению</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">Закрыть</v-btn>
          <v-btn color="blue darken-1" text @click="createOrUpdateTheme">Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import treeUtil from '@/utils/treeUtil.js'

export default {
  name: 'ThemeCreateEditDialog',
  props: {
    selectedTheme: {
      required: false,
      type: Object,
      default: () => (undefined)
    },
    btnIcon: {
      type: String,
      default: 'mdi-plus'
    }
  },
  data: () => ({
    dialog: false,
    archiveDateMenu: false
  }),
  computed: {
    ...mapGetters('invCardTree', {
      backendAddress: 'getBackendAddress'
    }),
    theme () {
      return {
        themeName: this.selectedTheme ? this.selectedTheme.themeName : null,
        cipher: this.selectedTheme ? this.selectedTheme.cipher : null,
        archiveDate: this.selectedTheme ? this.selectedTheme.archiveDate.substr(0, 10) : null
      }
    },
    archiveDate () {
      return this.selectedTheme ? this.selectedTheme.archiveDate.substr(0, 10) : null
    },
    dialogTitle () {
      return this.selectedTheme ? 'Редактировать тему' : 'Создать тему'
    }
  },
  methods: {
    ...mapActions('invCardTree', [
      'openBranchAndSetActive'
    ]),
    async createOrUpdateTheme () {
      if (this.selectedTheme) {
        this.theme.id = this.selectedTheme.id
        this.theme.archiveDate = new Date(this.archiveDate).toISOString()
        try {
          const response = await fetch(this.backendAddress + '/theme/update', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(this.theme)
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
        this.theme.archiveDate = new Date(this.archiveDate).toISOString()
        try {
          const response = await fetch(this.backendAddress + '/theme/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(this.theme)
          })
          const createdItem = await response.json()
          treeUtil.enrichTheme(createdItem)
          this.openBranchAndSetActive({ branchPath: ['0'], active: createdItem })
          this.dialog = false
        } catch (err) {
          console.warn(err)
        }
      }
    }
  }
}
</script>
