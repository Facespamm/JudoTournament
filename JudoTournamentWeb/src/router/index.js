// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../components/View/HomePage/HomePage.vue'
import Login from '../components/View/Authentication/Login/Login.vue'
import Registration from "@/components/View/Authentication/Registration/Registration.vue"
import Athletes from "../components/View/Athletes/Athletes.vue"
import Tournament from "@/components/View/Tournaments/Tournament.vue"
import RegistrationAthletes from "@/components/View/RegistrationAthletes/RegistrationAthletes.vue";
import TournamentDetails from "@/components/View/TournamentDetails/TournamentDetails.vue";
import Referees from"@/components/View/Referee/Referee.vue"
import Tatami from "@/components/View/Tatami/Tatami.vue";
import Scoreboard from "@/components/View/Scoreboard/Scoreboard.vue";
import AdminDashboard from "@/components/View/AdminDashboard/AdminDashboard.vue";
import Clubs from "@/components/View/Clubs/Clubs.vue";
import Users from "@/components/View/Users/Users.vue";
import AthleteDetail from "@/components/View/AthleteDetail/AthleteDetail.vue";
import TournamentSettings from "@/components/View/AdminDashboard/TournamentSettings.vue";
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
    {
        path: '/registrationathletes',
        name: 'registrationathletes',
        component: RegistrationAthletes
    },
    {
        path: '/tournamentdetails/:id',
        name: 'tournamentdetails',
        component: TournamentDetails,
    },
    {
        path: '/referee',
        name: 'referee',
        component: Referees,
    },
    {
        path: '/tatami',
        name: 'tatami',
        component: Tatami,
    },
    {
        path: '/scoreboard',
        name: 'scoreboard',
        component: Scoreboard,
    },
    {
        path: '/admin',
        name: 'admin',
        component: AdminDashboard,
    },
    {
        path: '/admin/clubs',
        name: 'clubs',
        component: Clubs,
    },
    {
        path: '/admin/users',
        name: 'users',
        component: Users,
    },{
        path: '/admin/tournament-settings',
        name: 'tournament-settings',
        component: TournamentSettings,
    }, {
        path: '/athlete/:id',
        name: 'athlete-detail',
        component: AthleteDetail,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router