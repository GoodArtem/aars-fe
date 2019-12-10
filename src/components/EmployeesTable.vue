<template>
  <v-data-table
    :headers="headers"
    :items="employees"
    :loading="loading"
    class="elevation-1"
  >
  </v-data-table>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'EmployeesTable',
  data: () => ({
    loading: true,
    totalEmployees: 0,
    employees: [],
    headers: [
      { text: 'Имя сотрудника', value: 'employeeName' }
    ]
  }),
  computed: {
    ...mapGetters('invCardTree', {
      backendAddress: 'getBackendAddress'
    })
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    async fetchData () {
      try {
        this.loading = true
        const response = await fetch(this.backendAddress + '/employee/all')
        const json = await response.json()
        this.employees = [...json]
        this.totalEmployees = this.employees.length
        this.loading = false
      } catch (err) {
        console.warn(err)
      }
    }
  }
}
</script>
