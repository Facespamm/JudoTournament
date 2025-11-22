<template>
  <div class="tournament-details">
    <!-- ЗАГОЛОВОК И КНОПКА НАЗАД -->
    <div class="tournament-detail-header">
      <button class="back-button" @click="$router.back()">
        ← Назад
      </button>
      <h1>Детали турнира</h1>
    </div>

    <!-- ЛОАДЕР -->
    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
      <p>Загрузка данных турнира...</p>
    </div>

    <!-- ОШИБКА -->
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button class="retry-button" @click="loadTournamentDetail">Попробовать снова</button>
    </div>

    <!-- ОСНОВНАЯ ИНФОРМАЦИЯ О ТУРНИРЕ -->
    <div v-else-if="tournament" class="tournament-main-info">
      <section class="tournament-info">
        <h1>{{ tournament.name }}</h1>
        <p class="tournament-description">{{ tournament.description || 'Описание отсутствует' }}</p>
        <div class="tournament-meta">
          <div class="meta-item">
            <span class="meta-label">Дата проведения:</span>
            <span class="meta-value">{{ formatDate(tournament.start_date, tournament.end_date) }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Место проведения:</span>
            <span class="meta-value">{{ getLocation(tournament) }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Статус:</span>
            <span class="meta-value status-badge" :class="getStatusClass(tournament.status)">
              {{ getStatusText(tournament.status) }}
            </span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Количество участников:</span>
            <span class="meta-value">{{ tournament.athletes_count || 0 }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Количество татами:</span>
            <span class="meta-value">{{ tournament.tatami_count || 0 }}</span>
          </div>
          <div v-if="tournament.progress_percentage > 0" class="meta-item">
            <span class="meta-label">Прогресс:</span>
            <span class="meta-value">{{ tournament.progress_percentage }}% завершено</span>
          </div>
        </div>
      </section>

      <!-- ТАБЛО СО СЧЕТОМ (МОК ДАННЫЕ) -->
      <div class="scoreboard-section">
        <div class="scoreboard">
          <span class="team-left">Команда A: 5</span>
          <span class="vs">vs</span>
          <span class="team-right">Команда B: 3</span>
        </div>
      </div>

      <!-- ПЛЕЕР ТРАНСЛЯЦИИ -->
      <section class="stream-section">
        <h2>Прямая трансляция</h2>
        <div class="stream-player">
          <div class="video-placeholder">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            <p>Трансляция начнется в назначенное время</p>
          </div>
        </div>
      </section>

      <!-- КНОПКА СОЗДАНИЯ СЕТКИ -->
      <section class="bracket-setup" v-if="!bracketGenerated">
        <button class="create-bracket-btn" @click="showModal = true">Создать турнирную сетку</button>
      </section>

      <!-- МОДАЛЬНОЕ ОКНО -->
      <div class="modal-overlay" v-if="showModal" @click="showModal = false">
        <div class="modal-content" @click.stop>
          <button class="modal-close" @click="showModal = false">×</button>
          <h2>Настройка турнирной сетки</h2>
          <div class="setup-group">
            <label>Количество участников:</label>
            <select v-model.number="participantsCount">
              <option :value="4">4 участника</option>
              <option :value="8">8 участников</option>
              <option :value="16">16 участников</option>
            </select>
          </div>
          <div class="setup-group">
            <label>Участники (введите имена через Enter):</label>
            <textarea
                v-model="participantsInput"
                placeholder="Введите имена участников (по одному на строку)"
                rows="8"
            ></textarea>
          </div>
          <button class="action-button" @click="generateBracket">Создать сетку</button>
        </div>
      </div>

      <!-- СЕТКА ТУРНИРА -->
      <section class="bracket-section" v-if="bracketGenerated">
        <div class="bracket-header">
          <h2>Турнирная сетка</h2>
          <button class="reset-button" @click="resetBracket">Пересоздать</button>
        </div>

        <div class="bracket-container">
          <div class="bracket">
            <div
                v-for="(round, roundIndex) in bracketData"
                :key="roundIndex"
                class="bracket-round"
            >
              <h3>{{ round.name }}</h3>
              <div class="matches">
                <div
                    v-for="(match, matchIndex) in round.matches"
                    :key="matchIndex"
                    class="match-card"
                    :class="{
                      'status-scheduled': match.status === 'SCHEDULED',
                      'status-live': match.status === 'LIVE',
                      'status-completed': match.status === 'COMPLETED'
                    }"
                >
                  <div class="team-slot" :class="{ winner: match.winner === 1 }">
                    <span class="team-name">{{ match.team1 || 'TBD' }}</span>
                    <input
                        v-model.number="match.score1"
                        type="number"
                        min="0"
                        class="score-input"
                        @input="updateMatch(roundIndex, matchIndex)"
                    />
                  </div>
                  <div class="vs-divider">VS</div>
                  <div class="team-slot" :class="{ winner: match.winner === 2 }">
                    <span class="team-name">{{ match.team2 || 'TBD' }}</span>
                    <input
                        v-model.number="match.score2"
                        type="number"
                        min="0"
                        class="score-input"
                        @input="updateMatch(roundIndex, matchIndex)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- СПИСОК УЧАСТНИКОВ -->
      <section class="participants-list">
        <h2>Список участников</h2>
        <div class="participants-grid">
          <div v-for="participant in participants" :key="participant.id" class="participant-card">
            <span class="participant-name">{{ participant.name }}</span>
            <span class="participant-club">{{ participant.club }}</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchTournamentDetail } from '@/components/View/TournamentDetails/fetchTournamentDetail.js'
import "@/components/View/TournamentDetails/TournamentDetails.css"

const route = useRoute()
const tournament = ref(null)
const isLoading = ref(true)
const error = ref('')

// ДЛЯ ОТЛАДКИ
console.log('TournamentDetails mounted, route params:', route.params)
console.log('Tournament ID from URL:', route.params.id)

// Вспомогательные функции
const formatDate = (startDate, endDate) => {
  if (!startDate) return 'Дата не указана'

  const start = new Date(startDate)
  const end = new Date(endDate)

  if (startDate === endDate) {
    return start.toLocaleDateString('ru-RU')
  }

  return `${start.toLocaleDateString('ru-RU')} – ${end.toLocaleDateString('ru-RU')}`
}

const getLocation = (tournament) => {
  const parts = []
  if (tournament.venue && tournament.venue !== 'string') parts.push(tournament.venue)
  if (tournament.city && tournament.city !== 'string') parts.push(tournament.city)
  if (tournament.country && tournament.country !== 'string') parts.push(tournament.country)

  return parts.join(', ') || 'Место не указано'
}

const getStatusClass = (status) => {
  const statusMap = {
    'LIVE': 'status-live',
    'PLANNED': 'status-planned',
    'COMPLETED': 'status-completed',
    'REGISTRATION': 'status-registration',
    'WEIGHING': 'status-weighing',
    'BRACKETS': 'status-brackets'
  }
  return statusMap[status] || 'status-planned'
}

const getStatusText = (status) => {
  const statusMap = {
    'LIVE': 'LIVE',
    'PLANNED': 'Запланирован',
    'COMPLETED': 'Завершен',
    'REGISTRATION': 'Регистрация',
    'WEIGHING': 'Взвешивание',
    'BRACKETS': 'Сетки'
  }
  return statusMap[status] || status
}

// Загрузка данных турнира - ИСПРАВЛЕННАЯ ВЕРСИЯ
const loadTournamentDetail = async () => {
  isLoading.value = true
  error.value = ''

  try {
    const tournamentId = Number(route.params.id)
    console.log('Loading tournament with ID:', tournamentId)

    if (isNaN(tournamentId)) {
      throw new Error('Неверный ID турнира')
    }

    const response = await fetchTournamentDetail(tournamentId)
    console.log('API Response:', response)

    // ИСПРАВЛЕНИЕ: Проверяем разные возможные структуры ответа
    if (response && response.success !== false) {
      // Если есть поле tournament (как в athletes)
      if (response.tournament) {
        tournament.value = response.tournament
      }
      // Если данные прямо в корне (как в примере из задания)
      else if (response.id) {
        tournament.value = response
      }
      // Если другой формат
      else {
        tournament.value = response
      }
    } else {
      throw new Error('Не удалось загрузить данные турнира')
    }
  } catch (err) {
    console.error('Error loading tournament:', err)
    error.value = err instanceof Error ? err.message : 'Произошла ошибка при загрузке данных'

    // Мок данные для демонстрации
    tournament.value = {
      name: 'Чемпионат Казахстана среди кадетов',
      description: 'Ежегодный турнир по дзюдо с участием лучших спортсменов.',
      start_date: '2025-03-17',
      end_date: '2025-03-19',
      city: 'Астана',
      country: 'Казахстан',
      venue: 'Дворец спорта',
      status: 'PLANNED',
      athletes_count: 125,
      tatami_count: 3,
      progress_percentage: 0
    }
  } finally {
    isLoading.value = false
  }
}

// Остальной код для сетки остается без изменений
const bracketGenerated = ref(false)
const participantsCount = ref(8)
const participantsInput = ref('')
const bracketData = ref([])
const showModal = ref(false)

const participants = ref([
  { id: 1, name: 'Азамат Сарсенбеков', club: 'Динамо Алматы' },
  { id: 2, name: 'Гульжан Искакова', club: 'Президентский клуб' },
  { id: 3, name: 'Ерлан Касымов', club: 'Жастар' },
  { id: 4, name: 'Айгуль Нургалиева', club: 'Барыс' }
])

const generateBracket = () => {
  const names = participantsInput.value
      .split('\n')
      .map(n => n.trim())
      .filter(n => n.length > 0)

  if (names.length < 2) {
    alert('Введите минимум 2 участника')
    return
  }

  while (names.length < participantsCount.value) {
    names.push(`Участник ${names.length + 1}`)
  }

  const teamsList = names.slice(0, participantsCount.value)

  const rounds = []
  let currentTeams = [...teamsList]

  while (currentTeams.length > 1) {
    const matches = []
    const roundName = currentTeams.length === 2 ? 'Финал' :
        currentTeams.length === 4 ? 'Полуфинал' :
            `1/${currentTeams.length / 2} финала`

    for (let i = 0; i < currentTeams.length; i += 2) {
      matches.push({
        team1: currentTeams[i],
        team2: currentTeams[i + 1] || 'TBD',
        score1: 0,
        score2: 0,
        winner: null,
        status: 'SCHEDULED'
      })
    }

    rounds.push({ name: roundName, matches })
    currentTeams = new Array(Math.ceil(currentTeams.length / 2)).fill('TBD')
  }

  bracketData.value = rounds
  bracketGenerated.value = true
  showModal.value = false
}

const updateMatch = (roundIdx, matchIdx) => {
  const match = bracketData.value[roundIdx].matches[matchIdx]

  if (match.score1 > 0 || match.score2 > 0) {
    match.status = 'LIVE'
  } else {
    match.status = 'SCHEDULED'
  }

  if (match.score1 > match.score2) {
    match.winner = 1
  } else if (match.score2 > match.score1) {
    match.winner = 2
  } else {
    match.winner = null
  }

  if (match.winner && roundIdx < bracketData.value.length - 1) {
    const winnerName = match.winner === 1 ? match.team1 : match.team2
    const nextRound = bracketData.value[roundIdx + 1]
    const nextMatchIdx = Math.floor(matchIdx / 2)
    const slot = matchIdx % 2 === 0 ? 'team1' : 'team2'
    nextRound.matches[nextMatchIdx][slot] = winnerName

    match.status = 'COMPLETED'
  }

  if (roundIdx < bracketData.value.length - 1) {
    const nextMatch = bracketData.value[roundIdx + 1].matches[Math.floor(matchIdx / 2)]
    if (nextMatch.team1 && nextMatch.team2 && nextMatch.team1 !== 'TBD' && nextMatch.team2 !== 'TBD') {
      nextMatch.status = 'SCHEDULED'
    }
  }
}

const resetBracket = () => {
  bracketGenerated.value = false
  bracketData.value = []
  participantsInput.value = ''
  showModal.value = true
}

onMounted(() => {
  loadTournamentDetail()
})
</script>

<style scoped>
.tournament-detail-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.back-button {
  background: #c89b3c;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: #e0b456;
  transform: translateY(-1px);
}

.tournament-main-info {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.tournament-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.meta-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.meta-label {
  font-weight: 500;
  color: #666;
}

.meta-value {
  font-weight: 600;
  color: #333;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-planned {
  background: #e3f2fd;
  color: #1976d2;
}

.status-live {
  background: #fbe9e7;
  color: #d32f2f;
}

.status-completed {
  background: #e8f5e8;
  color: #2e7d32;
}

.loading, .error {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #c89b3c;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error {
  background: #ffebee;
  border: 1px solid #ffcdd2;
  border-radius: 8px;
  color: #d32f2f;
  padding: 2rem;
}

.retry-button {
  background: #c89b3c;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 1rem;
  transition: all 0.3s ease;
}

.retry-button:hover {
  background: #e0b456;
}
</style>