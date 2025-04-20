<template>
  <v-app-bar color="primary">
    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
    
    <v-toolbar-title>Quiz App</v-toolbar-title>
    <v-toolbar-title v-if="userStore.isAuthenticated"> Hello, {{ userStore.name }}</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn
        v-for="item in menuItems"
        :key="item.title"
        :to="item.to"
        variant="text"
      >
        {{ item.title }}
      </v-btn>
      <v-btn
        v-if="userStore.isAuthenticated"
        variant="text"
        @click="userStore.logout"
      >
        Logout
      </v-btn>
    </v-toolbar-items>
  </v-app-bar>

  <v-navigation-drawer
    v-model="drawer"
    temporary
  >
    <v-list>
      <v-list-item
        v-for="item in menuItems"
        :key="item.title"
        :to="item.to"
        :title="item.title"
      ></v-list-item>
      <v-list-item
        v-if="userStore.isAuthenticated"
        title="Logout"
        @click="userStore.logout"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue'
import useUserStore from '@/stores/user'

const userStore = useUserStore()
const drawer = ref(false)

const menuItems = [
  { title: 'Home', to: '/' },
  { title: 'Quiz', to: '/quiz' },
  { title: 'Sign Up', to: '/signup' },
  { title: 'Login', to: '/login' }
]
</script>
