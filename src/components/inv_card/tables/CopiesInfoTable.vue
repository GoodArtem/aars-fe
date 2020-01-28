<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :loading="loading"
    class="elevation-1"
  >
    <template v-slot:item.copyDate="{ item }">
      {{
        new Date(item.copyDate)
          .toISOString()
          .substr(0, 10)
          .split('-')
          .reverse()
          .join('.')
      }}
    </template>
    <template v-slot:no-data>
      Нет данных
    </template>
  </v-data-table>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'CopiesInfoTable',
  data: () => ({
    loading: true,
    items: [],
    headers: [
      { text: 'Дата', value: 'copyDate' },
      { text: 'Обозначение', value: 'designation' },
      { text: 'Поступило', value: 'receivedCopy' },
      { text: 'Списано', value: 'annulledCopy' }
    ]
  }),
  computed: {
    ...mapGetters('invCardTree', {
      selectedItem: 'getSelectedItem',
      backendAddress: 'getBackendAddress'
    })
  },
  mounted() {
    this.fetchData()
  },
  watch: {
    selectedItem() {
      this.fetchData()
    }
  },
  methods: {
    async fetchData() {
      try {
        this.loading = true
        const response = await fetch(
          this.backendAddress +
            '/copiesInfo/getByInventoryCard/' +
            this.selectedItem.id
        )
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
