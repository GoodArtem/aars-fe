<template>
  <v-container>
    <v-row dense>
      <InventoryCardInfo></InventoryCardInfo>
    </v-row>
    <v-row>
      <v-divider></v-divider>
    </v-row>
    <v-row>
      <InventoryCardTab></InventoryCardTab>
    </v-row>
  </v-container>
</template>

<script>
import InventoryCardInfo from './InventoryCardInfo.vue'
import InventoryCardTab from './tables/InventoryCardTab.vue'

export default {
  name: 'InventoryCardGeneral',
  components: {
    InventoryCardInfo,
    InventoryCardTab
  }
}
</script>
