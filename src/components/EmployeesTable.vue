<template>
  <v-data-table
    :headers="headers"
    :items="employees"
    :items-per-page="-1"
    hide-default-footer
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
