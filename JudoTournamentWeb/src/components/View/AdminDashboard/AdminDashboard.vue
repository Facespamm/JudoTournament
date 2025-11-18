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
        <button class="action-btn" @click="openCreateModal">
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
          <button class="create-btn" @click="openCreateModal">Создать первый турнир</button>
        </div>
      </div>
    </div>

    <!-- МОДАЛЬНОЕ ОКНО СОЗДАНИЯ ТУРНИРА -->
    <div v-if="isCreateModalOpen" class="modal-overlay" @click.self="closeCreateModal">
      <div class="modal-content">
        <h2>Создать новый турнир</h2>
        <form @submit.prevent="createTournament">
          <div class="form-grid">
            <div class="form-group">
              <label for="name">Название турнира</label>
              <input v-model="form.name" type="text" id="name" placeholder="Введите название" required />
              <span v-if="errors.name" class="error">{{ errors.name }}</span>
            </div>
            <div class="form-group">
              <label for="description">Описание</label>
              <textarea v-model="form.description" id="description" placeholder="Введите описание турнира"></textarea>
            </div>
            <div class="form-group">
              <label for="start_date">Дата начала</label>
              <input v-model="form.start_date" type="date" id="start_date" required />
              <span v-if="errors.start_date" class="error">{{ errors.start_date }}</span>
            </div>
            <div class="form-group">
              <label for="end_date">Дата окончания</label>
              <input v-model="form.end_date" type="date" id="end_date" required />
              <span v-if="errors.end_date" class="error">{{ errors.end_date }}</span>
            </div>
            <div class="form-group">
              <label for="venue">Место проведения</label>
              <input v-model="form.venue" type="text" id="venue" placeholder="Введите место" required />
              <span v-if="errors.venue" class="error">{{ errors.venue }}</span>
            </div>
            <div class="form-group">
              <label for="city">Город</label>
              <input v-model="form.city" type="text" id="city" placeholder="Введите город" />
            </div>
            <div class="form-group">
              <label for="country">Страна</label>
              <input v-model="form.country" type="text" id="country" value="Казахстан" />
            </div>
            <div class="form-group">
              <label for="tatami_count">Количество татами</label>
              <input v-model.number="form.tatami_count" type="number" id="tatami_count" min="1" required />
            </div>
            <div class="form-group">
              <label for="fight_duration">Длительность схватки (сек)</label>
              <input v-model.number="form.fight_duration" type="number" id="fight_duration" min="60" required />
            </div>
            <div class="form-group">
              <label for="golden_score_duration">Длительность золотого скора (сек)</label>
              <input v-model.number="form.golden_score_duration" type="number" id="golden_score_duration" min="60" />
            </div>
            <div class="form-group">
              <label for="organizer">Организатор</label>
              <input v-model="form.organizer" type="text" id="organizer" placeholder="Введите организатора" />
            </div>
            <div class="form-group">
              <label for="min_athletes_per_category">Мин. участников в категории</label>
              <input v-model.number="form.min_athletes_per_category" type="number" id="min_athletes_per_category" min="2" />
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" class="modal-button cancel" @click="closeCreateModal">Отмена</button>
            <button type="submit" class="modal-button submit">Создать</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const stats = ref({})
const activeTournaments = ref([])
const recentEvents = ref([])

// Модалка создания турнира
const isCreateModalOpen = ref(false)
const form = ref({
  name: '',
  description: '',
  start_date: '',
  end_date: '',
  venue: '',
  city: '',
  country: 'Казахстан',
  tatami_count: 1,
  fight_duration: 300,
  golden_score_duration: 180,
  organizer: '',
  min_athletes_per_category: 2,
  status: 'PLANNED'
})
const errors = ref({})

const openCreateModal = () => {
  isCreateModalOpen.value = true
  // Сброс формы
  form.value = {
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    venue: '',
    city: '',
    country: 'Казахстан',
    tatami_count: 1,
    fight_duration: 300,
    golden_score_duration: 180,
    organizer: '',
    min_athletes_per_category: 2,
    status: 'PLANNED'
  }
  errors.value = {}
}

const closeCreateModal = () => {
  isCreateModalOpen.value = false
}

const validateForm = () => {
  errors.value = {}
  let isValid = true
  if (!form.value.name) { errors.value.name = 'Название обязательно'; isValid = false }
  if (!form.value.start_date) { errors.value.start_date = 'Дата начала обязательна'; isValid = false }
  if (!form.value.end_date) { errors.value.end_date = 'Дата окончания обязательна'; isValid = false }
  if (form.value.start_date > form.value.end_date) { errors.value.end_date = 'Дата окончания не может быть раньше начала'; isValid = false }
  if (!form.value.venue) { errors.value.venue = 'Место проведения обязательно'; isValid = false }
  if (form.value.tatami_count < 1) { errors.value.tatami_count = 'Минимум 1 татами'; isValid = false }
  if (form.value.fight_duration < 60) { errors.value.fight_duration = 'Минимум 60 секунд'; isValid = false }
  return isValid
}

const createTournament = async () => {
  if (!validateForm()) return

  const payload = {
    name: form.value.name,
    description: form.value.description || undefined,
    start_date: form.value.start_date,
    end_date: form.value.end_date,
    venue: form.value.venue,
    city: form.value.city,
    country: form.value.country,
    tatami_count: form.value.tatami_count,
    fight_duration: form.value.fight_duration,
    golden_score_duration: form.value.golden_score_duration || undefined,
    organizer: form.value.organizer || undefined,
    min_athletes_per_category: form.value.min_athletes_per_category || undefined,
    status: form.value.status
  }

  try {
    const response = await fetch('/api/tournament', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'mobile_app_2024'
      },
      body: JSON.stringify(payload)
    })
    if (!response.ok) throw new Error((await response.json()).error || 'Ошибка сервера')
    alert('Турнир успешно создан!')
    closeCreateModal()
    // Перезагружаем данные
    loadDashboardData()
  } catch (error) {
    alert('Ошибка: ' + error.message)
  }
}

// Остальной код без изменений...
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
    const tournamentsResponse = await fetch('/api/tournaments?status=LIVE', {
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
  router.push('/tournaments')
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
/* Добавляем стили для модалки */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-content h2 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #1a1a1a;
  text-align: center;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 0.75rem;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #c89b3c;
}

.error {
  color: #ff4444;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.modal-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-button.cancel {
  background: #f5f5f5;
  color: #666;
}

.modal-button.cancel:hover {
  background: #e8e8e8;
}

.modal-button.submit {
  background: linear-gradient(135deg, #c89b3c, #e0b456);
  color: white;
}

.modal-button.submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(200, 155, 60, 0.3);
}

/* Остальные стили без изменений... */
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

.recent-events-section h2 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #1a1a1a;
}

.events-list {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.event-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.event-item:last-child {
  border-bottom: none;
}

.event-time {
  font-weight: 600;
  color: #c89b3c;
  min-width: 60px;
}

.event-text {
  color: #333;
  flex: 1;
}

.no-events {
  text-align: center;
  padding: 2rem;
  color: #666;
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

  .modal-content {
    padding: 1.5rem;
    margin: 1rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>