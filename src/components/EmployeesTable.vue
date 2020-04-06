<template>
  <v-data-table :headers="headers" :items="employees" class="elevation-1">
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
