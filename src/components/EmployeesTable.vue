<template>
  <v-data-table
    :headers="headers"
    :items="employees"
    :items-per-page="-1"
    dense
    hide-default-footer
    fixed-header
    height="calc(100vh - 96px)"
    locale="ru"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar>
        <v-spacer></v-spacer>
        <EmployeeCreateEditDialog></EmployeeCreateEditDialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <EmployeeCreateEditDialog
        v-bind:selected-item="item"
        btn-icon="mdi-pencil"
        dialog-title="Редактировать"
      ></EmployeeCreateEditDialog>
      <EmployeeDeleteDialog v-bind:selected-item="item"></EmployeeDeleteDialog>
    </template>
  </v-data-table>
</template>

<script>
import { mapGetters } from 'vuex';
import EmployeeCreateEditDialog from '@/components/dialogs/employee/EmployeeCreateEditDialog.vue';
import EmployeeDeleteDialog from '@/components/dialogs/employee/EmployeeDeleteDialog.vue';

export default {
  name: 'EmployeesTable',
  data: () => ({
    headers: [
      { text: 'Имя сотрудника', value: 'employeeName' },
      {
        text: '',
        sortable: false,
        value: 'actions',
        width: '90px'
      }
    ]
  }),
  computed: {
    ...mapGetters('employeeStore', {
      employees: 'getEmployees'
    })
  },
  components: {
    EmployeeCreateEditDialog,
    EmployeeDeleteDialog
  }
};
</script>
