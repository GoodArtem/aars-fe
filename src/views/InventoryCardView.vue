<template>
  <v-container fluid class="pa-2 ma-0">
    <v-row dense>
      <v-col cols="4">
        <v-card
          height="calc(100vh - 96px)"
          style="overflow-x:auto; overflow-y:auto"
        >
          <InventoryCardTree></InventoryCardTree>
        </v-card>
      </v-col>
      <v-col cols="8">
        <v-card height="calc(100vh - 96px)">
          <v-toolbar color="primary" dark>
            <v-toolbar-title>{{ titleSelectedItem }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <RootToolbarItems v-if="isRootObject"></RootToolbarItems>
            <ThemeToolbarItems
              v-else-if="isTheme"
              v-bind:selected-item="selectedItem"
            ></ThemeToolbarItems>
            <DirectoryToolbarItems
              v-else-if="isDirectory"
              v-bind:selected-item="selectedItem"
            >
            </DirectoryToolbarItems>
            <InventoryCardToolbarItems
              v-else-if="isInventoryCard"
              v-bind:selected-item="selectedItem"
            >
            </InventoryCardToolbarItems>
          </v-toolbar>
          <InventoryCardGeneral v-if="isInventoryCard"></InventoryCardGeneral>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import InventoryCardTree from '@/components/inv_card/InventoryCardTree.vue';
import InventoryCardGeneral from '@/components/inv_card/InventoryCardGeneral.vue';
import RootToolbarItems from '@/components/toolbarItems/RootToolbarItems.vue';
import ThemeToolbarItems from '@/components/toolbarItems/ThemeToolbarItems.vue';
import DirectoryToolbarItems from '@/components/toolbarItems/DirectoryToolbarItems.vue';
import InventoryCardToolbarItems from '@/components/toolbarItems/InventoryCardToolbarItems.vue';

export default {
  name: 'InventoryCardView',
  computed: {
    ...mapGetters('invCardTreeStore', {
      selectedItem: 'getSelectedItem'
    }),
    titleSelectedItem() {
      if (this.isRootObject) {
        return 'Архив инвентарных карточек';
      } else {
        return this.selectedItem.name;
      }
    },
    isRootObject() {
      return !this.selectedItem || this.selectedItem.isRootObject;
    },
    isTheme() {
      return this.selectedItem && this.selectedItem.isTheme;
    },
    isDirectory() {
      return this.selectedItem && this.selectedItem.isDirectory;
    },
    isInventoryCard() {
      return this.selectedItem && this.selectedItem.isInventoryCard;
    }
  },
  components: {
    InventoryCardTree,
    InventoryCardGeneral,
    RootToolbarItems,
    ThemeToolbarItems,
    DirectoryToolbarItems,
    InventoryCardToolbarItems
  }
};
</script>
