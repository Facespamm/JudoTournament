<template>
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
</template>

<script setup>
import { ref, defineEmits } from 'vue'

const emit = defineEmits(['bracket-created'])

const bracketGenerated = ref(false)
const participantsCount = ref(8)
const participantsInput = ref('')
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

  emit('bracket-created', rounds)
  bracketGenerated.value = true
  showModal.value = false
}

// Метод для сброса сетки (если нужен извне)
const resetBracket = () => {
  bracketGenerated.value = false
  participantsInput.value = ''
  showModal.value = true
}

// Экспортируем методы для использования в родительском компоненте
defineExpose({
  resetBracket
})
</script>

<style scoped>
.bracket-setup {
  margin: 2rem 0;
  text-align: center;
}

.create-bracket-btn {
  background: #c89b3c;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.create-bracket-btn:hover {
  background: #e0b456;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(200, 155, 60, 0.3);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.modal-close:hover {
  color: #333;
}

.setup-group {
  margin-bottom: 1.5rem;
}

.setup-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.setup-group select,
.setup-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.setup-group select:focus,
.setup-group textarea:focus {
  outline: none;
  border-color: #c89b3c;
}

.setup-group textarea {
  resize: vertical;
  font-family: inherit;
}

.action-button {
  width: 100%;
  background: #c89b3c;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.action-button:hover {
  background: #e0b456;
}
</style>