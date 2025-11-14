// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../components/View/HomePage/HomePage.vue'
import Login from '../components/View/Authentication/Login/Login.vue'
import Registration from "@/components/View/Authentication/Registration/Registration.vue"
import Athletes from "../components/View/Athletes/Athletes.vue"
import Tournament from "@/components/View/Tournaments/Tournament.vue"

const routes = [
    { path: '/', redirect: '/home' },

    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: { hideSidebar: true }
    },
    {
        path: '/registration',
        name: 'registration',
        component: Registration,
        meta: { hideSidebar: true }
    },
    {
        path: '/home',
        name: 'home',
        component: HomePage
    },
    {
        path: '/athletes',
        name: 'athletes',
        component: Athletes
    },
    {
        path: '/tournament',
        name: 'tournament',
        component: Tournament
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router