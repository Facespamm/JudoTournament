import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useCookies } from "vue3-cookies"

export const useAuthStore = defineStore('auth', () => {
    const { cookies } = useCookies()

    const token = ref(cookies.get('jwt_token') || null)
    const user = ref(JSON.parse(localStorage.getItem('user_data') || 'null'))

    const isAuthenticated = computed(() => !!token.value)

    const setToken = (newToken) => {
        token.value = newToken
        // Сохраняем токен в cookies на 7 дней
        cookies.set('jwt_token', newToken, '7d')
    }

    const setUser = (userData) => {
        user.value = userData
        localStorage.setItem('user_data', JSON.stringify(userData))
    }

    const updateUserRole = (role) => {
        if (user.value) {
            user.value.role = role
            localStorage.setItem('user_data', JSON.stringify(user.value))
        }
    }

    const logout = () => {
        token.value = null
        user.value = null
        cookies.remove('jwt_token')
        localStorage.removeItem('user_data')
    }

    return {
        token,
        user,
        isAuthenticated,
        setToken,
        setUser,
        updateUserRole,
        logout
    }
})