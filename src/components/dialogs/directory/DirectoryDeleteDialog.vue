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
                Вы действительно хотите удалить директорию "{{
                  selectedDirectory.name
                }}" и все ее содержимое?
              </v-card-text>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false"
          >Закрыть</v-btn
        >
        <v-btn color="blue darken-1" text @click="createOrUpdateDirectory"
          >Удалить</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'DirectoryDeleteDialog',
  props: {
    selectedDirectory: {
      required: false,
      type: Object,
      default: () => undefined
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
    ...mapGetters('invCardTreeStore', {
      backendAddress: 'getBackendAddress'
    }),
    dialogTitle() {
      return 'Удалить директорию';
    }
  },
  methods: {
    ...mapActions('invCardTreeStore', {
      deleteItem: 'onDeleteItem'
    }),
    async createOrUpdateDirectory() {
      if (this.selectedDirectory) {
        try {
          await fetch(this.backendAddress + '/directory/delete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(this.selectedDirectory)
          });
          this.deleteItem(this.selectedDirectory);
          this.dialog = false;
        } catch (err) {
          console.warn(err);
        }
      }
    }
  }
};
</script>
