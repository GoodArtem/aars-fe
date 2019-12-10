<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :loading="loading"
    class="elevation-1"
  >
    <template v-slot:item.dateChanging="{ item }">
      {{ new Date(item.dateChanging).toISOString().substr(0, 10).split('-').reverse().join('.') }}
    </template>
    <template v-slot:no-data>
      Нет данных
    </template>
  </v-data-table>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'StocktakingTable',
  data: () => ({
    loading: true,
    items: [],
    headers: [
      { text: 'Номер изменения', value: 'changing' },
      { text: 'Номер документа', value: 'docNumber' },
      { text: 'Дата внесения', value: 'dateChanging' },
      { text: 'Листы', value: 'changedSheets' }
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
        const response = await fetch(this.backendAddress + '/stocktaking/getByInventoryCard/' + this.selectedItem.id)
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
