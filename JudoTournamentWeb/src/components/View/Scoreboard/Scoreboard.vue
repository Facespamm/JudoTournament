<template>
  <div class="scoreboard-page">
    <!-- ЗАГОЛОВОК -->
    <div class="scoreboard-header">
      <h1>🏆 Турнирное табло</h1>
      <p class="subtitle">Прямые трансляции схваток в реальном времени</p>
      <div class="tournament-stats">
        <div class="stat-item">
          <span class="stat-number">{{ liveFights.length }}</span>
          <span class="stat-label">LIVE схваток</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ completedFightsCount }}</span>
          <span class="stat-label">Завершено</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ totalFightsCount }}</span>
          <span class="stat-label">Всего схваток</span>
        </div>
      </div>
    </div>

    <!-- ФИЛЬТРЫ -->
    <div class="scoreboard-filters">
      <select v-model="selectedTournament" @change="loadLiveFights" class="filter-select">
        <option value="">Все турниры</option>
        <option v-for="tournament in tournaments" :key="tournament.id" :value="tournament.id">
          {{ tournament.name }}
        </option>
      </select>
      <select v-model="selectedTatami" @change="loadLiveFights" class="filter-select">
        <option value="">Все татами</option>
        <option v-for="tatami in tatamiList" :key="tatami" :value="tatami">
          Татами {{ tatami }}
        </option>
      </select>
      <button @click="loadLiveFights" class="refresh-btn">
        🔄 Обновить
      </button>
    </div>

    <!-- LIVE СХВАТКИ -->
    <div class="live-fights-section">
      <h2>🔴 Прямой эфир</h2>
      <div v-if="liveFights.length === 0" class="no-fights">
        <div class="no-fights-icon">⏸️</div>
        <p>Нет активных схваток</p>
        <p class="subtext">Следующие схватки появятся здесь автоматически</p>
      </div>
      <div v-else class="fights-list">
        <div
            v-for="fight in liveFights"
            :key="fight.id"
            class="fight-card"
            :class="{ 'golden-score': fight.is_golden_score }"
        >
          <!-- Шапка: татами + номер + категория -->
          <div class="fight-header">
            <div class="fight-meta">
              <span class="tatami-badge">Татами {{ fight.tatami }}</span>
              <span class="fight-number">Схватка #{{ fight.fight_number }}</span>
              <span class="category-badge">{{ fight.category?.name || 'Категория' }}</span>
            </div>
          </div>

          <!-- Контейнер для таймера и спортсменов -->
          <div class="fight-athletes-container">
            <!-- ЦЕНТРАЛЬНЫЙ ТАЙМЕР — ВЫШЕ ВСЕХ -->
            <div class="center-timer-section">
              <div class="fight-timer" :class="{ 'golden-score-timer': fight.is_golden_score }">
                <div class="timer-display">{{ formatTime(fight.timer_seconds) }}</div>
                <div v-if="fight.is_golden_score" class="golden-score-label">GOLDEN SCORE</div>
              </div>
            </div>

            <!-- Белый и Синий -->
            <div class="fight-athletes">
              <!-- БЕЛЫЙ -->
              <div class="athlete white">
                <div class="belt white-belt"></div>
                <div class="athlete-info">
                  <div class="name">{{ fight.white_athlete?.full_name || 'TBD' }}</div>
                  <div class="club">{{ fight.white_athlete?.club?.name || '' }}</div>
                </div>
                <div class="score-block">
                  <div class="points">{{ fight.result?.white_score || 0 }}</div>
                  <div class="penalties">
                    <span v-for="(penalty, index) in getPenalties(fight.result, 'WHITE')" :key="index" class="shido">SHIDO</span>
                  </div>
                </div>
              </div>
              <div class="vs">VS</div>
              <!-- СИНИЙ -->
              <div class="athlete blue">
                <div class="score-block">
                  <div class="points">{{ fight.result?.blue_score || 0 }}</div>
                  <div class="penalties">
                    <span v-for="(penalty, index) in getPenalties(fight.result, 'BLUE')" :key="index" class="shido">SHIDO</span>
                  </div>
                </div>
                <div class="athlete-info">
                  <div class="name">{{ fight.blue_athlete?.full_name || 'TBD' }}</div>
                  <div class="club">{{ fight.blue_athlete?.club?.name || '' }}</div>
                </div>
                <div class="belt blue-belt"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- БЛИЖАЙШИЕ СХВАТКИ -->
    <div class="upcoming-fights-section">
      <h2>⏭️ Следующие схватки</h2>
      <div v-if="upcomingFights.length === 0" class="no-upcoming">
        <p>Нет запланированных схваток</p>
      </div>
      <div v-else class="upcoming-list">
        <div v-for="fight in upcomingFights" :key="fight.id" class="upcoming-fight">
          <div class="upcoming-info">
            <span class="time">{{ formatScheduledTime(fight.scheduled_time) }}</span>
            <span class="tatami">Татами {{ fight.tatami }}</span>
            <span class="category">{{ fight.category?.name }}</span>
          </div>
          <div class="athletes-preview">
            <span>{{ fight.white_athlete?.full_name || 'TBD' }}</span>
            <span class="vs-small">vs</span>
            <span>{{ fight.blue_athlete?.full_name || 'TBD' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- АВТО-ОБНОВЛЕНИЕ -->
    <div class="auto-refresh-indicator">
      <div class="refresh-status">
        <span class="dot" :class="{ active: isAutoRefreshing }"></span>
        Авто-обновление: {{ isAutoRefreshing ? 'ВКЛ' : 'ВЫКЛ' }}
      </div>
      <button @click="toggleAutoRefresh" class="toggle-refresh-btn">
        {{ isAutoRefreshing ? '⏸️ Пауза' : '▶️ Возобновить' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const liveFights = ref([])
const upcomingFights = ref([])
const tournaments = ref([])
const selectedTournament = ref('')
const selectedTatami = ref('')
const isAutoRefreshing = ref(true)
const refreshInterval = ref(null)
const tatamiList = ref([1, 2, 3, 4])
const completedFightsCount = ref(14)
const totalFightsCount = ref(52)

const loadLiveFights = async () => {
  liveFights.value = [
    {
      id: 1,
      tatami: 1,
      fight_number: 24,
      round_number: 3,
      status: 'LIVE',
      timer_seconds: 187,
      is_golden_score: false,
      category: { name: 'Мужчины до 73кг' },
      white_athlete: {
        id: 101,
        full_name: 'Азамат Сарсенбеков',
        club: { name: 'Динамо Алматы' }
      },
      blue_athlete: {
        id: 102,
        full_name: 'Ерлан Серикжанов',
        club: { name: 'Южный ветер' }
      },
      result: {
        white_score: 1,
        blue_score: 0,
        white_penalties: 'SHIDO,SHIDO',
        blue_penalties: 'SHIDO',
        technique_used: 'Uchi-mata',
        victory_type: 'WAZAARI',
        winner_id: 101
      }
    }
  ]
  upcomingFights.value = [
    {
      id: 3,
      tatami: 2,
      scheduled_time: '2025-11-18T14:30:00Z',
      category: { name: 'Мужчины до 81кг' },
      white_athlete: { full_name: 'Нурлан Омаров' },
      blue_athlete: { full_name: 'Алишер Жуманов' }
    },
    {
      id: 4,
      tatami: 1,
      scheduled_time: '2025-11-18T14:45:00Z',
      category: { name: 'Женщины до 63кг' },
      white_athlete: { full_name: 'Гульнара Абдрахманова' },
      blue_athlete: { full_name: 'Камила Бекенова' }
    }
  ]
}

const formatTime = (seconds) => {
  if (!seconds && seconds !== 0) return '5:00'
  const min = Math.floor(seconds / 60)
  const sec = seconds % 60
  return `${min}:${sec < 10 ? '0' + sec : sec}`
}

const getPenalties = (result, color) => {
  if (!result) return []
  const penalties = color === 'WHITE' ? result.white_penalties : result.blue_penalties
  return penalties ? penalties.split(',') : []
}

const formatScheduledTime = (time) => time ? new Date(time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : ''

const toggleAutoRefresh = () => {
  isAutoRefreshing.value = !isAutoRefreshing.value
  isAutoRefreshing.value ? startAutoRefresh() : stopAutoRefresh()
}
const startAutoRefresh = () => {
  refreshInterval.value = setInterval(loadLiveFights, 5000)
}
const stopAutoRefresh = () => {
  if (refreshInterval.value) clearInterval(refreshInterval.value)
}

onMounted(() => {
  loadLiveFights()
  startAutoRefresh()
})
onUnmounted(stopAutoRefresh)
</script>

<style scoped>
.scoreboard-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #fefefe, #f8f9fa);
  color: #1a1a1a;
  padding: 90px 2rem 2rem;
  font-family: 'Inter', system-ui, sans-serif;
}

.scoreboard-header { text-align: center; margin-bottom: 3rem; }
.scoreboard-header h1 { font-size: 2.5rem; font-weight: 800; margin: 0 0 0.5rem; }
.subtitle { color: #666; font-size: 1.1rem; margin-bottom: 2rem; }
.tournament-stats { display: flex; justify-content: center; gap: 3rem; flex-wrap: wrap; }
.stat-number { display: block; font-size: 2.2rem; font-weight: 800; color: #c89b3c; }
.stat-label { font-size: 0.9rem; color: #666; text-transform: uppercase; letter-spacing: 1px; }

.scoreboard-filters { display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; align-items: center; justify-content: center; }
.filter-select { padding: 0.8rem 1rem; border: 2px solid #e8e8e8; border-radius: 12px; background: white; min-width: 180px; font-size: 0.95rem; cursor: pointer; transition: all 0.3s; }
.filter-select:hover { border-color: #c89b3c; }
.refresh-btn { padding: 0.8rem 1.4rem; background: #c89b3c; color: white; border: none; border-radius: 12px; cursor: pointer; font-weight: 600; transition: all 0.3s; }
.refresh-btn:hover { background: #e0b456; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(200,155,60,0.3); }

.live-fights-section h2 { text-align: center; font-size: 1.8rem; font-weight: 700; margin-bottom: 2rem; color: #1a1a1a; }
.fights-list { display: grid; grid-template-columns: 1fr; gap: 2rem; max-width: 900px; margin: 0 auto; }

.fight-card {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 6px 30px rgba(0,0,0,0.1);
  border: 2px solid #f0f0f0;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}
.fight-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 5px;
  background: linear-gradient(90deg, #c89b3c, #e0b456);
}
.fight-card:hover { transform: translateY(-8px); box-shadow: 0 16px 40px rgba(0,0,0,0.15); }

/* Только золотая анимация при Golden Score */
.fight-card.golden-score::before {
  background: linear-gradient(90deg, #ffd700, #ffed4e);
  height: 6px;
  animation: goldenBar 3s linear infinite;
}
@keyframes goldenBar { 0% { background-position: 0% 0; } 100% { background-position: 200% 0; } }

.fight-header { margin-bottom: 1rem; padding-bottom: 0.8rem; border-bottom: 2px solid #f5f5f5; }
.fight-meta { display: flex; gap: 0.8rem; align-items: center; flex-wrap: wrap; }
.tatami-badge { background: linear-gradient(135deg, #c89b3c, #e0b456); color: white; padding: 0.5rem 1.1rem; border-radius: 25px; font-weight: 800; font-size: 0.9rem; box-shadow: 0 3px 10px rgba(200,155,60,0.3); text-transform: uppercase; }
.fight-number { color: #888; font-size: 0.95rem; font-weight: 600; }
.category-badge { background: rgba(200,155,60,0.15); color: #c89b3c; padding: 0.5rem 1.1rem; border-radius: 15px; font-weight: 700; font-size: 0.9rem; border: 2px solid rgba(200,155,60,0.2); }

.fight-athletes-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem 0;
}.center-timer-section { display: flex; justify-content: center; margin-bottom: 1.5rem; }

.fight-timer {
  background: linear-gradient(135deg, #f8f9fa, #ffffff);
  border: 3px solid #e0e0e0;
  border-radius: 18px;
  padding: 1.2rem 2rem;
  text-align: center;
  min-width: 220px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.12);
}
.timer-display {
  font-size: 3.5rem;
  font-weight: 900;
  font-family: 'Courier New', monospace;
  color: #1a1a1a;
  letter-spacing: 4px;
  line-height: 1;
}
.golden-score-timer {
  border-color: #ffd700;
  background: linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,237,78,0.1));
  box-shadow: 0 0 35px rgba(255,215,0,0.5), 0 8px 25px rgba(0,0,0,0.12);
}
.golden-score-timer .timer-display {
  color: #c89b3c;
  animation: goldenPulse 1.8s infinite;
}
.golden-score-label {
  color: #c89b3c;
  font-weight: 900;
  font-size: 1rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-top: 0.5rem;
}
@keyframes goldenPulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }

.fight-athletes {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1.5rem;
  padding: 1.2rem;
  background: linear-gradient(to bottom, #fafafa, #ffffff);
  border-radius: 15px;
  border: 2px solid #f0f0f0;
}
.athlete { display: flex; align-items: center; gap: 1.2rem; }
.athlete.white { justify-content: flex-start; }
.athlete.blue { justify-content: flex-end; flex-direction: row-reverse; }
.belt { width: 30px; height: 8px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.15); }
.white-belt { background: white; border: 3px solid #d0d0d0; }
.blue-belt { background: linear-gradient(135deg, #2196f3, #42a5f5); }
.athlete-info { flex: 1; }
.athlete.white .athlete-info { text-align: left; }
.athlete.blue .athlete-info { text-align: right; }
.name { font-weight: 800; font-size: 1.15rem; color: #1a1a1a; margin-bottom: 4px; }
.club { font-size: 0.9rem; color: #777; font-weight: 500; }
.score-block { text-align: center; min-width: 85px; background: white; padding: 0.9rem; border-radius: 12px; box-shadow: 0 3px 12px rgba(0,0,0,0.08); }
.points { font-size: 2.5rem; font-weight: 900; color: #c89b3c; line-height: 1; }
.penalties { display: flex; gap: 0.4rem; justify-content: center; margin-top: 0.6rem; flex-wrap: wrap; }
.shido { background: linear-gradient(135deg, #ff4444, #ff6666); color: white; font-size: 0.7rem; font-weight: 800; padding: 0.3rem 0.6rem; border-radius: 6px; box-shadow: 0 2px 6px rgba(255,68,68,0.3); text-transform: uppercase; }
.vs { font-weight: 900; font-size: 1.6rem; color: #c89b3c; padding: 0.7rem 1.3rem; background: rgba(200,155,60,0.1); border-radius: 50%; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 12px rgba(200,155,60,0.2); }

.upcoming-fights-section { margin-top: 4rem; }
.upcoming-fights-section h2 { text-align: center; font-size: 1.8rem; font-weight: 700; margin-bottom: 2rem; }
.upcoming-list { display: flex; flex-direction: column; gap: 0.8rem; max-width: 800px; margin: 0 auto; }
.upcoming-fight { background: white; padding: 1rem; border-radius: 12px; border-left: 5px solid #c89b3c; box-shadow: 0 2px 10px rgba(0,0,0,0.06); transition: all 0.3s; }
.upcoming-fight:hover { transform: translateX(5px); }
.upcoming-info { display: flex; gap: 1rem; font-size: 0.9rem; color: #666; flex-wrap: wrap; margin-bottom: 0.5rem; }
.athletes-preview { font-weight: 600; color: #1a1a1a; }
.vs-small { color: #c89b3c; font-weight: 800; margin: 0 0.5rem; }

.auto-refresh-indicator {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: white;
  padding: 0.8rem 1.2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.9rem;
  z-index: 100;
}
.auto-refresh-indicator .dot.active { background: #4caf50; animation: pulse 2s infinite; }
.toggle-refresh-btn { padding: 0.4rem 0.8rem; background: #f0f0f0; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; }

.no-fights, .no-upcoming { text-align: center; padding: 4rem 2rem; background: white; border-radius: 16px; border: 2px dashed #e8e8e8; color: #666; max-width: 600px; margin: 0 auto; }
.no-fights-icon { font-size: 4rem; opacity: 0.5; margin-bottom: 1rem; }

@media (max-width: 768px) {
  .fight-athletes { grid-template-columns: 1fr; gap: 1.5rem; }
  .athlete.blue { flex-direction: row; justify-content: flex-start; }
  .athlete.blue .athlete-info { text-align: left; }
  .vs { order: 1; margin: 0 auto; }
  .timer-display { font-size: 3.2rem; }
}
</style>