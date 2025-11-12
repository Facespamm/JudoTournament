import {createRouter, createWebHistory} from 'vue-router'

import HomePage from '../components/View/HomePage/HomePage.vue'
import Login from '../components/View/Authentication/Login/Login.vue'
import Registration from "@/components/View/Authentication/Registration/Registration.vue";
import Athletes from "../components/View//Athletes/Athletes.vue";
import Tournament from "@/components/View/Tournaments/Tournament.vue";
const routes = [
    {path: '/', redirect: '/Home', component: HomePage},
    {path: '/Login', component: Login},
    {path: '/Home', component: HomePage},
    {path: '/registration', component: Registration},
    {path: '/Athletes', component: Athletes},
    {path: '/Tournament', component: Tournament},
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
