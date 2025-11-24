<template>
  <div class="admin-dashboard">
    <!-- ЗАГОЛОВОК -->
    <div class="dashboard-header">
      <h1>Панель администратора</h1>
      <p>Обзор системы управления турнирами по дзюдо</p>
    </div>

    <!-- СТАТИСТИКА -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">🏆</div>
        <div class="stat-info">
          <div class="stat-number">{{ stats.total_tournaments || 0 }}</div>
          <div class="stat-label">Всего турниров</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">⚡</div>
        <div class="stat-info">
          <div class="stat-number">{{ stats.active_tournaments || 0 }}</div>
          <div class="stat-label">Активных турниров</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-info">
          <div class="stat-number">{{ stats.total_athletes || 0 }}</div>
          <div class="stat-label">Участников</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">🏢</div>
        <div class="stat-info">
          <div class="stat-number">{{ stats.total_clubs || 0 }}</div>
          <div class="stat-label">Клубов</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">👤</div>
        <div class="stat-info">
          <div class="stat-number">{{ stats.total_users || 0 }}</div>
          <div class="stat-label">Пользователей</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">🥋</div>
        <div class="stat-info">
          <div class="stat-number">{{ stats.live_fights || 0 }}</div>
          <div class="stat-label">Live схваток</div>
        </div>
      </div>
    </div>

    <!-- БЫСТРЫЕ ДЕЙСТВИЯ -->
    <div class="quick-actions-section">
      <h2>Быстрые действия</h2>
      <div class="actions-grid">
        <button class="action-btn" @click="navigateToCreateTournament">
          <span class="action-icon">➕</span>
          <span class="action-text">Создать турнир</span>
        </button>

        <button class="action-btn" @click="navigateToUsers">
          <span class="action-icon">👥</span>
          <span class="action-text">Управление пользователями</span>
        </button>

        <button class="action-btn" @click="navigateToClubs">
          <span class="action-icon">🏢</span>
          <span class="action-text">Управление клубами</span>
        </button>

        <button class="action-btn" @click="navigateToAthletes">
          <span class="action-icon">🥋</span>
          <span class="action-text">Регистрация участников</span>
        </button>
      </div>
    </div>

    <!-- АКТИВНЫЕ ТУРНИРЫ -->
    <div class="active-tournaments-section">
      <div class="section-header">
        <h2>Активные турниры</h2>
        <button class="view-all-btn" @click="navigateToTournaments">Все турниры</button>
      </div>

      <div class="tournaments-grid">
        <div v-for="tournament in activeTournaments" :key="tournament.id" class="tournament-card">
          <div class="tournament-header">
            <span class="tournament-status" :class="getStatusClass(tournament.status)">
              {{ getStatusText(tournament.status) }}
            </span>
            <span class="tournament-date">{{ formatDate(tournament.start_date) }}</span>
          </div>
          <h3 class="tournament-name">{{ tournament.name }}</h3>
          <p class="tournament-location">{{ tournament.venue }}, {{ tournament.city }}</p>
          <div class="tournament-stats">
            <span class="stat">{{ tournament.athletes_count || 0 }} участников</span>
            <span class="stat">{{ tournament.progress_percentage || 0 }}% завершено</span>
          </div>
          <button class="manage-btn" @click="navigateToTournament(tournament.id)">Управлять</button>
        </div>

        <div v-if="activeTournaments.length === 0" class="no-tournaments">
          <p>Нет активных турниров</p>
          <button class="create-btn" @click="navigateToCreateTournament">Создать первый турнир</button>
        </div>
      </div>
    </div>

    <!-- TOAST УВЕДОМЛЕНИЕ (встроенное) -->
    <transition name="fade">
      <div v-if="toast.visible" class="toast-notification" :class="toast.type">
        <div class="toast-content">
          <span class="toast-icon">{{ toast.type === 'success' ? '✓' : '✕' }}</span>
          <span class="toast-message">{{ toast.message }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const stats = ref({})
const activeTournaments = ref([])
const recentEvents = ref([])

// Toast состояние
const toast = ref({
  visible: false,
  message: '',
  type: 'success' // success | error
})

// Навигация на страницу создания турнира
const navigateToCreateTournament = () => {
  router.push('/admin/tournament-settings')
}

// Универсальная функция показа toast
const showToast = (message, type = 'success', duration = type === 'success' ? 3000 : 4000) => {
  toast.value = { visible: true, message, type }
  setTimeout(() => {
    toast.value.visible = false
  }, duration)
}

const loadDashboardData = async () => {
  try {
    // Загрузка статистики
    const statsResponse = await fetch('/admin/api/quick_stats', {
      headers: { 'X-API-Key': 'mobile_app_2024' }
    })
    if (statsResponse.ok) {
      stats.value = await statsResponse.json()
    }

    // Загрузка активных турниров
    const tournamentsResponse = await fetch('/api/tournament?status=LIVE', {
      headers: { 'X-API-Key': 'mobile_app_2024' }
    })
    if (tournamentsResponse.ok) {
      const data = await tournamentsResponse.json()
      activeTournaments.value = data.tournaments || []
    }

    // Мок данные для событий
    recentEvents.value = [
      { id: 1, time: '10:30', text: 'Создан новый турнир "Кубок Астаны 2024"' },
      { id: 2, time: '09:15', text: 'Зарегистрирован новый участник: Азамат Сарсенбеков' },
      { id: 3, time: '08:45', text: 'Завершена схватка #24 в турнире "Чемпионат Казахстана"' }
    ]

  } catch (error) {
    console.error('Ошибка загрузки данных:', error)

    // Мок данные для демонстрации
    stats.value = {
      total_tournaments: 12,
      active_tournaments: 3,
      total_athletes: 245,
      total_clubs: 18,
      total_users: 8,
      live_fights: 2
    }

    activeTournaments.value = [
      {
        id: 1,
        name: 'Чемпионат Казахстана среди кадетов',
        status: 'LIVE',
        start_date: '2025-03-17',
        venue: 'Дворец спорта',
        city: 'Астана',
        athletes_count: 125,
        progress_percentage: 45
      },
      {
        id: 2,
        name: 'Гран-при Казахстана 2025',
        status: 'BRACKETS',
        start_date: '2025-05-10',
        venue: 'Спорткомплекс "Алатау"',
        city: 'Алматы',
        athletes_count: 240,
        progress_percentage: 20
      }
    ]
  }
}

// Вспомогательные функции
const getStatusClass = (status) => {
  const statusMap = {
    'LIVE': 'status-live',
    'BRACKETS': 'status-brackets',
    'REGISTRATION': 'status-registration',
    'WEIGHING': 'status-weighing'
  }
  return statusMap[status] || 'status-default'
}

const getStatusText = (status) => {
  const statusMap = {
    'LIVE': 'LIVE',
    'BRACKETS': 'Сетки',
    'REGISTRATION': 'Регистрация',
    'WEIGHING': 'Взвешивание'
  }
  return statusMap[status] || status
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU')
}

// Навигация
const navigateToTournaments = () => {
  router.push('/tournament')
}

const navigateToUsers = () => {
  router.push('/admin/users')
}

const navigateToClubs = () => {
  router.push('/admin/clubs')
}

const navigateToAthletes = () => {
  router.push('/registrationathletes')
}

const navigateToTournament = (tournamentId) => {
  router.push(`/tournament/${tournamentId}`)
}

onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.admin-dashboard {
  padding: 90px 2rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 3rem;
  padding-top: 1rem;
}

.dashboard-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.dashboard-header p {
  font-size: 1.1rem;
  color: #666;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-icon {
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #c89b3c, #e0b456);
  border-radius: 12px;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 2.2rem;
  font-weight: 800;
  color: #1a1a1a;
  line-height: 1;
  margin-bottom: 0.3rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.quick-actions-section {
  margin-bottom: 3rem;
}

.quick-actions-section h2 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #1a1a1a;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.action-btn {
  background: white;
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  border-color: #c89b3c;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(200, 155, 60, 0.15);
}

.action-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #c89b3c, #e0b456);
  border-radius: 50%;
}

