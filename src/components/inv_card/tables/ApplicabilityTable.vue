<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :loading="loading"
    color="info"
  >
    <template v-slot:item.applicabilityDate="{ item }">
      {{ new Date(item.applicabilityDate).toISOString().substr(0, 10).split('-').reverse().join('.') }}
    </template>
    <template v-slot:no-data>
      Нет данных
    </template>
  </v-data-table>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ApplicabilityTable',
  data: () => ({
    loading: true,
    items: [],
    noDataText: 'Нет данных',
    headers: [
      { text: 'Дата', value: 'applicabilityDate' },
      { text: 'Обозначение', value: 'designation' },
      { text: 'Шифр', value: 'cipher' }
    ]
  }),
  computed: {
    ...mapGetters('invCardTree', {
      selectedItem: 'getSelectedItem',
      backendAddress: 'getBackendAddress'
    })
  },
  mounted () {
    this.fetchData()
  },
  watch: {
    selectedItem () {
      this.fetchData()
    }
  },
  methods: {
    async fetchData () {
      try {
        this.loading = true
        const response = await fetch(this.backendAddress + '/applicability/getByInventoryCard/' + this.selectedItem.id)
        const json = await response.json()
        this.items = [...json]
        this.loading = false
      } catch (err) {
        console.warn(err)
      }
    }
  }
}
</script>
