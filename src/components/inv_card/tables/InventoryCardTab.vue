<template>
  <v-tabs color="info">
    <v-tab>Применяемость</v-tab>
    <v-tab>Учет изменений</v-tab>
    <v-tab>Учет копий</v-tab>
    <v-tab>Разовые выдачи</v-tab>
    <v-tab
      v-if="
        selectedItem &&
          selectedItem.isInventoryCard &&
          selectedItem.cardType === 1
      "
    >
      Технологические документы
    </v-tab>

    <v-tab-item>
      <ApplicabilityTable></ApplicabilityTable>
    </v-tab-item>
    <v-tab-item>
      <StocktakingTable></StocktakingTable>
    </v-tab-item>
    <v-tab-item>
      <CopiesInfoTable></CopiesInfoTable>
    </v-tab-item>
    <v-tab-item>
      <OnceOnlyIssueTable></OnceOnlyIssueTable>
    </v-tab-item>
  </v-tabs>
</template>

<script>
import { mapGetters } from 'vuex'
import ApplicabilityTable from './ApplicabilityTable.vue'
import StocktakingTable from './StocktakingTable.vue'
import CopiesInfoTable from './CopiesInfoTable.vue'
import OnceOnlyIssueTable from './OnceOnlyIssueTable.vue'

export default {
  name: 'InventoryCardTab',
  computed: {
    ...mapGetters('invCardTree', {
      selectedItem: 'getSelectedItem'
    })
  },
  components: {
    ApplicabilityTable,
    StocktakingTable,
    CopiesInfoTable,
    OnceOnlyIssueTable
  }
}
</script>
