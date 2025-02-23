import { defineStore } from 'pinia'
import axios from 'axios'
import { ref } from 'vue'

export const useUserStore = defineStore({
    id: 'user',

    state: () => ({
        user: {
            isAuthenticated: false,
            id: null,
            name: null,
            email: null,
            access: null,
            refresh: null ,
        }
    }),

    actions: {
        initStore() {
            if (localStorage.getItem('user.access')) {
                this.user,access = JSON.parse(localStorage.getItem('user.access'))
                this.user.refresh = JSON.parse(localStorage.getItem('user.refresh'))
                this.user.id = JSON.parse(localStorage.getItem('user.id'))
                this.user.name = JSON.parse(localStorage.getItem('user.name'))
                this.user.email = JSON.parse(localStorage.getItem('user.email'))
                this.user.isAuthenticated = true

                this.refreshToken()

                console.log('Initialized users', this.user)
            }
        },

        setToken(data) {
            console.log('setToken', data)

            this.user.access = data.access
            this.user.refresh = data.refresh
            this.user.isAuthenticated = true

            localStorage.setItem('user.access', data.access)
            localStorage.setItem('user.refresh', data.refresh)
        },

        removeToken() {
            console.log('removeToken')

            this.user.access = null
            this.user.refresh = null
            this.user.isAuthenticated = false
            this.user.id = false
            this.user.name = false
            this.user.email = false

            localStorage.setItem('user.access', ' ')
            localStorage.setItem('user.refresh', ' ')
            localStorage.setItem('user.id', ' ')
            localStorage.setItem('user.name', ' ')
            localStorage.setItem('user.email', ' ')

        }, 

        setUserInfo(user) {
            console.log('setUserInfo', user)

            this.user.id = user.id
            this.user.name = user.name
            this.user.email = user.email

            localStorage.setItem('user.id', user.id)
            localStorage.setItem('user.name', user.name)
            localStorage.setItem('user.email', user.email)

            console.log('User', this.user)

        }, 

        refreshToken() {

            axios.post('api/v1/account/refresh/', {
                refresh: this.user.refresh
            })
            .then(response => {
                this.user.access = response.data.access

                localStorage.setItem('user.access', response.data.access)

                axios.defaults.headers.common['Authorization'] = "Bearer " + response.data.access
            })
            .catch((error) => {
                console.log('Error', error)

                this.removeToken()
                
            })
        }
    },
})