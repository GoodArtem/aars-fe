<template>
  <v-container>
    <v-row>
      <v-col cols="2">
        <v-text-field
            label="Шифр"
            dense
            outlined
            disabled
            :value="selectedItem.cipher"
          ></v-text-field>
      </v-col>
      <v-col cols="4">
        <v-text-field
            label="Обозначение"
            dense
            outlined
            disabled
            :value="selectedItem.designation"
          ></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field
            label="Наименование"
            dense
            outlined
            disabled
            :value="selectedItem.cardName"
          ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="2">
        <v-text-field
            label="Вид документа"
            dense
            outlined
            disabled
            :value="cardType"
          ></v-text-field>
      </v-col>
      <v-col cols="3">
        <v-text-field
            label="Инвентарный номер"
            dense
            outlined
            disabled
            :value="inventoryNumber"
          ></v-text-field>
      </v-col>
      <v-col cols="3">
        <v-text-field
            label="Дата поступления"
            dense
            outlined
            disabled
            :value="cardDate"
          ></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-text-field
            label="Формат"
            dense
            outlined
            disabled
            :value="formatName"
          ></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-text-field
            label="Количество листов"
            dense
            outlined
            disabled
            :value="selectedItem.sheetCount"
          ></v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'InventoryCardInfo',
  computed: {
    ...mapGetters('invCardTree', {
      selectedItem: 'getSelectedItem'
    }),
    cardType () {
      return this.selectedItem.cardType === 1 ? 'КД' : 'ТД'
    },
    cardDate () {
      return new Date(this.selectedItem.cardDate).toISOString().substr(0, 10).split('-').reverse().join('.')
    },
    inventoryNumber () {
      if (this.selectedItem.inventoryNumberSuf) {
        return this.selectedItem.inventoryNumber + ' ' + this.selectedItem.inventoryNumberSuf
      }
      return this.selectedItem.inventoryNumber
    },
    formatName () {
      if (this.selectedItem.formatSet) {
        return this.selectedItem.formatSet.map(element => { return element.formatName }).join(',')
      }
      return ''
    }
  }
}
</script>
