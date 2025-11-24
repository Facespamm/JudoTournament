<template>
  <div>
    <h3>Добавить спортсмена</h3>

    <!-- Индикатор загрузки -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>Создание спортсмена...</p>
    </div>

    <form @submit.prevent="submit">
      <div class="form-grid form-grid-multi">
        <!-- Основные поля -->
        <div class="form-group">
          <label for="last_name">Фамилия *</label>
          <input
              v-model="formData.last_name"
              type="text"
              id="last_name"
              placeholder="Фамилия"
              :disabled="isLoading"
              required
          />
          <span v-if="errors.last_name" class="error">{{ errors.last_name }}</span>
        </div>

        <div class="form-group">
          <label for="first_name">Имя *</label>
          <input
              v-model="formData.first_name"
              type="text"
              id="first_name"
              placeholder="Имя"
              :disabled="isLoading"
              required
          />
          <span v-if="errors.first_name" class="error">{{ errors.first_name }}</span>
        </div>

        <div class="form-group">
          <label for="middle_name">Отчество</label>
          <input
              v-model="formData.middle_name"
              type="text"
              id="middle_name"
              placeholder="Отчество"
              :disabled="isLoading"
          />
        </div>

        <div class="form-group">
          <label for="gender">Пол *</label>
          <select v-model="formData.gender" id="gender" :disabled="isLoading" required>
            <option value="M">Мужской</option>
            <option value="F">Женский</option>
          </select>
        </div>

        <div class="form-group">
          <label for="date_of_birth">Дата рождения *</label>
          <input
              v-model="formData.date_of_birth"
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
              v-model="formData.region"
              type="text"
              id="region"
              placeholder="Регион"
              :disabled="isLoading"
              required
          />
          <span v-if="errors.region" class="error">{{ errors.region }}</span>
        </div>

        <!-- Контактная информация -->
        <div class="form-group">
          <label for="email">Email</label>
          <input
              v-model="formData.email"
              type="email"
              id="email"
              placeholder="email@example.com"
              :disabled="isLoading"
          />
        </div>

        <div class="form-group">
          <label for="phone">Телефон</label>
          <input
              v-model="formData.phone"
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
              v-model="formData.club"
              type="text"
              id="club"
              placeholder="Клуб"
              :disabled="isLoading"
          />
        </div>

        <div class="form-group">
          <label for="coach">Тренер</label>
          <input
              v-model="formData.coach"
              type="text"
              id="coach"
              placeholder="Тренер"
              :disabled="isLoading"
          />
        </div>

        <div class="form-group">
          <label for="license_number">Лицензия</label>
          <input
              v-model="formData.license_number"
              type="text"
              id="license_number"
              placeholder="Номер лицензии"
              :disabled="isLoading"
          />
        </div>

        <div class="form-group">
          <label for="rank">Разряд</label>
          <select v-model="formData.rank" id="rank" :disabled="isLoading">
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
                v-model="formData.medical_check"
                type="checkbox"
                id="medical_check"
                :disabled="isLoading"
            />
            Мед. справка
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
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import { createAthlete } from '@/components/View/RegistrationAthletes/fetchRegistrationAthletes'

const emit = defineEmits(['athlete-created'])

const isLoading = ref(false)

const formData = ref({
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

// Получаем функцию showToast из родительского компонента
const showToast = inject('showToast') as (message: string, type?: string) => void

const validateForm = () => {
  errors.value = {}
  let isValid = true

  if (!formData.value.last_name) {
    errors.value.last_name = 'Фамилия обязательна'
    isValid = false
  }
  if (!formData.value.first_name) {
    errors.value.first_name = 'Имя обязательно'
    isValid = false
  }
  if (!formData.value.date_of_birth) {
    errors.value.date_of_birth = 'Дата рождения обязательна'
    isValid = false
  }
  if (!formData.value.region) {
    errors.value.region = 'Регион обязателен'
    isValid = false
  }
  return isValid
}

const submit = async () => {
  if (!validateForm()) return

  isLoading.value = true

  try {
    const result = await createAthlete(formData.value)

    if (result.success) {
      // Сброс формы
      formData.value = {
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

      emit('athlete-created')
    } else {
      showToast?.(result.error || 'Ошибка при добавлении спортсмена', 'error')
    }

  } catch (error) {
    console.error('Ошибка при создании спортсмена:', error)
    showToast?.('Ошибка при добавлении спортсмена: ' + error.message, 'error')
  } finally {
    isLoading.value = false
  }
}
</script>