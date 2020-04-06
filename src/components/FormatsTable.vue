<template>
  <v-data-table :headers="headers" :items="formats" class="elevation-1">
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
