<template>
  <div class="home_page_main-layout">
    <div class="content-wrapper">
      <!-- Левая карточка: Текущий турнир -->
      <div class="tournament-card" @click="goToFeatured">
        <div class="tournament-placeholder">
          <div class="tournament-overlay">
            <h1>{{ featured?.name || 'Текущий турнир' }}</h1>
            <p class="date">
              {{ featured ? formatDate(featured.start_date, featured.end_date) + ' — ' + (featured.city || 'Алматы') : '14–16 нояб. 2025 — Алматы' }}
            </p>
            <p class="stats">{{ featured?.athletes_count || 370 }} дзюдоистов</p>
            <div class="tournament-buttons">
              <button class="btn-outline">Обзор</button>
              <!-- Кнопка «Календарь» ведёт на страницу всех турниров -->
              <button class="btn-primary" @click.stop="goToAllTournaments">Календарь</button>
            </div>
            <span v-if="featured?.status === 'LIVE'" class="live-badge">ПРЯМОЙ ЭФИР</span>
          </div>
        </div>
      </div>

      <!-- Правая панель -->
      <div class="events-panel">
        <h2 class="panel-title">Актуальные соревнования</h2>
        <div class="events-list">
          <div
              v-for="t in upcoming"
              :key="t.id"
              class="event-item"
              :class="{ live: t.status === 'LIVE' }"
              @click="goToTournament(t.id)"
          >
            <span v-if="t.status === 'LIVE'" class="live-badge">ПРЯМОЙ ЭФИР</span>
            <p class="event-date">{{ formatDate(t.start_date, t.end_date) }} — {{ t.city }}</p>
            <h3>{{ t.name }}</h3>
            <p class="event-stats">{{ t.athletes_count || 0 }} дзюдоистов</p>
          </div>

          <div v-if="!isLoading && upcoming.length === 0" class="event-item">
            <p>Нет актуальных соревнований</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { fetchTournaments } from '@/components/View/Tournaments/fetchTournaments.js'

const router = useRouter()
const tournaments = ref([])
const isLoading = ref(true)

// Главный турнир (LIVE или первый в списке)
const featured = computed(() =>
    tournaments.value.find(t => t.status === 'LIVE') || tournaments.value[0] || null
)

// Ближайшие 3 турнира (кроме главного)
const upcoming = computed(() =>
    tournaments.value
        .filter(t => t.id !== featured.value?.id)
        .slice(0, 3)
)

const formatDate = (start, end) => {
  if (!start) return ''
  const options = { day: 'numeric', month: 'short' }
  const s = new Date(start).toLocaleDateString('ru-RU', options)
  if (!end || start === end) return s
  const e = new Date(end).toLocaleDateString('ru-RU', options)
  return `${s}–${e}`
}

// Переход в детали турнира
const goToTournament = (id) => {
  router.push({ name: 'tournamentdetails', params: { id } })
}

// Переход на главный турнир (по клику на карточку)
const goToFeatured = () => {
  if (featured.value) goToTournament(featured.value.id)
}

// Переход на страницу всех турниров (по кнопке «Календарь»)
const goToAllTournaments = () => {
  router.push('/tournament')          // или { name: 'tournaments' } если у тебя именованный роут
}

onMounted(async () => {
  try {
    const res = await fetchTournaments()
    if (res.success) tournaments.value = res.data
  } catch (e) {
    console.error('Ошибка загрузки турниров на главную:', e)
  } finally {
    isLoading.value = false
  }
})
</script>

<script>
import "@/components/View/HomePage/HomePage.css"
</script>

<style scoped>
/* Твой CSS полностью сохранён — ничего не менял */
</style>