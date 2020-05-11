<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
      temporary
    >
      <v-list>
        <v-list-item-group v-model="navItem">
          <v-list-item v-for="(item, i) in navItems" :key="i" :to="item.to">
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      color="blue darken-3"
      dark
    >
      <v-toolbar-title style="width: 600px" class="ml-0 pl-4">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        <span class="hidden-sm-and-down"
          >Автоматизированная система учета и регистрации</span
        >
      </v-toolbar-title>
      <v-spacer />
    </v-app-bar>
    <v-content>
      <router-view></router-view>
    </v-content>
    <v-snackbar v-model="snackbar" :color="snackbarColor" top right>
      {{ snackbarText }}
      <v-btn icon @click="snackbar = false">
        <v-icon color="white">mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex';
import { EventBus } from './plugins/event-bus';

export default {
  props: {
    source: String
  },
  data: () => ({
    drawer: null,
    navItem: 0,
    navItems: [
      { text: 'Архив', icon: 'mdi-folder-zip-outline', to: '/' },
      { text: 'Сотрудники', icon: 'mdi-contacts', to: '/employees' },
      { text: 'Форматы', icon: 'mdi-format-color-text', to: '/formats' }
    ],
    snackbar: false,
    snackbarText: '',
    snackbarColor: ''
  }),
  methods: {
    ...mapActions('employeeStore', {
      loadEmployees: 'loadItems'
    }),
    ...mapActions('formatStore', {
      loadFormats: 'loadItems'
    })
  },
  created() {
    this.loadEmployees();
    this.loadFormats();
  },
  mounted() {
    this.loadEmployees();
    this.loadFormats();

    EventBus.$on('global-error', payload => {
      console.log('global-error: ' + payload);
      this.snackbar = true;
      let message;

      if (payload.message) {
        message = payload.message;
      } else {
        message = payload;
      }

      this.snackbarText = message;
      this.snackbarColor = 'error';
    });
    EventBus.$on('global-warning', payload => {
      this.snackbar = true;
      this.snackbarText = payload;
      this.snackbarColor = 'warning';
    });
    EventBus.$on('global-info', payload => {
      this.snackbar = true;
      this.snackbarText = payload;
      this.snackbarColor = 'info';
    });
  }
};
</script>
