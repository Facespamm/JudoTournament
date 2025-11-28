<template>
  <div class="brackets-edit">
    <h3>Создание боя на сетку</h3>

    <div class="edit-controls">
      <div class="form-group">
        <label for="bracket-select">Выберите сетку:</label>
        <select
            v-model="selectedBracketId"
            id="bracket-select"
            class="bracket-select"
        >
          <option :value="null">Выберите сетку</option>
          <option
              v-for="bracket in brackets"
              :key="bracket.id"
              :value="bracket.id"
          >
            {{ bracket.name }} (Турнир: {{ bracket.tournament_id }})
          </option>
        </select>
      </div>

      <button
          @click="createFightForBracket"
          :disabled="!selectedBracketId || creating"
          class="create-fight-btn"
      >
        {{ creating ? 'Создание...' : 'Создать бой' }}
      </button>
    </div>

    <div v-if="message" class="message" :class="messageType">
      {{ message }}
    </div>

    <div v-if="selectedBracket" class="bracket-info">
      <h4>Информация о выбранной сетке:</h4>
      <div class="info-grid">
        <div class="info-item">
          <span class="label">Название:</span>
          <span class="value">{{ selectedBracket.name }}</span>
        </div>
        <div class="info-item">
          <span class="label">Турнир ID:</span>
          <span class="value">{{ selectedBracket.tournament_id }}</span>
        </div>
        <div class="info-item">
          <span class="label">Тип сетки:</span>
          <span class="value">{{ selectedBracket.bracket_type }}</span>
        </div>
        <div class="info-item">
          <span class="label">Количество атлетов:</span>
          <span class="value">{{ selectedBracket.athletes_count }}</span>
        </div>
        <div class="info-item">
          <span class="label">Статус:</span>
          <span class="value status" :class="getStatusClass(selectedBracket.status)">
            {{ getStatusText(selectedBracket.status) }}
          </span>
        </div>
        <div class="info-item">
          <span class="label">Прогресс:</span>
          <span class="value">{{ selectedBracket.progress_percentage }}%</span>
        </div>
      </div>
    </div>

    <div v-else-if="selectedBracketId" class="no-bracket-info">
      Сетка с ID {{ selectedBracketId }} не найдена
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { createFight } from "@/components/View/Brackets/fetchBrackets.js"
import { fetchBrackets } from "@/components/View/Brackets/fetchBrackets.js"

const props = defineProps({
  tournaments: { type: Array, default: () => [] }
})

const brackets = ref([])
const selectedBracketId = ref(null)
const creating = ref(false)
const message = ref('')
const messageType = ref('')

onMounted(async () => {
  const result = await fetchBrackets()
  if (result.success) {
    brackets.value = result.brackets
  }
})

const selectedBracket = computed(() => {
  return brackets.value.find(b => b.id === selectedBracketId.value) || null
})

const getStatusClass = (s) => ({
  GENERATED: 'status-active',
  DRAFT: 'status-draft',
  COMPLETED: 'status-completed'
}[s] || 'status-draft')

const getStatusText = (s) => ({
  GENERATED: 'Сгенерирована',
  DRAFT: 'Черновик',
  COMPLETED: 'Завершена'
}[s] || 'Черновик')

const createFightForBracket = async () => {
  if (!selectedBracketId.value) return

  creating.value = true
  message.value = ''
  messageType.value = ''

  const bracketFightData = {
    timestamp: new Date().toISOString(),
  }

  try {
    const result = await createFight(bracketFightData, selectedBracketId.value)

    if (result.success) {
      message.value = 'Бой успешно создан!'
      messageType.value = 'success'
    } else {
      message.value = `Ошибка при создании боя: ${result.error}`
      messageType.value = 'error'
    }
  } catch (error) {
    message.value = `Ошибка: ${error.message}`
    messageType.value = 'error'
  } finally {
    creating.value = false
  }
}
</script>

<style scoped>
.brackets-edit {
  padding: 20px;
}

.edit-controls {
  display: flex;
  gap: 16px;
  align-items: flex-end;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: #333;
}

.bracket-select {
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  min-width: 300px;
  font-size: 14px;
}

.create-fight-btn {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;
}

.create-fight-btn:hover:not(:disabled) {
  background: #0056b3;
}

.create-fight-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.message {
  padding: 12px 16px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-weight: 500;
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.bracket-info {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
}

.bracket-info h4 {
  margin: 0 0 16px 0;
  color: #333;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  font-size: 0.85em;
  color: #666;
  font-weight: 500;
}

.value {
  font-size: 1em;
  color: #333;
}

.status {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  font-weight: 500;
  display: inline-block;
  width: fit-content;
}

.status-active { background: #d4edda; color: #155724; }
.status-draft { background: #fff3cd; color: #856404; }
.status-completed { background: #d1ecf1; color: #0c5460; }

.no-bracket-info {
  background: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 4px;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .edit-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .bracket-select {
    min-width: auto;
    width: 100%;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>