<template>
  <div class="referee-panel">
    <!-- Заголовок панели -->
    <h1 class="panel-title">Судейская панель: Схватка #{{ fightId }}</h1>

    <!-- Основная карточка схватки -->
    <div class="fight-card">
      <!-- Левый атлет (White) -->
      <div class="athlete-section white">
        <h2 class="athlete-name">{{ whiteAthlete.full_name }} (Белый)</h2>
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
          <!-- Добавь больше из реальных техник -->
        </select>
      </div>

      <!-- Центральный таймер -->
      <div class="timer-section">
        <h3 class="timer-display">{{ formatTime(timerSeconds) }}</h3>
        <p v-if="isGoldenScore" class="golden-score">Golden Score</p>
        <div class="timer-controls">
          <button class="btn-timer start" @click="startTimer" :disabled="isRunning">Hajime (Старт)</button>
          <button class="btn-timer pause" @click="pauseTimer" :disabled="!isRunning">Matte (Пауза)</button>
          <button class="btn-timer reset" @click="resetTimer">Сброс</button>
        </div>
        <p class="fight-status">Статус: {{ fightStatus }}</p>
      </div>

      <!-- Правый атлет (Blue) -->
      <div class="athlete-section blue">
        <h2 class="athlete-name">{{ blueAthlete.full_name }} (Синий)</h2>
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
        </select>
      </div>
    </div>

    <!-- Фиксация результата -->
    <div class="result-section">
      <h3>Завершить схватку</h3>
      <select v-model="victoryType">
        <option value="">Тип победы</option>
        <option value="IPPON">Иппон</option>
        <option value="WAZAARI_AWASETE_IPPON">Ваза-ари авасетэ иппон</option>
        <option value="SHIDO">Победа по штрафам</option>
        <option value="HANSOKU_MAKE">Хансоку-маке</option>
        <!-- Добавь остальные из VICTORY_TYPES -->
      </select>
      <select v-model="winnerColor">
        <option value="">Победитель</option>
        <option value="white">Белый ({{ whiteAthlete.full_name }})</option>
        <option value="blue">Синий ({{ blueAthlete.full_name }})</option>
      </select>
      <button class="btn-complete" @click="completeFight" :disabled="!victoryType || !winnerColor">Фиксировать результат</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import "./Referee.css"

// Мок-данные из бэка (замени на API fetch)
const fightId = ref(1) // Из params
const whiteAthlete = ref({ full_name: 'Иванов Иван' })
const blueAthlete = ref({ full_name: 'Петров Петр' })
const fightStatus = ref('SCHEDULED') // Из API

// Счет и штрафы
const whiteScores = ref({ ippon: 0, wazaari: 0, shido: 0 })
const blueScores = ref({ ippon: 0, wazaari: 0, shido: 0 })

// Таймер
const timerSeconds = ref(300) // DEFAULT_FIGHT_DURATION из config.py
const isRunning = ref(false)
const isGoldenScore = ref(false)
let timerInterval = null

const startTimer = () => {
  if (!isRunning.value) {
    isRunning.value = true
    fightStatus.value = 'LIVE'
    timerInterval = setInterval(() => {
      if (timerSeconds.value > 0) timerSeconds.value--
      else enterGoldenScore()
    }, 1000)
    // POST to /start_fight
  }
}

const pauseTimer = () => {
  if (isRunning.value) {
    isRunning.value = false
    clearInterval(timerInterval)
    // POST to /pause_fight
  }
}

const resetTimer = () => {
  clearInterval(timerInterval)
  isRunning.value = false
  timerSeconds.value = 300
  isGoldenScore.value = false
  fightStatus.value = 'SCHEDULED'
}

const enterGoldenScore = () => {
  isGoldenScore.value = true
  timerSeconds.value = 180 // GOLDEN_SCORE_DURATION
  // POST to /enter_golden_score
}

const formatTime = (seconds) => {
  const min = Math.floor(seconds / 60)
  const sec = seconds % 60
  return `${min}:${sec < 10 ? '0' : ''}${sec}`
}

// Добавление счета/штрафов
const addScore = (color, type) => {
  const scores = color === 'white' ? whiteScores : blueScores
  if (type === 'ippon') scores.value.ippon++
  if (type === 'wazaari') {
    scores.value.wazaari++
    if (scores.value.wazaari >= 2) {
      scores.value.ippon = 1 // Авто-иппон
      completeFightAutomatically('WAZAARI_AWASETE_IPPON', color)
    }
  }
  // POST to /add_score
}

const addPenalty = (color, type) => {
  const scores = color === 'white' ? whiteScores : blueScores
  if (type === 'shido') {
    scores.value.shido++
    if (scores.value.shido >= 3) completeFightAutomatically('SHIDO', color === 'white' ? 'blue' : 'white')
  }
  if (type === 'hansoku') completeFightAutomatically('HANSOKU_MAKE', color === 'white' ? 'blue' : 'white')
  // POST to /add_penalty (добавь в бэк если нужно)
}

// Запись техники
const recordTechnique = (color, technique) => {
  console.log(`${color} выполнил: ${technique}`)
  // POST to /record_technique (добавь в details)
}

// Завершение схватки
const victoryType = ref('')
const winnerColor = ref('')

const completeFight = () => {
  const winnerId = winnerColor.value === 'white' ? whiteAthlete.value.id : blueAthlete.value.id
  console.log(`Победитель: ${winnerColor.value}, Тип: ${victoryType.value}`)
  resetTimer()
  fightStatus.value = 'COMPLETED'
  // POST to /complete_fight
}

const completeFightAutomatically = (type, winnerColorAuto) => {
  victoryType.value = type
  winnerColor.value = winnerColorAuto
  completeFight()
}

onUnmounted(() => clearInterval(timerInterval))
</script>

<style scoped>
</style>