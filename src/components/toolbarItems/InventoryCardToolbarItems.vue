<template>
  <v-toolbar-items>
    <v-tooltip bottom>
      <template v-slot:activator="{ on: tooltip }">
        <v-btn icon @click="printInventoryCard" v-on="{ ...tooltip }">
          <v-icon>mdi-printer</v-icon>
        </v-btn>
      </template>
      <span>Печать инвентарной карточки</span>
    </v-tooltip>
    <InventoryCardCreateEditDialog
      btn-icon="mdi-pencil"
      v-bind:selected-card="selectedItem"
    ></InventoryCardCreateEditDialog>
    <InventoryCardDeleteDialog
      v-bind:selected-card="selectedItem"
    ></InventoryCardDeleteDialog>
  </v-toolbar-items>
</template>

<script>
import { RepositoryFactory } from '../../utils/repository/RepositoryFactory';
import InventoryCardCreateEditDialog from '../dialogs/inventoryCard/InventoryCardCreateEditDialog.vue';
import InventoryCardDeleteDialog from '../dialogs/inventoryCard/InventoryCardDeleteDialog.vue';

const repository = RepositoryFactory.get('inventoryCard');

export default {
  name: 'InventoryCardToolbarItems',
  props: {
    selectedItem: {
      required: true,
      type: Object
    }
  },
  methods: {
    printInventoryCard() {
      return repository.downloadPdf(this.selectedItem);
    }
  },
  components: {
    InventoryCardCreateEditDialog,
    InventoryCardDeleteDialog
  }
};
</script>
