<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :loading="loading"
    class="elevation-1"
  >
    <template v-slot:item.issueDate="{ item }">
      {{
        new Date(item.issueDate)
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
  name: 'OnceOnlyIssueTable',
  data: () => ({
    loading: true,
    items: [],
    headers: [
      { text: 'Кому', value: 'toWhom' },
      { text: 'Дата', value: 'issueDate' },
      { text: 'Основание', value: 'designation' },
      { text: 'Кол. экз.', value: 'exNumber' }
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
            '/onceOnlyIssue/getByInventoryCard/' +
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
