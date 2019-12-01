<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
    >
      <v-list>
        <v-list-item-group v-model="navItem" color="info">
          <v-list-item
            v-for="(item, i) in navItems"
            :key="i"
            :to="item.to"
          >
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
      <v-toolbar-title
        style="width: 600px"
        class="ml-0 pl-4"
      >
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        <span class="hidden-sm-and-down">Автоматизированная система учета и регистрации</span>
      </v-toolbar-title>
      <v-spacer />
    </v-app-bar>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
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
    ]
  })
}
</script>
