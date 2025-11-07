import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../components/View/HomePage/HomePage.vue'
import Login from '../components/View/Authentication/Login/Login.vue'

const routes = [
{ path: '/Login', component: Login },
{ path: '/Home', component: HomePage },
]

const router = createRouter({
history: createWebHistory(),
routes,
})

export default router
