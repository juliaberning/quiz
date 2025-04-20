import { defineStore } from 'pinia'
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'

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
            const access = localStorage.getItem('user.access')
            const refresh = localStorage.getItem('user.refresh')
            const id = localStorage.getItem('user.id')
            const name = localStorage.getItem('user.name')
            const email = localStorage.getItem('user.email')

            if (access && refresh) {
                this.access = access
                this.refresh = refresh
                this.id = id
                this.name = name
                this.email = email
                this.isAuthenticated = true

                // Set the authorization header
                axios.defaults.headers.common['Authorization'] = "Bearer " + access

                // Refresh the token
                this.refreshToken()

                console.log('Initialized user store:', {
                    isAuthenticated: this.isAuthenticated,
                    name: this.name,
                    email: this.email
                })
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
            axios.post('/api/refresh/', {
                refresh: this.refresh
            })
            .then(response => {
                this.access = response.data.access

                localStorage.setItem('user.access', response.data.access)

                axios.defaults.headers.common['Authorization'] = "Bearer " + response.data.access
            })
            .catch((error) => {
                console.log('Error refreshing token:', error)
                this.removeToken()
            })
        },

        logout() {
            this.removeToken()
            delete axios.defaults.headers.common['Authorization']
            
            const router = useRouter()
            const toastStore = useToastStore()
            
            toastStore.showToast('Successfully logged out!', 'success')
            router.push('/login')
        }
    },
})

export default useUserStore