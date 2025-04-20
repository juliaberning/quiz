<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          
          <v-card-text>
            <v-form @submit.prevent="submitForm">
              <v-text-field
                v-model="form.email"
                label="Email"
                name="email"
                prepend-icon="mdi-email"
                type="email"
                required
              ></v-text-field>

              <v-text-field
                v-model="form.password"
                label="Password"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                required
              ></v-text-field>

              <v-alert
                v-if="errors.length > 0"
                type="error"
                class="mb-4"
              >
                <div v-for="error in errors" :key="error">
                  {{ error }}
                </div>
              </v-alert>

              <v-btn
                type="submit"
                color="primary"
                block
                class="mt-4"
              >
                Login
              </v-btn>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              text
              color="primary"
              to="/signup"
            >
              Not a member? Sign up
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import useUserStore from '@/stores/user'
import { useToastStore } from '@/stores/toast'

const router = useRouter()
const userStore = useUserStore()
const toastStore = useToastStore()

const form = ref({
  email: '',
  password: '',
})
const errors = ref([])

const submitForm = async () => {
  errors.value = []

  if (form.value.email === '') {
    errors.value.push('Your e-mail is missing')
  }

  if (form.value.password === '') {
    errors.value.push('Your password is missing')
  }

  if (errors.value.length === 0) {
    await axios
      .post('/api/login/', form.value)
      .then(response => {
        userStore.setToken(response.data)
        toastStore.showToast('Successfully logged in!', 'success')
        axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.access;
      })
      .catch(error => {
        console.log('error', error)
        toastStore.showToast('The email or password is incorrect! Or the user is not activated!', 'error')
        errors.value.push('The email or password is incorrect! Or the user is not activated!')
      })
  }
  
  if (errors.value.length === 0) {
    await axios
      .get('/api/me/')
      .then(response => {
        userStore.setUserInfo(response.data)
        router.push('/')
      })
      .catch(error => {
        console.log('error', error)
        toastStore.showToast('Failed to fetch user information', 'error')
      })
  }
}
</script>
