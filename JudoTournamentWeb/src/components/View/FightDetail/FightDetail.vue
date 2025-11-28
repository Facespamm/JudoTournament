<template>
  <div class="fight-page">
    <!-- Хедер -->
    <div class="header">
      <button class="back" @click="$router.back()">← Назад</button>
      <div>
        <h1>Судейская панель: Схватка #{{ fight?.fight_number }}</h1>
        <div class="meta">
          Татами {{ fight?.tatami }} • Раунд {{ fight?.round_number }} •
          <span :class="statusClass">{{ statusText }}</span>
        </div>
      </div>
    </div>

    <!-- Основная карточка схватки -->
    <div class="fight-card">
      <!-- Левый атлет (White) -->
      <div class="athlete-section white">
        <h2 class="athlete-name">{{ getAthleteName(fight?.white_athlete) }} (Белый)</h2>
        <div class="scores">
          <p>Ippon: {{ whiteScores.ippon }}</p>
          <p>Waza-ari: {{ whiteScores.wazaari }}</p>
          <p>Shido: {{ whiteScores.shido }}</p>
        </div>
        <div class="actions">
          <button class="btn-score" @click="addScore('white', 'ippon')">+ Ippon</button>
          <button class="btn-score" @click="addScore('white', 'wazaari')">+ Waza-ari</button>
          <button class="btn-penalty" @click="addPenalty('white', 'shido')">+ Shido</button>
          <button class="btn-penalty hansoku" @click="addPenalty('white', 'hansoku')">Hansoku-make</button>
        </div>
        <!-- Выбор техники -->
        <select class="technique-select" @change="recordTechnique('white', $event.target.value)">
          <option value="">Выбрать технику</option>
          <option value="Uchi-mata">Uchi-mata</option>
          <option value="Seoi-nage">Seoi-nage</option>
          <option value="O-soto-gari">O-soto-gari</option>
          <option value="Ko-uchi-gari">Ko-uchi-gari</option>
          <option value="Tai-otoshi">Tai-otoshi</option>
        </select>
      </div>

      <!-- Центральный таймер -->
      <div class="timer-section">
        <h3 class="timer-display">{{ formatTime(timerSeconds) }}</h3>
        <p v-if="isGoldenScore" class="golden-score">Golden Score</p>
        <div class="timer-controls">
          <button
              v-if="!isRunning"
              class="btn-timer start"
              @click="startTimer"
              :disabled="fightStatus === 'COMPLETED'"
          >
            {{ fightStatus === 'SCHEDULED' ? 'Hajime (Старт)' : 'Продолжить' }}
          </button>
          <button
              v-else
              class="btn-timer pause"
              @click="pauseTimer"
          >
            Matte (Пауза)
          </button>
          <button class="btn-timer complete" @click="completeFight" :disabled="!canComplete">Завершить бой</button>
        </div>
        <p class="fight-status">Статус: {{ fightStatus }}</p>
      </div>

      <!-- Правый атлет (Blue) -->
      <div class="athlete-section blue">
        <h2 class="athlete-name">{{ getAthleteName(fight?.blue_athlete) }} (Синий)</h2>
        <div class="scores">
          <p>Ippon: {{ blueScores.ippon }}</p>
          <p>Waza-ari: {{ blueScores.wazaari }}</p>
          <p>Shido: {{ blueScores.shido }}</p>
        </div>
        <div class="actions">
          <button class="btn-score" @click="addScore('blue', 'ippon')">+ Ippon</button>
          <button class="btn-score" @click="addScore('blue', 'wazaari')">+ Waza-ari</button>
          <button class="btn-penalty" @click="addPenalty('blue', 'shido')">+ Shido</button>
          <button class="btn-penalty hansoku" @click="addPenalty('blue', 'hansoku')">Hansoku-make</button>
        </div>
        <!-- Выбор техники -->
        <select class="technique-select" @change="recordTechnique('blue', $event.target.value)">
          <option value="">Выбрать технику</option>
          <option value="Uchi-mata">Uchi-mata</option>
          <option value="Seoi-nage">Seoi-nage</option>
          <option value="O-soto-gari">O-soto-gari</option>
          <option value="Ko-uchi-gari">Ko-uchi-gari</option>
          <option value="Tai-otoshi">Tai-otoshi</option>
        </select>
      </div>
    </div>

    <!-- Фиксация результата -->
    <div class="result-section">
      <h3>Фиксация результата</h3>
      <select v-model="victoryType">
        <option value="">Тип победы</option>
        <option value="IPPON">Иппон</option>
        <option value="WAZAARI_AWASETE_IPPON">Ваза-ари авасетэ иппон</option>
        <option value="SHIDO">Победа по штрафам</option>
        <option value="HANSOKU_MAKE">Хансоку-маке</option>
        <option value="FUSEN">Неявка</option>
        <option value="KIKEN">Отказ</option>
      </select>
      <select v-model="winnerColor">
        <option value="">Победитель</option>
        <option value="white">Белый ({{ getAthleteName(fight?.white_athlete) }})</option>
        <option value="blue">Синий ({{ getAthleteName(fight?.blue_athlete) }})</option>
      </select>
      <button class="btn-complete" @click="saveResult" :disabled="!victoryType || !winnerColor">Фиксировать результат</button>
    </div>

    <!-- Дополнительная информация -->
    <div class="info-grid">
      <div class="info-block">
        <h4>Информация о схватке</h4>
        <div class="info-item">Категория: <strong>{{ fight?.category || 'Не указана' }}</strong></div>
        <div class="info-item">Весовая: <strong>{{ fight?.weight_class || 'Не указана' }}</strong></div>
        <div class="info-item">Статус: <strong :class="statusClass">{{ statusText }}</strong></div>
      </div>

      <div class="info-block">
        <h4>История схватки</h4>
        <div v-if="fight?.scheduled_time" class="history">Запланирована: <strong>{{ formatDateTime(fight.scheduled_time) }}</strong></div>
        <div v-if="fight?.started_at" class="history">Началась: <strong>{{ formatDateTime(fight.started_at) }}</strong></div>
        <div v-if="fight?.completed_at" class="history completed">Завершена: <strong>{{ formatDateTime(fight.completed_at) }}</strong></div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchGetDetail } from '@/components/View/Fight/fetchFights.js'
