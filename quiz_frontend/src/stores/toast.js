import { defineStore } from 'pinia'

const useToastStore = defineStore('toast', {
    state: () => ({
        show: false,
        message: null,
        type: null,
    }),

    actions: {
        showToast(message, type) {
            console.log('showToast', message, type)

            this.message = message
            this.type = type
            this.show = true
        },

        hideToast() {
            console.log('hideToast')

            this.show = false
        }
    }
})

export default useToastStore