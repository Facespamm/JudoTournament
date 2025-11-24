<template>
  <div class="tournament-registration">
    <h3>Регистрация на турнир</h3>

    <!-- Индикатор загрузки -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>Регистрация...</p>
    </div>

    <div class="registration-form">
      <div class="form-grid">
        <div class="form-group">
          <label for="selected_tournament">Выберите турнир *</label>
          <select
              v-model="formData.tournament_id"
              id="selected_tournament"
              :disabled="isLoading"
              required
          >
            <option value="">Выберите турнир</option>
            <option v-for="tournament in tournaments" :key="tournament.id" :value="tournament.id">
              {{ tournament.name }}
            </option>
          </select>
          <span v-if="errors.tournament_id" class="error">{{ errors.tournament_id }}</span>
        </div>

        <div class="form-group">
          <label for="athlete_id">Выберите спортсмена *</label>
          <select
              v-model="formData.athlete_id"
              id="athlete_id"
              :disabled="isLoading"
              required
          >
            <option value="">Выберите спортсмена</option>
            <option v-for="athlete in athletes" :key="athlete.id" :value="athlete.id">
              {{ athlete.full_name }}
            </option>
          </select>
          <span v-if="errors.athlete_id" class="error">{{ errors.athlete_id }}</span>
        </div>

        <div class="form-group">
          <label for="category_id">Выберите категорию *</label>
          <select
              v-model="formData.category_id"
              id="category_id"
              :disabled="isLoading || !formData.tournament_id || categories.length === 0"
              required
          >
            <option value="">{{ formData.tournament_id ? 'Выберите категорию' : 'Сначала выберите турнир' }}</option>
            <option v-for="category in filteredCategories" :key="category.id" :value="category.id">
              {{ category.name }} ({{ category.gender === 'MALE' ? 'М' : 'Ж' }})
            </option>
          </select>
          <span v-if="errors.category_id" class="error">{{ errors.category_id }}</span>
        </div>

        <div class="form-group full-width">
          <label for="notes">Примечания</label>
          <textarea
              v-model="formData.notes"
              id="notes"
              placeholder="Введите примечания (необязательно)"
              :disabled="isLoading"
              rows="3"
          ></textarea>
        </div>
      </div>

      <div class="form-actions">
        <button
            @click="submit"
            class="submit-button"
            :disabled="isLoading"
        >
          {{ isLoading ? 'Регистрация...' : 'Зарегистрировать' }}
        </button>
      </div>
    </div>

    <!-- Список зарегистрированных участников -->
    <div v-if="registrations.length > 0" class="registrations-list">
      <h4>Зарегистрированные участники:</h4>
      <div class="registrations-grid">
        <div v-for="(registration, index) in registrations" :key="index" class="registration-card">
          <div class="athlete-info">
            <div class="athlete-name">{{ getAthleteName(registration.athlete_id) }}</div>
            <div class="tournament-name">{{ getTournamentName(registration.tournament_id) }}</div>
          </div>
          <div class="registration-details">
            <span class="category">Категория: {{ getCategoryName(registration.category_id) }}</span>
            <span v-if="registration.notes" class="notes">Примечания: {{ registration.notes }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { fetchTournaments } from '@/components/View/Tournaments/fetchTournaments.js'
import { fetchAthletes } from '@/components/View/Athletes/fetchAthletes.js'
import { fetchCategories } from '@/components/View/AdminDashboard/fetchAdmin.js'

const isLoading = ref(false)
const tournaments = ref([])
const athletes = ref([])
const categories = ref([])
const registrations = ref([])

const formData = ref({
  tournament_id: null,
  athlete_id: null,
  category_id: null,
  notes: ''
})

const errors = ref({})

// Фильтруем категории по выбранному турниру
const filteredCategories = computed(() => {
  console.log('Все категории:', categories.value.length)
  return categories.value
})

onMounted(async () => {
  await loadTournaments()
  await loadAthletes()
})

// Следим за изменением выбранного турнира и загружаем категории
watch(() => formData.value.tournament_id, async (newTournamentId) => {
  if (newTournamentId) {
    await loadCategories(newTournamentId)
  } else {
    categories.value = []
  }
})

// Загрузка турниров
const loadTournaments = async () => {
  try {
    const result = await fetchTournaments()
    console.log('Результат fetchTournaments:', result)
    if (result.success) {
      // Проверяем разные форматы ответа
      if (Array.isArray(result.data)) {
        tournaments.value = result.data
      } else if (result.data.tournaments) {
        tournaments.value = result.data.tournaments
      } else {
        tournaments.value = []
      }
      console.log('Загружено турниров:', tournaments.value.length, tournaments.value)
    }
  } catch (error) {
    console.error('Ошибка загрузки турниров:', error)
  }
}

// Загрузка спортсменов
const loadAthletes = async () => {
  try {
    const result = await fetchAthletes()
    console.log('Результат fetchAthletes:', result)

    // API возвращает { athletes: [...], success: true, total: N }
    if (result.success && result.athletes) {
      athletes.value = result.athletes
      console.log('Загружено спортсменов:', athletes.value.length)
    } else if (result.success && result.data && result.data.athletes) {
      athletes.value = result.data.athletes
      console.log('Загружено спортсменов (из data):', athletes.value.length)
    } else {
      console.log('Не удалось загрузить спортсменов')
      athletes.value = []
    }
  } catch (error) {
    console.error('Ошибка загрузки спортсменов:', error)
    athletes.value = []
  }
}

// Загрузка категорий по tournament_id
const loadCategories = async (tournamentId) => {
  try {
    const result = await fetchCategories(tournamentId)
    console.log('Результат fetchCategories:', result)

    // API возвращает { categories: [...], success: true } или { success: true, data: { categories: [...] } }
    if (result.success && result.categories) {
      categories.value = result.categories
      console.log('Загружено категорий:', categories.value.length)
    } else if (result.success && result.data && result.data.categories) {
      categories.value = result.data.categories
      console.log('Загружено категорий (из data):', categories.value.length)
    } else if (result.success && Array.isArray(result.data)) {
      categories.value = result.data
      console.log('Загружено категорий (массив):', categories.value.length)
    } else {
      console.log('Не удалось загрузить категории')
      categories.value = []
    }
  } catch (error) {
    console.error('Ошибка загрузки категорий:', error)
    categories.value = []
  }
}

// Вспомогательные функции для отображения
const getAthleteName = (athleteId) => {
  const athlete = athletes.value.find(a => a.id === athleteId)
  return athlete ? athlete.full_name : 'Неизвестный спортсмен'
}

const getTournamentName = (tournamentId) => {
  const tournament = tournaments.value.find(t => t.id === tournamentId)
  return tournament ? tournament.name : 'Неизвестный турнир'
}

const getCategoryName = (categoryId) => {
  const category = categories.value.find(c => c.id === categoryId)
  return category ? category.name : 'Неизвестная категория'
}

// Валидация формы
const validateForm = () => {
  errors.value = {}
  let isValid = true

  if (!formData.value.tournament_id) {
    errors.value.tournament_id = 'Выберите турнир'
    isValid = false
  }
  if (!formData.value.athlete_id) {
    errors.value.athlete_id = 'Выберите спортсмена'
    isValid = false
  }
  if (!formData.value.category_id) {
    errors.value.category_id = 'Выберите категорию'
    isValid = false
  }

  return isValid
}

// Регистрация участника
const registerParticipant = async (registrationData) => {
  try {
    const response = await fetch('http://127.0.0.1:5001/registrations/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'mobile_app_2024'
      },
      body: JSON.stringify(registrationData)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Ошибка при регистрации')
    }

    const result = await response.json()
    return { success: true, data: result }
  } catch (error) {
    console.error('Ошибка при регистрации:', error)
    return { success: false, error: error.message }
  }
}

