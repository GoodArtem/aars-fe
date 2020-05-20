<template>
  <v-container fluid class="pa-2 ma-0">
    <v-row no-gutters>
      <v-col cols="12">
        <v-card
          height="calc(100vh - 96px)"
          style="overflow-x:auto; overflow-y:auto"
        >
          <EmployeesTable></EmployeesTable>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import EmployeesTable from '@/components/EmployeesTable.vue';

export default {
  name: 'EmployeesView',
  components: {
    EmployeesTable
  }
};
</script>
