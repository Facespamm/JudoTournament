<template>
  <div class="tournament-details">
    <!-- ИНФОРМАЦИЯ О ТУРНИРЕ -->
    <section class="tournament-info">
      <h1>{{ tournament.name }}</h1>
      <p class="tournament-description">{{ tournament.description }}</p>
      <div class="tournament-meta">
        <span>Дата: {{ tournament.start_date }} - {{ tournament.end_date }}</span>
        <span>Место: {{ tournament.location }}</span>
        <span>Организатор: {{ tournament.organizer }}</span>
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
              >
                <div class="team-slot" :class="{ winner: match.winner === 1 }">
                  <span class="team-name">{{ match.team1 || 'TBD' }}</span>
                  <input
                      v-model.number="match.score1"
                      type="number"
                      min="0"
                      class="score-input"
                      @input="updateWinner(match)"
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
                      @input="updateWinner(match)"
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
</template>

<script setup>
import { ref } from 'vue'

const tournament = ref({
  name: 'Чемпионат Казахстана среди кадетов',
  description: 'Ежегодный турнир по дзюдо с участием лучших спортсменов.',
  start_date: '2025-03-17',
  end_date: '2025-03-17',
  location: 'Астана, Казахстан',
  organizer: 'Федерация дзюдо Казахстана'
})

const participants = ref([
  { id: 1, name: 'Азамат Сарсенбеков', club: 'Динамо Алматы' },
  { id: 2, name: 'Гульжан Искакова', club: 'Президентский клуб' }
])

// Управление сеткой
const bracketGenerated = ref(false)
const participantsCount = ref(8)
const participantsInput = ref('')
const bracketData = ref([])
const showModal = ref(false)

const generateBracket = () => {
  const names = participantsInput.value
      .split('\n')
      .map(n => n.trim())
      .filter(n => n.length > 0)

  if (names.length < 2) {
    alert('Введите минимум 2 участника')
    return
  }

  // Дополняем до нужного количества
  while (names.length < participantsCount.value) {
    names.push(`Участник ${names.length + 1}`)
  }

  // Обрезаем если больше
  const teamsList = names.slice(0, participantsCount.value)

  // Создаём раунды
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
        winner: null
      })
    }

    rounds.push({ name: roundName, matches })
    currentTeams = new Array(Math.ceil(currentTeams.length / 2)).fill('TBD')
  }

  bracketData.value = rounds
  bracketGenerated.value = true
  showModal.value = false
}

const updateWinner = (match) => {
  if (match.score1 > match.score2) {
    match.winner = 1
  } else if (match.score2 > match.score1) {
    match.winner = 2
  } else {
    match.winner = null
  }
}

const resetBracket = () => {
  bracketGenerated.value = false
  bracketData.value = []
  participantsInput.value = ''
  showModal.value = true
}
</script>

<style scoped>
.tournament-details {
  max-width: 1600px;
  margin: 0 auto;
  padding: 90px 2rem 4rem;
  background: #ffffff;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  color: #1a1a1a;
  box-sizing: border-box;
}

/* ИНФОРМАЦИЯ О ТУРНИРЕ */
.tournament-info {
  background: white;
  padding: 1.5rem;
  border: 2px solid #e0b456;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  text-align: center;
}

.tournament-info:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border-color: #c89b3c;
}

.tournament-info h1 {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 0.75rem;
  color: #1a1a1a;
}

.tournament-description {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
  margin-bottom: 1rem;
  max-width: 85%;
  margin-left: auto;
  margin-right: auto;
}

.tournament-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #888;
}

/* ТАБЛО */
.scoreboard-section {
  background: white;
  padding: 1.25rem;
  border: 2px solid #e0b456;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
}

.scoreboard-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border-color: #c89b3c;
}

.scoreboard {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  font-size: 1.4rem;
  font-weight: 700;
}

.team-left, .team-right {
  color: #c89b3c;
}

.vs {
  color: #1a1a1a;
  font-size: 1.1rem;
}

/* ПЛЕЕР ТРАНСЛЯЦИИ */
.stream-section {
  margin-bottom: 1.5rem;
}

.stream-section h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1rem;
  color: #1a1a1a;
  text-align: center;
}

.stream-player {
  background: white;
  border: 2px solid #e0b456;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: relative;
  aspect-ratio: 16 / 9;
}

.video-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
  color: #888;
  padding: 2rem;
}

