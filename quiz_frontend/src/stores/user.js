import { defineStore } from 'pinia'
import axios from 'axios'
import { ref } from 'vue'

const useUserStore = defineStore('user', {
    state: () => ({
        isAuthenticated: false,
        id: null,
        name: null,
        email: null,
        access: null,
        refresh: null,
    }),

    actions: {
        initStore() {
            if (localStorage.getItem('user.access')) {
                this.access = JSON.parse(localStorage.getItem('user.access') || '')
                this.refresh = JSON.parse(localStorage.getItem('user.refresh') || '')
                this.id = JSON.parse(localStorage.getItem('user.id') || '')
                this.name = JSON.parse(localStorage.getItem('user.name') || '')
                this.email = JSON.parse(localStorage.getItem('user.email') || '')
                this.isAuthenticated = true

                this.refreshToken()

                console.log('Initialized users', this)
            }
        },

        setToken({ access, refresh }) {
            console.log('setToken', { access, refresh })

            this.access = access
            this.refresh = refresh
            this.isAuthenticated = true

            localStorage.setItem('user.access', access)
            localStorage.setItem('user.refresh', refresh)
        },

        removeToken() {
            console.log('removeToken')

            this.access = null
            this.refresh = null
            this.isAuthenticated = false
            this.id = null
            this.name = null
            this.email = null

            localStorage.setItem('user.access', '')
            localStorage.setItem('user.refresh', '')
            localStorage.setItem('user.id', '')
            localStorage.setItem('user.name', '')
            localStorage.setItem('user.email', '')
        },

        setUserInfo({ id, name, email }) {
            console.log('setUserInfo', { id, name, email })

            this.id = id
            this.name = name
            this.email = email

            localStorage.setItem('user.id', id.toString())
            localStorage.setItem('user.name', name)
            localStorage.setItem('user.email', email)

            console.log('User', this)
        },

        refreshToken() {
            axios.post('api/v1/account/refresh/', {
                refresh: this.refresh
            })
            .then(response => {
                this.access = response.data.access

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

export default useUserStore