import { startFight, endFight, resultFight } from "@/components/View/FightDetail/fetchFightPannel.js";

export default {
  name: 'RefereePanel',
  data() {
    return {
      fight: null,
      loading: true,

      // Счет и штрафы
      whiteScores: { ippon: 0, wazaari: 0, shido: 0 },
      blueScores: { ippon: 0, wazaari: 0, shido: 0 },

      // Таймер
      timerSeconds: 300,
      isRunning: false,
      isGoldenScore: false,
      timerInterval: null,
      initialStartDone: false,

      // Завершение схватки
      victoryType: '',
      winnerColor: '',

      fightStatus: 'SCHEDULED',
      currentTechnique: ''
    }
  },
  computed: {
    fightId() { return this.$route.params.id },
    statusText() {
      if (!this.fight) return ''
      const map = {
        SCHEDULED: 'Запланировано',
        IN_PROGRESS: 'LIVE',
        COMPLETED: 'Завершено'
      }
      return map[this.fight.status] || ''
    },
    statusClass() {
      return this.fight ? this.fight.status.toLowerCase().replace('_', '-') : ''
    },
    winnerId() {
      if (!this.winnerColor || !this.fight) return null
      return this.winnerColor === 'white' ? this.fight.white_athlete?.id : this.fight.blue_athlete?.id
    },
    canComplete() {
      return this.fightStatus === 'IN_PROGRESS' || this.fightStatus === 'SCHEDULED'
    }
  },
  async created() {
    try {
      this.fight = await fetchGetDetail(this.fightId)
      console.log('Загруженные данные боя:', this.fight)

      if (this.fight) {
        this.fightStatus = this.fight.status
        this.timerSeconds = this.fight.timer_seconds || 300

        // Загружаем текущие счета если есть
        if (this.fight.white_score) {
          this.whiteScores = { ...this.whiteScores, ...this.fight.white_score }
        }
        if (this.fight.blue_score) {
          this.blueScores = { ...this.blueScores, ...this.fight.blue_score }
        }

        // Если бой активен, запускаем таймер
        if (this.fight.status === 'IN_PROGRESS') {
          this.startTimer(false)
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки данных боя:', error)
    } finally {
      this.loading = false
    }
  },
  beforeUnmount() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval)
    }
  },
  methods: {
    getAthleteName(athlete) {
      if (!athlete) return 'TBD'
      return athlete.name || `${athlete.first_name} ${athlete.last_name}` || 'Неизвестный'
    },

    formatTime(seconds) {
      const min = Math.floor(seconds / 60)
      const sec = seconds % 60
      return `${min}:${sec < 10 ? '0' : ''}${sec}`
    },

    formatDateTime(date) {
      if (!date) return '—'
      return new Date(date).toLocaleString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    },

    // Старт/продолжение боя
    async startTimer(sendRequest = true) {
      if (!this.isRunning && this.fightStatus !== 'COMPLETED') {
        try {
          if (sendRequest && !this.initialStartDone) {
            const data = {
              started_at: new Date().toISOString()
            }

            const result = await startFight(data, this.fightId)
            if (result.success) {
              this.initialStartDone = true
              console.log('Бой успешно начат:', result.data)
            } else {
              console.error('Ошибка старта боя:', result.error)
              return
            }
          }

          this.isRunning = true
          this.fightStatus = 'IN_PROGRESS'

          this.timerInterval = setInterval(() => {
            if (this.timerSeconds > 0) {
              this.timerSeconds--
            } else {
              this.enterGoldenScore()
            }
          }, 1000)

        } catch (error) {
          console.error('Ошибка при старте боя:', error)
        }
      }
    },

    // Пауза боя (только визуальная)
    pauseTimer() {
      if (this.isRunning) {
        this.isRunning = false
        clearInterval(this.timerInterval)
        console.log('Таймер приостановлен')
      }
    },

    // Завершение боя (endFight)
    async completeFight() {
      if (!this.canComplete) return

      try {
        // Останавливаем таймер
        this.isRunning = false
        clearInterval(this.timerInterval)

        const endData = {
          completed_at: new Date().toISOString(),
          status: 'COMPLETED'
        }

        const endResult = await endFight(endData, this.fightId)
        if (endResult.success) {
          this.fightStatus = 'COMPLETED'
          console.log('Бой завершен:', endResult.data)
          alert('Бой завершен! Теперь заполните результат.')
        } else {
          console.error('Ошибка завершения боя:', endResult.error)
        }

      } catch (error) {
        console.error('Ошибка при завершении боя:', error)
      }
    },

    // Сохранение результата (resultFight)
    async saveResult() {
      if (!this.victoryType || !this.winnerColor || !this.winnerId) {
        console.error('Не все данные для сохранения результата заполнены')
        return
      }

      try {
        const resultData = {
          fight_id: parseInt(this.fightId),
          winner_id: this.winnerId,
          victory_type: this.victoryType,
          fight_duration: 300 - this.timerSeconds,
          technique_used: this.currentTechnique || '',
          details: this.getFightDetails()
        }

        const resultResult = await resultFight(resultData)
        if (resultResult.success) {
          console.log('Результат боя успешно сохранен:', resultResult.data)
          alert('Результат успешно сохранен!')

          // Обновляем статус
          this.fightStatus = 'COMPLETED'
        } else {
          console.error('Ошибка сохранения результата:', resultResult.error)
        }

      } catch (error) {
        console.error('Ошибка при сохранении результата:', error)
      }
    },

    enterGoldenScore() {
      this.isGoldenScore = true
      this.timerSeconds = 180
      console.log('Включен Golden Score')
    },

    // Добавление счета/штрафов
    addScore(color, type) {
      const scores = color === 'white' ? this.whiteScores : this.blueScores
      if (type === 'ippon') scores.ippon++
      if (type === 'wazaari') {
        scores.wazaari++
        if (scores.wazaari >= 2) {
          scores.ippon = 1
          this.completeFightAutomatically('WAZAARI_AWASETE_IPPON', color)
        }
      }
      console.log(`Add score ${type} to ${color}:`, scores)
    },

    addPenalty(color, type) {
      const scores = color === 'white' ? this.whiteScores : this.blueScores
      if (type === 'shido') {
        scores.shido++
        if (scores.shido >= 3) {
          this.completeFightAutomatically('SHIDO', color === 'white' ? 'blue' : 'white')
        }
      }
      if (type === 'hansoku') {
        this.completeFightAutomatically('HANSOKU_MAKE', color === 'white' ? 'blue' : 'white')
      }
      console.log(`Add penalty ${type} to ${color}:`, scores)
    },

    // Запись техники
    recordTechnique(color, technique) {
      if (!technique) return
      this.currentTechnique = technique
      console.log(`${color} выполнил: ${technique}`)
    },

    completeFightAutomatically(type, winnerColorAuto) {
      this.victoryType = type
      this.winnerColor = winnerColorAuto
      this.completeFight()
    },

    // Генерация деталей боя на основе счетов
    getFightDetails() {
      const details = []

      if (this.whiteScores.ippon > 0) details.push(`Белый: ${this.whiteScores.ippon} иппон`)
      if (this.whiteScores.wazaari > 0) details.push(`Белый: ${this.whiteScores.wazaari} ваза-ари`)
      if (this.whiteScores.shido > 0) details.push(`Белый: ${this.whiteScores.shido} шидо`)

      if (this.blueScores.ippon > 0) details.push(`Синий: ${this.blueScores.ippon} иппон`)
      if (this.blueScores.wazaari > 0) details.push(`Синий: ${this.blueScores.wazaari} ваза-ари`)
      if (this.blueScores.shido > 0) details.push(`Синий: ${this.blueScores.shido} шидо`)

      if (this.currentTechnique) details.push(`Техника: ${this.currentTechnique}`)

      return details.join(', ')
    }
  }
}
</script>

