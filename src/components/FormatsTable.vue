<template>
  <v-data-table
    :headers="headers"
    :items="formats"
    :items-per-page="-1"
    dense
    hide-default-footer
    fixed-header
    height="calc(100vh - 96px)"
    locale="ru"
    class="elevation-1"
  >
  </v-data-table>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'FormatsTable',
  data: () => ({
    headers: [{ text: 'Название формата', value: 'formatName' }]
  }),
  computed: {
    ...mapGetters('formatStore', {
      formats: 'getFormats'
    })
  }
};
</script>
