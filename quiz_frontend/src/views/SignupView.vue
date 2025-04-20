<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Create Account</v-toolbar-title>
          </v-toolbar>
          
          <v-card-text>
            <v-form @submit.prevent="submitForm">
              <v-text-field
                v-model="form.name"
                label="Full Name"
                name="name"
                prepend-icon="mdi-account"
                type="text"
                required
              ></v-text-field>

              <v-text-field
                v-model="form.email"
                label="Email"
                name="email"
                prepend-icon="mdi-email"
                type="email"
                required
              ></v-text-field>

              <v-text-field
                v-model="form.password1"
                label="Password"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                required
              ></v-text-field>

              <v-text-field
                v-model="form.password2"
                label="Confirm Password"
                name="confirm_password"
                prepend-icon="mdi-lock-check"
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
                Create Account
              </v-btn>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              text
              color="primary"
              to="/login"
            >
              Already have an account? Log in
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()

const form = ref({
  email: '',
  name: '',
  password1: '',
  password2: '',
})
const errors = ref([])

const submitForm = () => {
  errors.value = []
  
  if (form.value.email === '') {
    errors.value.push('Your email is required.')
  }

  if (form.value.name === '') {
    errors.value.push('Your name is required.') 
  }

  if (form.value.password1 === '') {
    errors.value.push('Your password is required.')
  }

  if (errors.value.length === 0) {
    axios
      .post('/api/signup/', form.value)
      .then(response => {
        console.log('Signup Response:', response);
        if (response.data.message === 'success') {
          toastStore.showToast(5000, 'The user is registered. Please login', 'bg-emerald-green');
          form.value.email = '';
          form.value.name = ''; 
          form.value.password1 = '';
          form.value.password2 = '';
        } else {
          toastStore.showToast(5000, 'Something went wrong. Please try again', 'bg-red-500');
        }
      })
      .catch(error => {
        console.log('error', error)
      })
  }
}
</script>
