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
          <v-toolbar color="primary" dark>
            <v-toolbar-title>{{ titleSelectedItem }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <template v-if="isRootObject">
              <ThemeCreateEditDialog></ThemeCreateEditDialog>
              <v-btn icon>
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </template>
            <template v-else-if="isTheme">
              <ThemeCreateEditDialog
                btn-icon="mdi-pencil"
                v-bind:selected-theme="selectedItem"
              ></ThemeCreateEditDialog>
              <ThemeDeleteDialog
                v-bind:selected-theme="selectedItem"
              ></ThemeDeleteDialog>
            </template>
            <template v-else-if="isDirectory">
              <InventoryCardCreateEditDialog
                v-bind:parent-directory="selectedItem"
              ></InventoryCardCreateEditDialog>
              <v-divider class="mx-4" dark vertical></v-divider>
              <DirectoryCreateEditDialog
                v-bind:parent-directory="selectedItem"
              ></DirectoryCreateEditDialog>
              <template v-if="isSimpleDirectory">
                <DirectoryCreateEditDialog
                  btn-icon="mdi-pencil"
                  v-bind:selected-directory="selectedItem"
                ></DirectoryCreateEditDialog>
                <DirectoryDeleteDialog
                  v-bind:selected-directory="selectedItem"
                ></DirectoryDeleteDialog>
              </template>
            </template>
            <template v-else-if="isInventoryCard">
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
            </template>
          </v-toolbar>
          <InventoryCardGeneral v-if="isInventoryCard"></InventoryCardGeneral>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import { RepositoryFactory } from '../utils/repository/RepositoryFactory';
import InventoryCardTree from '@/components/inv_card/InventoryCardTree.vue';
import InventoryCardGeneral from '@/components/inv_card/InventoryCardGeneral.vue';
import ThemeCreateEditDialog from '@/components/dialogs/theme/ThemeCreateEditDialog.vue';
import ThemeDeleteDialog from '@/components/dialogs/theme/ThemeDeleteDialog.vue';
import DirectoryCreateEditDialog from '@/components/dialogs/directory/DirectoryCreateEditDialog.vue';
import DirectoryDeleteDialog from '@/components/dialogs/directory/DirectoryDeleteDialog.vue';
import InventoryCardCreateEditDialog from '@/components/dialogs/inventoryCard/InventoryCardCreateEditDialog.vue';
import InventoryCardDeleteDialog from '@/components/dialogs/inventoryCard/InventoryCardDeleteDialog.vue';

const repository = RepositoryFactory.get('inventoryCard');

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
    isSimpleDirectory() {
      return (
        this.selectedItem &&
        this.selectedItem.isDirectory &&
        this.selectedItem.directoryType === 0
      );
    },
    isInventoryCard() {
      return this.selectedItem && this.selectedItem.isInventoryCard;
    }
  },
  methods: {
    printInventoryCard() {
      return repository.downloadPdf(this.selectedItem);
    }
  },
  components: {
    InventoryCardTree,
    InventoryCardGeneral,
    ThemeCreateEditDialog,
    ThemeDeleteDialog,
    DirectoryCreateEditDialog,
    DirectoryDeleteDialog,
    InventoryCardCreateEditDialog,
    InventoryCardDeleteDialog
  }
};
</script>
