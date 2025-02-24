<template>
    <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <img class="mx-auto h-10 w-auto" src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company">
        <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Create your account</h2>
      </div>
  
      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form class="space-y-6" @submit.prevent="submitForm">
          <!-- Name Field -->
          <div>
            <label for="name" class="block text-sm/6 font-medium text-gray-900">Full Name</label>
            <div class="mt-2">
              <input type="text" v-model="form.name" name="name" id="name" autocomplete="name" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
            </div>
          </div>
  
          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm/6 font-medium text-gray-900">Email address</label>
            <div class="mt-2">
              <input type="email" v-model="form.email" name="email" id="email" autocomplete="email" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
            </div>
          </div>
  
          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
            <div class="mt-2">
              <input type="password" v-model="form.password1" name="password" id="password" autocomplete="new-password" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
            </div>
          </div>
  
          <!-- Confirm Password Field -->
          <div>
            <label for="confirm_password" class="block text-sm/6 font-medium text-gray-900">Confirm Password</label>
            <div class="mt-2">
              <input type="password" v-model="form.password2" name="confirm_password" id="confirm_password" autocomplete="new-password" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
            </div>
          </div>
  
          <template v-if="errors">
            <div class="bg-red-300 text-white rounded-lg p-6">
              <p v-for="error in errors" v-bind:key="error"> {{ error }} </p>
            </div>
          </template>

          <!-- Submit Button -->
          <div>
            <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Create Account</button>
          </div>
        </form>
  
        <!-- Login Link -->
        <p class="mt-10 text-center text-sm/6 text-gray-500">
          Already have an account?
          <router-link to="/login" class="font-semibold text-indigo-600 hover:text-indigo-500">Log in </router-link>
        </p>
      </div>
    </div>
</template>

<script>
import axios from 'axios';
import { useToastStore } from '@/stores/toast';

export default {
  setup() {
    const toastStore = useToastStore();

    return {
      toastStore
    }
  },

  data() {
    return {
      form: {
        email: '',
        name: '',
        password1: '',
        password2: '',
      },
      errors: [], 
    }
  },

  methods: {
    submitForm() {
      this.errors = []
      
      if (this.form.email === '') {
        this.errors.push('Your email is required.')
      }

      if (this.form.name === '') {
        this.errors.push('Your name is required.') 
      }

      if (this.form.password1 === '') {
        this.errors.push('Your password is required.')
      }

      if (this.errors.length === 0) {
        axios
          .post('/api/signup/', this.form)
          .then(response => {
            console.log('Signup Response:', response);
            if (response.data.message === 'success') {
              this.toastStore.showToast(5000, 'The user is registered. Please login', 'bg-emerald-green');
              this.form.email = '';
              this.form.name = ''; 
              this.form.password1 = '';
              this.form.password2 = '';
            } else {
              this.toastStore.showToast(5000, 'Something went wrong. Please try again', 'bg-red-500');
            }
          })
          .catch(error => {
            console.log('error', error)
          })
      }

    }
  }
}

</script>
