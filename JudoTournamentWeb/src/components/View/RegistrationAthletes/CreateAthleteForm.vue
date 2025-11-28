<template>
  <div class="add-athlete-component">
    <div class="form-section">
      <h3>Добавить спортсмена</h3>

      <!-- Индикатор загрузки -->
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-spinner"></div>
        <p>Создание спортсмена...</p>
      </div>

      <form @submit.prevent="createAthleteHandler">
        <div class="form-grid form-grid-multi">
          <!-- Основные поля -->
          <div class="form-group">
            <label for="last_name">Фамилия *</label>
            <input
                v-model="athleteForm.last_name"
                type="text"
                id="last_name"
                placeholder="Введите фамилию"
                :disabled="isLoading"
                required
            />
            <span v-if="errors.last_name" class="error">{{ errors.last_name }}</span>
          </div>

          <div class="form-group">
            <label for="first_name">Имя *</label>
            <input
                v-model="athleteForm.first_name"
                type="text"
                id="first_name"
                placeholder="Введите имя"
                :disabled="isLoading"
                required
            />
            <span v-if="errors.first_name" class="error">{{ errors.first_name }}</span>
          </div>

          <div class="form-group">
            <label for="middle_name">Отчество</label>
            <input
                v-model="athleteForm.middle_name"
                type="text"
                id="middle_name"
                placeholder="Введите отчество"
                :disabled="isLoading"
            />
          </div>

          <div class="form-group">
            <label for="gender">Пол *</label>
            <select v-model="athleteForm.gender" id="gender" :disabled="isLoading" required>
              <option value="M">Мужской</option>
              <option value="F">Женский</option>
            </select>
          </div>

          <div class="form-group">
            <label for="date_of_birth">Дата рождения *</label>
            <input
                v-model="athleteForm.date_of_birth"
                type="date"
                id="date_of_birth"
                :disabled="isLoading"
                required
            />
            <span v-if="errors.date_of_birth" class="error">{{ errors.date_of_birth }}</span>
          </div>

          <div class="form-group">
            <label for="region">Регион *</label>
            <input
                v-model="athleteForm.region"
                type="text"
                id="region"
                placeholder="Введите регион"
                :disabled="isLoading"
                required
            />
            <span v-if="errors.region" class="error">{{ errors.region }}</span>
          </div>

          <!-- Контактная информация -->
          <div class="form-group">
            <label for="email">Email</label>
            <input
                v-model="athleteForm.email"
                type="email"
                id="email"
                placeholder="Введите email"
                :disabled="isLoading"
            />
          </div>

          <div class="form-group">
            <label for="phone">Телефон</label>
            <input
                v-model="athleteForm.phone"
                type="tel"
                id="phone"
                placeholder="+7 (999) 123-45-67"
                :disabled="isLoading"
            />
          </div>

          <!-- Спортивная информация -->
          <div class="form-group">
            <label for="club">Клуб</label>
            <input
                v-model="athleteForm.club"
                type="text"
                id="club"
                placeholder="Введите клуб"
                :disabled="isLoading"
            />
          </div>

          <div class="form-group">
            <label for="coach">Тренер</label>
            <input
                v-model="athleteForm.coach"
                type="text"
                id="coach"
                placeholder="Введите тренера"
                :disabled="isLoading"
            />
          </div>

          <div class="form-group">
            <label for="license_number">Номер лицензии</label>
            <input
                v-model="athleteForm.license_number"
                type="text"
                id="license_number"
                placeholder="Введите номер лицензии"
                :disabled="isLoading"
            />
          </div>

          <div class="form-group">
            <label for="rank">Разряд</label>
            <select v-model="athleteForm.rank" id="rank" :disabled="isLoading">
              <option value="">Выберите разряд</option>
              <option value="Нет разряда">Нет разряда</option>
              <option value="3 юношеский">3 юношеский</option>
              <option value="2 юношеский">2 юношеский</option>
              <option value="1 юношеский">1 юношеский</option>
              <option value="3 взрослый">3 взрослый</option>
              <option value="2 взрослый">2 взрослый</option>
              <option value="1 взрослый">1 взрослый</option>
              <option value="КМС">КМС</option>
              <option value="МС">МС</option>
              <option value="МСМК">МСМК</option>
            </select>
          </div>

          <!-- Медицинская справка -->
          <div class="form-group checkbox-group">
            <label for="medical_check" class="checkbox-label">
              <input
                  v-model="athleteForm.medical_check"
                  type="checkbox"
                  id="medical_check"
                  :disabled="isLoading"
              />
              Медицинская справка есть
            </label>
          </div>
        </div>

        <div class="form-actions">
          <button
              type="submit"
              class="submit-button"
              :disabled="isLoading"
          >
            {{ isLoading ? 'Создание...' : 'Добавить спортсмена' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { createAthlete, fetchAthletes } from '@/components/View/RegistrationAthletes/fetchRegistrationAthletes'

const props = defineProps({
  toast: Object
})

const emit = defineEmits(['show-toast', 'athlete-created'])

// Состояние загрузки
const isLoading = ref(false)

// Данные для формы
const athleteForm = ref({
  last_name: '',
  first_name: '',
  middle_name: '',
  gender: 'M',
  date_of_birth: '',
  region: '',
  email: '',
  phone: '',
  club: '',
  coach: '',
  license_number: '',
  rank: '',
  medical_check: true
})

const errors = ref({})
const athletes = ref([])

// Получение данных
const loadAthletes = async () => {
  try {
    const result = await fetchAthletes()
    if (result.success) {
      athletes.value = result.data
      athletes.value = athletes.value.map(athlete => ({
        ...athlete,
        full_name: `${athlete.last_name} ${athlete.first_name} ${athlete.middle_name || ''}`.trim()
      }))
    } else {
      console.error('Ошибка загрузки спортсменов:', result.error)
    }
  } catch (error) {
    console.error('Ошибка:', error)
  }
}

// Валидация формы
const validateAthleteForm = () => {
  errors.value = {}
  let isValid = true

  if (!athleteForm.value.last_name) {
    errors.value.last_name = 'Фамилия обязательна'
    isValid = false
  }
  if (!athleteForm.value.first_name) {
    errors.value.first_name = 'Имя обязательно'
    isValid = false
  }
  if (!athleteForm.value.date_of_birth) {
    errors.value.date_of_birth = 'Дата рождения обязательна'
    isValid = false
  }
  if (!athleteForm.value.region) {
    errors.value.region = 'Регион обязателен'
    isValid = false
  }
  return isValid
}

const createAthleteHandler = async () => {
  if (!validateAthleteForm()) return

  isLoading.value = true

  try {
    const result = await createAthlete(athleteForm.value)

    if (result.success) {
      emit('show-toast', 'Спортсмен успешно добавлен!', 'success')

      // Сброс формы
      athleteForm.value = {
        last_name: '',
        first_name: '',
        middle_name: '',
        gender: 'M',
        date_of_birth: '',
        region: '',
        email: '',
        phone: '',
        club: '',
        coach: '',
        license_number: '',
        rank: '',
        medical_check: true
      }

      await loadAthletes() // Обновляем список спортсменов
      emit('athlete-created')
    } else {
      emit('show-toast', result.error || 'Ошибка при добавлении спортсмена', 'error')
    }

  } catch (error) {
    console.error('Ошибка при создании спортсмена:', error)
    emit('show-toast', 'Ошибка при добавлении спортсмена: ' + error.message, 'error')
  } finally {
    isLoading.value = false
  }
}

// Загружаем спортсменов при монтировании
loadAthletes()
</script>

<style scoped>
.add-athlete-component {
  width: 100%;
}
</style>