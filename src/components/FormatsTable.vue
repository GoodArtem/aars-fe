<template>
  <v-data-table
    :headers="headers"
    :items="formats"
    :loading="loading"
    class="elevation-1"
  >
  </v-data-table>
</template>

<script>

export default {
  name: 'FormatsTable',
  data: () => ({
    loading: true,
    totalFormats: 0,
    formats: [],
    headers: [
      { text: 'Название формата', value: 'formatName' }
    ]
  }),
  mounted () {
    this.fetchData()
  },
  methods: {
    async fetchData () {
      try {
        this.loading = true
        const response = await fetch('http://localhost:8081/format/all')
        const json = await response.json()
        this.formats = [...json]
        this.totalFormats = this.formats.length
        this.loading = false
      } catch (err) {
        console.warn(err)
      }
    }
  }
}
</script>
