<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on: dialog }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on: tooltip }">
          <v-btn icon v-on="{ ...dialog, ...tooltip }">
            <v-icon>{{ btnIcon }}</v-icon>
          </v-btn>
        </template>
        <span>{{ dialogTitle }}</span>
      </v-tooltip>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">{{ dialogTitle }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-card-text>
                Вы действительно хотите удалить инвентарную карту "{{
                  selectedCard.name
                }}" и все ее содержимое?
              </v-card-text>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="deleteInventoryCard"
          >Удалить</v-btn
        >
        <v-btn color="blue darken-1" text @click="dialog = false"
          >Закрыть</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';
import { RepositoryFactory } from '../../../utils/repository/RepositoryFactory';

const repository = RepositoryFactory.get('inventoryCard');

export default {
  name: 'InventoryCardDeleteDialog',
  props: {
    selectedCard: {
      required: true,
      type: Object
    },
    btnIcon: {
      type: String,
      default: 'mdi-delete-outline'
    }
  },
  data: () => ({
    dialog: false
  }),
  computed: {
    dialogTitle() {
      return 'Удалить инвентарную карточку';
    }
  },
  methods: {
    ...mapActions('invCardTreeStore', {
      deleteItem: 'onDeleteItem'
    }),
    async deleteInventoryCard() {
      if (this.selectedCard) {
        try {
          await repository.delete(this.selectedCard);
          this.deleteItem(this.selectedCard);
          this.dialog = false;
        } catch (err) {
          console.warn(err);
        }
      }
    }
  }
};
</script>
