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
  </v-data-table>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'EmployeesTable',
  data: () => ({
    headers: [{ text: 'Имя сотрудника', value: 'employeeName' }]
  }),
  computed: {
    ...mapGetters('employeeStore', {
      employees: 'getEmployees'
    })
  }
};
</script>
