<template>
  <v-data-table
    :headers="headers"
    :items="formats"
    :items-per-page="-1"
    hide-default-footer
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
