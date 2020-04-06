<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="12">
        <v-card height="90vh" style="overflow-x:auto; overflow-y:auto">
          <FormatsTable></FormatsTable>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import FormatsTable from '@/components/FormatsTable.vue';

export default {
  name: 'FormatsView',
  components: {
    FormatsTable
  }
};
</script>
