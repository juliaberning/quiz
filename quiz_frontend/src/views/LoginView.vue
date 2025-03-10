<template>
<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-sm">
    <img class="mx-auto h-10 w-auto" src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company">
    <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Log into your account</h2>
  </div>

  <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <form class="space-y-6" @submit.prevent="submitForm">

      <!-- Email Field -->
      <div>
        <label for="email" class="block text-sm/6 font-medium text-gray-900">Email address</label>
        <div class="mt-2">
          <input type="email" v-model="form.email" name="email" id="email" autocomplete="email" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
        </div>
      </div>

      <!-- Password Field -->
      <div>
        <div class="flex items-center justify-between">
          <label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
          <div class="text-sm">
            <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
          </div>
        </div>
        <div class="mt-2">
          <input type="password" v-model="form.password" name="password" id="password" autocomplete="current-password" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
        </div>
      </div>

      <template v-if="errors">
        <div class="bg-red-300 text-white rounded-lg p-6">
          <p v-for="error in errors" v-bind:key="error"> {{ error }} </p>
        </div>
      </template>

      <!-- Submit Button -->
      <div>
        <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Login</button>
      </div>
    </form>

    <!-- Login Link -->
    <p class="mt-10 text-center text-sm/6 text-gray-500">
      Not a member?
      <router-link to="/signup" class="font-semibold text-indigo-600 hover:text-indigo-500">Sign up</router-link>

    </p>
  </div>
</div>

</template>

<script>
import axios from 'axios'

import { useUserStore } from '@/stores/user'

export default {
setup() {
    const userStore = useUserStore()

    return {
        userStore
    }
},

data() {
    return {
        form: {
            email: '',
            password: '',
        },
        errors: []
    }
},
methods: {
  async submitForm() {
    this.errors = []

    if (this.form.email === '') {
      this.errors.push('Your e-mail is missing')
    }

    if (this.form.password === '') {
      this.errors.push('Your password is missing')
    }

    if (this.errors.length === 0) {
      await axios
          .post('/api/login/', this.form)
          .then(response => {
              this.userStore.setToken(response.data)

              axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.access;
          })
          .catch(error => {
              console.log('error', error)

              this.errors.push('The email or password is incorrect! Or the user is not activated!')
          })
    }
    
    if (this.errors.length === 0) {
      await axios
          .get('/api/me/')
          .then(response => {
              this.userStore.setUserInfo(response.data)

              this.$router.push('/')
          })
          .catch(error => {
              console.log('error', error)
          })
    }
  }
}
}
</script>
