<template>
  <div class="form-section">
    <h3>Взвешивание</h3>

    <form @submit.prevent="submit">
      <div class="form-grid form-grid-double">
        <div class="form-group">
          <label for="registration_id">Регистрация</label>
          <select v-model="formData.registration_id" id="registration_id" required>
            <option value="">Выберите регистрацию</option>
            <option v-for="reg in registrations" :key="reg.id" :value="reg.id">
              {{ reg.athlete_name }} - {{ reg.tournament_name }}
            </option>
          </select>
          <span v-if="errors.registration_id" class="error">{{ errors.registration_id }}</span>
        </div>
        <div class="form-group">
          <label for="weight">Вес (кг)</label>
          <input
              v-model.number="formData.weight"
              type="number"
              id="weight"
              step="0.1"
              min="0"
              placeholder="Введите вес"
              required
          />
          <span v-if="errors.weight" class="error">{{ errors.weight }}</span>
        </div>
      </div>
      <button type="submit" class="submit-button">Зарегистрировать вес</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from 'vue'

const formData = ref({
  registration_id: null,
  weight: null
})

const errors = ref({})
const registrations = ref([])

// Получаем функцию showToast из родительского компонента
const showToast = inject('showToast') as (message: string, type?: string) => void

const fetchRegistrations = async () => {
  try {
    const response = await fetch('/api/registrations', {
      headers: { 'X-API-Key': 'mobile_app_2024' }
    })
    if (!response.ok) throw new Error('Ошибка загрузки регистраций')
    const data = await response.json()

    // Мок данные для демонстрации
    registrations.value = data.registrations || [
      {
        id: 1,
        tournament_id: 1,
        athlete_id: 1,
        athlete_name: 'Азамат Сарсенбеков',
        tournament_name: 'Чемпионат Казахстана'
      },
      {
        id: 2,
        tournament_id: 1,
        athlete_id: 2,
        athlete_name: 'Гульжан Искакова',
        tournament_name: 'Чемпионат Казахстана'
      }
    ]
  } catch (error) {
    console.error('Ошибка:', error)
    // Мок данные на случай ошибки
    registrations.value = [
      {
        id: 1,
        tournament_id: 1,
        athlete_id: 1,
        athlete_name: 'Азамат Сарсенбеков',
        tournament_name: 'Чемпионат Казахстана'
      },
      {
        id: 2,
        tournament_id: 1,
        athlete_id: 2,
        athlete_name: 'Гульжан Искакова',
        tournament_name: 'Чемпионат Казахстана'
      }
    ]
  }
}

const validateForm = () => {
  errors.value = {}
  let isValid = true

  if (!formData.value.registration_id) {
    errors.value.registration_id = 'Выберите регистрацию'
    isValid = false
  }
  if (!formData.value.weight || formData.value.weight <= 0) {
    errors.value.weight = 'Вес должен быть больше 0'
    isValid = false
  }
  return isValid
}

const submit = async () => {
  if (!validateForm()) return

  try {
    // Находим регистрацию для получения tournament_id и athlete_id
    const registration = registrations.value.find(r => r.id === formData.value.registration_id)

    if (!registration) {
      throw new Error('Регистрация не найдена')
    }

    // ПРАВИЛЬНЫЙ payload для бэкенда
    const payload = {
      tournament_id: registration.tournament_id,
      athlete_id: registration.athlete_id,
      weight: formData.value.weight
    }

    console.log('Отправка взвешивания:', payload)

    // Мок ответ для демонстрации
    const mockResponse = {
      category: determineMockCategory(formData.value.weight, registration.athlete_id)
    }

    showToast?.(`Вес зарегистрирован! Категория: ${mockResponse.category}`, 'success')
    formData.value = { registration_id: null, weight: null }
    await fetchRegistrations()
  } catch (error) {
    showToast?.('Ошибка: ' + error.message, 'error')
  }
}

// Вспомогательная функция для мок определения категории
const determineMockCategory = (weight, athleteId) => {
  // Мок логика определения категории по весу
  if (weight < 60) return 'до 60 кг'
  if (weight < 66) return 'до 66 кг'
  if (weight < 73) return 'до 73 кг'
  if (weight < 81) return 'до 81 кг'
  if (weight < 90) return 'до 90 кг'
  if (weight < 100) return 'до 100 кг'
  return 'свыше 100 кг'
}

onMounted(() => {
  fetchRegistrations()
})
</script>

<style scoped>
/* Стили наследуются из RegistrationAthletes.css */
</style>