.action-text {
  font-weight: 600;
  color: #1a1a1a;
  text-align: center;
}

.active-tournaments-section {
  margin-bottom: 3rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1a1a1a;
}

.view-all-btn {
  background: none;
  border: 2px solid #c89b3c;
  color: #c89b3c;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-all-btn:hover {
  background: #c89b3c;
  color: white;
}

.tournaments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

.tournament-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
}

.tournament-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.tournament-status {
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
}

.status-live { background: #ff4444; color: white; }
.status-brackets { background: #ffaa00; color: white; }
.status-registration { background: #00aa00; color: white; }
.status-weighing { background: #0088ff; color: white; }
.status-default { background: #666; color: white; }

.tournament-date {
  font-size: 0.9rem;
  color: #666;
}

.tournament-name {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
}

.tournament-location {
  color: #666;
  margin-bottom: 1rem;
}

.tournament-stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.tournament-stats .stat {
  font-size: 0.9rem;
  color: #666;
}

.manage-btn {
  background: linear-gradient(135deg, #c89b3c, #e0b456);
  color: white;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.manage-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(200, 155, 60, 0.3);
}

.no-tournaments {
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 16px;
  border: 2px dashed #e8e8e8;
}

.create-btn {
  background: linear-gradient(135deg, #c89b3c, #e0b456);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .admin-dashboard {
    padding: 80px 1rem 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .tournaments-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}

/* TOAST УВЕДОМЛЕНИЕ */
.toast-notification {
  position: fixed;
  bottom: 30px;
  right: 30px;
  min-width: 320px;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  box-shadow: 0 10px 30px rgba(0,0,0,0.25);
  z-index: 10000;
  animation: slideIn 0.4s ease-out;
}
.toast-notification.success { background: linear-gradient(135deg, #28a745, #34ce57); }
.toast-notification.error   { background: linear-gradient(135deg, #dc3545, #e4606d); }
.toast-content { display: flex; align-items: center; gap: 12px; }
.toast-icon { font-size: 1.5rem; font-weight: bold; }

.fade-enter-active, .fade-leave-active { transition: opacity .3s ease, transform .3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(20px); }

@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }
}

@media (max-width: 768px) {
  .toast-notification { left: 20px; right: 20px; bottom: 20px; }
}
</style>