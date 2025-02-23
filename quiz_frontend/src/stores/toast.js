import { defineStore } from 'pinia'

export const useToastStore = defineStore({
    id: 'toast',

    state: () => ({
        toast: {
            show: false,
            message: null,
            type: null,
        }
    }),

    actions: {
        showToast(message, type) {
            console.log('showToast', message, type)

            this.toast.message = message
            this.toast.type = type
            this.toast.show = true
        },

        hideToast() {
            console.log('hideToast')

            this.toast.show = false
        }
    }
})