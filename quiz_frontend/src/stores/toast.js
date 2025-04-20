import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', {
    state: () => ({
        isVisible: false,
        message: '',
        color: 'success',
        timeout: 3000
    }),

    actions: {
        showToast(message, color = 'success', timeout = 3000) {
            this.message = message
            this.color = color
            this.timeout = timeout
            this.isVisible = true
        }
    }
})