<style scoped>
.complete {
  background: #b8860b !important;
}
.fight-page {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e8f0f8 50%, #f5f7fa 100%);
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  color: #1a1a1a;
  padding: 90px 2rem 4rem;
  box-sizing: border-box;
}

.header {
  max-width: 1200px;
  margin: 0 auto 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
.back {
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: #c89b3c;
  padding: 0.5rem;
}
.back:hover { color: #e0b456; }
.header h1 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: #1a1a1a;
}
.meta {
  color: #666;
  font-size: 0.9rem;
  margin-top: 0.4rem;
}

.fight-card {
  display: flex;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid #e8e8e8;
}

.athlete-section {
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.white {
  background: #f8f9fa;
  border-right: 1px solid #e8e8e8;
}
.blue  {
  background: #f0f8ff;
  border-left: 1px solid #e8e8e8;
}

.athlete-name {
  font-size: 1.3rem;
  font-weight: 600;
  text-align: center;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.scores p {
  margin: 0.4rem 0;
  font-weight: 500;
  font-size: 1rem;
  color: #2c3e50;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  justify-content: center;
  margin: 1rem 0;
}

.btn-score, .btn-penalty {
  padding: 0.7rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-size: 0.9rem;
  color: white;
}

.btn-score  { background: #43a047; }
.btn-penalty { background: #e53935; }

.hansoku {
  background: #c62828 !important;
}

.btn-score:hover, .btn-penalty:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.technique-select {
  padding: 0.7rem 0.8rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  background: white;
  width: 100%;
  max-width: 200px;
  text-align: center;
  font-weight: 500;
  font-size: 0.9rem;
}

.timer-section {
  flex: 0.8;
  background: #fdfdfd;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  border-left: 1px solid #e8e8e8;
  border-right: 1px solid #e8e8e8;
}

.timer-display {
  font-size: 3.5rem;
  font-weight: 700;
  color: #c89b3c;
  margin-bottom: 0.5rem;
  font-family: 'Courier New', monospace;
}

.golden-score {
  color: #ffd700;
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.timer-controls {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  width: 100%;
  max-width: 200px;
}

.btn-timer {
  padding: 0.9rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  border: none;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.start  { background: #43a047; }
.pause  { background: #3949ab; }
.reset  { background: #e53935; }

.btn-timer:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.btn-timer:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.fight-status {
  margin-top: 1rem;
  font-weight: 500;
  color: #424242;
  font-size: 1rem;
}

.result-section {
  margin-top: 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.result-section h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #2c3e50;
}

.result-section select {
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  background: white;
  width: 100%;
  font-weight: 500;
  font-size: 0.95rem;
}

.btn-complete {
  padding: 1rem 2.5rem;
  background: #b8860b;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-size: 0.95rem;
}

.btn-complete:hover:not(:disabled) {
  background: #d4af37;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(184, 134, 11, 0.3);
}

.btn-complete:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.info-grid {
  max-width: 1200px;
  margin: 2rem auto 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}
.info-block {
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,.08);
  border: 1px solid #e8e8e8;
}

.info-block h4 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.1rem;
  font-weight: 600;
}

.info-item {
  margin: 0.4rem 0;
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}

.history {
  margin: 0.4rem 0;
  padding: 0.4rem 0.8rem;
  border-left: 3px solid #007aff;
  background: #f8f9fa;
  font-size: 0.9rem;
}

.history.completed {
  border-left-color: #34c759;
}

.scheduled   { color: #007aff; }
.in-progress { color: #ff3b30; font-weight: 600; }
.completed   { color: #34c759; }

@media (max-width: 768px) {
  .fight-page {
    padding: 80px 1rem 2rem;
  }

  .fight-card {
    flex-direction: column;
  }

  .white {
    border-right: none;
    border-bottom: 1px solid #e8e8e8;
  }
  .blue  {
    border-left: none;
    border-top: 1px solid #e8e8e8;
  }

  .timer-section {
    border: none;
    border-top: 1px solid #e8e8e8;
    border-bottom: 1px solid #e8e8e8;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .header h1 {
    font-size: 1.5rem;
  }

  .timer-display {
    font-size: 2.8rem;
  }

  .actions {
    flex-direction: column;
  }

  .btn-score, .btn-penalty {
    width: 100%;
  }
}

.complete:hover:not(:disabled) {
  background: #d4af37 !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(184, 134, 11, 0.3);
}

.complete:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>