.video-placeholder svg {
  margin-bottom: 1rem;
  color: #c89b3c;
}

.video-placeholder p {
  font-size: 1rem;
  margin: 0;
  text-align: center;
}

/* КНОПКА СОЗДАНИЯ СЕТКИ */
.bracket-setup {
  margin-bottom: 1.5rem;
  text-align: center;
}

.create-bracket-btn {
  background: #c89b3c;
  color: white;
  border: none;
  padding: 1rem 3rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(200, 155, 60, 0.3);
}

.create-bracket-btn:hover {
  background: #e0b456;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(200, 155, 60, 0.4);
}

/* МОДАЛЬНОЕ ОКНО */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  max-width: 550px;
  width: 100%;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 2rem;
  color: #888;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: #f0f0f0;
  color: #1a1a1a;
}

.modal-content h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1.5rem;
  color: #1a1a1a;
  text-align: center;
}

.setup-group {
  margin-bottom: 1rem;
}

.setup-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.4rem;
}

.setup-group select {
  width: 100%;
  padding: 0.6rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.9rem;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.setup-group select:focus {
  outline: none;
  border-color: #c89b3c;
}

.setup-group textarea {
  width: 100%;
  padding: 0.6rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: inherit;
  resize: vertical;
  transition: all 0.3s ease;
}

.setup-group textarea:focus {
  outline: none;
  border-color: #c89b3c;
}

/* СЕТКА */
.bracket-section {
  margin-bottom: 1.5rem;
}

.bracket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.bracket-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.reset-button {
  background: #888;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-button:hover {
  background: #666;
}

.bracket-container {
  background: white;
  padding: 1.5rem;
  border: 2px solid #e0b456;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow-x: auto;
}

.bracket {
  display: flex;
  gap: 2rem;
  min-width: fit-content;
  padding: 0.75rem;
}

.bracket-round {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.bracket-round h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #c89b3c;
  text-align: center;
  margin: 0 0 0.75rem 0;
  white-space: nowrap;
}

.matches {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  justify-content: space-around;
  flex: 1;
}

.match-card {
  background: #f8f9fa;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  padding: 0.75rem;
  min-width: 200px;
  transition: all 0.3s ease;
}

.match-card:hover {
  border-color: #c89b3c;
  box-shadow: 0 3px 10px rgba(200, 155, 60, 0.15);
}

.team-slot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem;
  background: white;
  border-radius: 6px;
  margin-bottom: 0.4rem;
  transition: all 0.3s ease;
}

.team-slot.winner {
  background: #c89b3c;
  color: white;
}

.team-slot.winner .score-input {
  background: white;
  color: #c89b3c;
  font-weight: 700;
}

.team-name {
  font-size: 0.85rem;
  font-weight: 500;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.score-input {
  width: 45px;
  padding: 0.35rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
}

.score-input:focus {
  outline: none;
  border-color: #c89b3c;
}

.vs-divider {
  text-align: center;
  font-size: 0.7rem;
  font-weight: 600;
  color: #888;
  margin: 0.2rem 0;
}

.action-button {
  background: #c89b3c;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.action-button:hover {
  background: #e0b456;
  transform: translateY(-2px);
  box-shadow: 0 3px 10px rgba(200, 155, 60, 0.25);
}

/* СПИСОК УЧАСТНИКОВ */
.participants-list {
  margin-bottom: 1.5rem;
}

.participants-list h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1rem;
  color: #1a1a1a;
  text-align: center;
}

.participants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.25rem;
  padding: 0 0.5rem;
}

.participant-card {
  background: white;
  padding: 1.25rem;
  border: 2px solid #e0b456;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  transition: all 0.3s ease;
}

.participant-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border-color: #c89b3c;
}

.participant-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
}

.participant-club {
  font-size: 0.85rem;
  color: #888;
}

/* АДАПТИВ */
@media (max-width: 992px) {
  .tournament-details {
    padding: 80px 1.5rem 3rem;
  }

  .participants-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .tournament-details {
    padding: 75px 1rem 2rem;
  }

  .bracket-header {
    flex-direction: column;
    gap: 1rem;
  }

  .participants-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .tournament-details {
    padding: 70px 0.75rem 1.5rem;
  }

  .match-card {
    min-width: 180px;
  }

  .team-name {
    font-size: 0.85rem;
  }
}
</style>