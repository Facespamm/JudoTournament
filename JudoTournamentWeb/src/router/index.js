import { createRouter, createWebHistory } from 'vue-router'

import {setupGuards} from "@/router/guard.js";
import {USER_ROLES} from "@/composables/useAuth.js";
const { ADMIN, REFEREE, SCOREBOARD, VIEWER, ATHLETE } = USER_ROLES
const routes = [
    { path: '/', redirect: '/login' },

    {
        path: '/login',
        name: 'login',
        component: () => import('../components/View/Authentication/Login/Login.vue'),
        meta: { hideSidebar: true,public: true }
    },
    {
        path: '/registration',
        name: 'registration',
        component: () => import('@/components/View/Authentication/Registration/Registration.vue'),
        meta: { hideSidebar: true,public: true }

    },

    /* ==================== ТУРНИР ДЕТАЛИ (один маршрут!) ==================== */
    {
        path: '/tournamentdetails/:id',
        name: 'tournamentdetails',
        component: () => import('@/components/View/TournamentDetails/TournamentDetails.vue'),
        meta: {
            hideSidebar: true,
            align: 'center'
        },
        children: [
            {
                path: '',
                name: 'tournament-overview',
                component: () => import('@/components/View/TournamentDetails/OverviewTab.vue')
            },
            {
                path: 'draw',
                component: () => import('@/components/View/TournamentDetails/DrawTab.vue')
            },
            {
                path: 'order',
                component: () => import('@/components/View/TournamentDetails/OrderTab.vue')
            },
            {
                path: 'athletes',
                component: () => import('@/components/View/TournamentDetails/AthletesTab.vue')
            },
            {
                path: 'results',
                component: () => import('@/components/View/TournamentDetails/WeightingTab.vue')
            },
            {
                path: 'live',
                component: () => import('@/components/View/TournamentDetails/LiveTab.vue')
            }
        ]
    },

    { path: '/home', name: 'home', component: () => import('../components/View/HomePage/HomePage.vue') },
    { path: '/adminregistration', name: 'adminregistration', component: () => import('@/components/View/AdminRegistrationAthletes/AdminRegistrationAthletes.vue'), meta: { roles: [ADMIN] } },
    { path: '/refereeManagement', name: 'refereeManagement', component: () => import('@/components/View/RefereeManagement/RefereeManagement.vue') , meta: { roles: [ADMIN,REFEREE] } },
    { path: '/athletes', name: 'athletes', component: () => import('../components/View/Athletes/Athletes.vue'), meta: { roles: [ADMIN, REFEREE, ATHLETE,VIEWER] } },
    { path: '/registrationathlete', name: 'registrationathlete', component: () => import('@/components/View/RegistrationAthletesTournament/RegistrationModal.vue'), meta: { hideSidebar: true, roles: [ATHLETE,ADMIN,REFEREE] } },
    { path: '/tournament', name: 'tournament', component: () => import('@/components/View/Tournaments/Tournament.vue'),meta: { roles: [ADMIN, REFEREE, VIEWER,ATHLETE] } },
    { path: '/referees', name: 'referees', component: () => import('@/components/View/RefereeDashboard/RefereeDashboard.vue'), meta: { roles: [REFEREE,ADMIN] } },
    { path: '/roles', name: 'roles', component: () => import('@/components/View/Authentication/SelectRoleView/ManageRole.vue'), meta: { roles: [VIEWER] } },
    { path: '/registrationathletes', name: 'registrationathletes', component: () => import('@/components/View/RegistrationAthletes/RegistrationAthletes.vue'),meta: { roles: [ADMIN,ATHLETE,REFEREE] } },
    { path: '/referee', name: 'referee', component: () => import('@/components/View/Referee/Referee.vue') , meta: { roles: [ADMIN,REFEREE] } },
    { path: '/weighing', name: 'weighing', component: () => import('@/components/View/Weighings/Weighings.vue'), meta: { hideSidebar: true,roles: [ADMIN,REFEREE] } },
    { path: '/tatami', name: 'tatami', component: () => import('@/components/View/Fight/Fight.vue') ,meta : { roles: [REFEREE, ADMIN] } },
    { path: '/scoreboard', name: 'scoreboard', component: () => import('@/components/View/Scoreboard/Scoreboard.vue') },
    { path: '/admin', name: 'admin', component: () => import('@/components/View/AdminDashboard/AdminDashboard.vue'),meta: { roles: [ADMIN] } },
    { path: '/brackets', name: 'bracket', component: () => import('@/components/View/Brackets/Bracket.vue'),meta: { roles: [ADMIN,REFEREE] } },
    { path: '/clubs', name: 'clubs', component: () => import('@/components/View/Clubs/Clubs.vue'),meta: { roles: [ADMIN,REFEREE,VIEWER,ATHLETE] } },
    { path: '/admin/clubsAdmin', name: 'clubsAdmin', component: () => import('@/components/View/ClubAdmin/ClubsAdmin.vue'), meta: { roles: [ADMIN] } },
    { path: '/admin/users', name: 'users', component: () => import('@/components/View/Users/Users.vue'),meta: { roles: [ADMIN] } },
    { path: '/admin/tournament-settings', name: 'tournament-settings', component: () => import('@/components/View/TournamentManagement/TournamentSettings.vue') ,meta: { roles: [ADMIN,REFEREE,ATHLETE,VIEWER] } },
    { path: '/admin/tournament-settings', name: 'tournament-settings', component: () => import('@/components/View/TournamentManagement/TournamentSettings.vue') ,meta: { roles: [ADMIN,REFEREE,ATHLETE,VIEWER] } },
    { path: '/athlete/:id', name: 'athlete-detail', component: () => import('@/components/View/AthleteDetail/AthleteDetail.vue') },   // удалил дубликат
    { path: '/brackets/:id', name: 'bracket-detail', component: () => import('@/components/View/Brackets/BracketViewDetail.vue') },
    {
        path: '/fights/:id',
        name: 'fight-detail',
        component: () => import('@/components/View/FightDetail/FightDetail.vue'),
        meta: {
            hideSidebar: true,
            align: 'center'
        }
    },    { path: '/referee/:id', name: 'referee-detail', component: () => import('@/components/View/RefereeDetail/RefereeDetail.vue') }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

setupGuards(router) // ← подключаем guard

export default router
