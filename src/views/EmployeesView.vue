<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="12">
        <v-card height="90vh" style="overflow-x:auto; overflow-y:auto">
          <EmployeesTable></EmployeesTable>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import EmployeesTable from '@/components/EmployeesTable.vue'

export default {
  name: 'EmployeesView',
  components: {
    EmployeesTable
  }
}
</script>