// Отправка формы
const submit = async () => {
  if (!validateForm()) return

  isLoading.value = true

  try {
    const payload = {
      tournament_id: formData.value.tournament_id,
      athlete_id: formData.value.athlete_id,
      category_id: formData.value.category_id,
      notes: formData.value.notes || ''
    }

    const result = await registerParticipant(payload)

    if (result.success) {
      // Добавляем в локальный список
      registrations.value.push({
        ...payload,
        id: result.data.id || Date.now(),
        registration_date: new Date().toISOString()
      })

      // Сбрасываем форму
      formData.value = {
        tournament_id: null,
        athlete_id: null,
        category_id: null,
        notes: ''
      }

      console.log('Регистрация успешно создана!')
    } else {
      throw new Error(result.error)
    }

  } catch (error) {
    console.error('Ошибка при регистрации:', error)
    alert('Ошибка при регистрации: ' + error.message)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.tournament-registration {
  position: relative;
}

.tournament-registration h3 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #1a1a1a;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  z-index: 10;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #c89b3c;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
  font-size: 0.9rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  font-family: inherit;
  width: 100%;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #c89b3c;
}

.form-group input:disabled,
.form-group select:disabled,
.form-group textarea:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.7;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.error {
  color: #ff4444;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: block;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.submit-button {
  background: linear-gradient(135deg, #c89b3c, #e0b456);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(200, 155, 60, 0.3);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.registrations-list {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f0f0f0;
}

.registrations-list h4 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1a1a1a;
}

.registrations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.registration-card {
  background: #f8f9fa;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 1rem;
}

.athlete-info {
  margin-bottom: 0.75rem;
}

.athlete-name {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 1rem;
}

.tournament-name {
  font-size: 0.85rem;
  color: #c89b3c;
  font-weight: 500;
  margin-top: 0.25rem;
}

.registration-details {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 0.85rem;
  color: #666;
}

.category {
  font-weight: 500;
  color: #1a1a1a;
}

.notes {
  color: #666;
  font-style: italic;
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }

  .form-actions {
    justify-content: stretch;
  }

  .submit-button {
    min-width: auto;
    width: 100%;
  }

  .registrations-grid {
    grid-template-columns: 1fr;
  }
}
</style>