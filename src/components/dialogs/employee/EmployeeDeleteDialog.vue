<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on: dialog }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on: tooltip }">
          <v-btn small icon v-on="{ ...dialog, ...tooltip }">
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
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-card-text>
                Вы действительно хотите удалить информацию о сотруднике "{{
                  selectedItem.employeeName
                }}"?
              </v-card-text>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="deleteInventoryCard"
          >Удалить</v-btn
        >
        <v-btn color="blue darken-1" text @click="dialog = false"
          >Закрыть</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'EmployeeDeleteDialog',
  props: {
    selectedItem: {
      required: false,
      type: Object
    },
    btnIcon: {
      type: String,
      default: 'mdi-delete'
    }
  },
  data: () => ({
    dialog: false
  }),
  computed: {
    dialogTitle() {
      return 'Удалить данные сотрудника';
    },
    ...mapGetters('employeeStore', {
      employees: 'getEmployees'
    })
  },
  methods: {
    ...mapActions('employeeStore', ['onDeleteItem']),
    async deleteInventoryCard() {
      if (this.selectedItem) {
        await this.onDeleteItem(this.employees.indexOf(this.selectedItem));
        this.dialog = false;
      }
    }
  }
};
</script>
