<template>
  <v-container>
    <v-row dense>
      <v-col cols="4">
        <v-card height="90vh" style="overflow-x:auto; overflow-y:auto">
            <InventoryCardTree></InventoryCardTree>
        </v-card>
      </v-col>
      <v-col cols="8">
        <v-card height="90vh">
          <InventoryCardGeneral v-if="selectedItem&&selectedItem.isInventoryCard"></InventoryCardGeneral>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import InventoryCardTree from '@/components/inv_card/InventoryCardTree.vue'
import InventoryCardGeneral from '@/components/inv_card/InventoryCardGeneral.vue'

export default {
  name: 'InventoryCardView',
  computed: {
    ...mapGetters('invCardTree', {
      selectedItem: 'getSelectedItem'
    })
  },
  components: {
    InventoryCardTree,
    InventoryCardGeneral
  }
}
</script>
