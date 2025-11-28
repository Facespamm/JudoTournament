<!-- [file name]: RefereeRole.vue -->
<template>
  <div class="role-content">
    <div class="role-header">
      <h3>Панель рефери</h3>
      <p>Судейство соревнований и управление протоколами</p>
    </div>

    <!-- Индикатор загрузки -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>Сохранение данных...</p>
    </div>

    <form @submit.prevent="saveRefereeProfile" class="role-form">
      <div class="form-grid form-grid-multi">
        <!-- Основные поля -->
        <div class="form-group">
          <label for="last_name">Фамилия *</label>
          <input
              v-model="refereeForm.last_name"
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
              v-model="refereeForm.first_name"
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
              v-model="refereeForm.middle_name"
              type="text"
              id="middle_name"
              placeholder="Введите отчество"
              :disabled="isLoading"
          />
        </div>

        <div class="form-group">
          <label for="license_number">Номер лицензии рефери *</label>
          <input
              v-model="refereeForm.license_number"
              type="text"
              id="license_number"
              placeholder="Введите номер лицензии"
              :disabled="isLoading"
              required
          />
          <span v-if="errors.license_number" class="error">{{ errors.license_number }}</span>
        </div>

        <div class="form-group">
          <label for="category">Категория рефери *</label>
          <select v-model="refereeForm.category" id="category" :disabled="isLoading" required>
            <option value="">Выберите категорию</option>
            <option value="Национальная">Национальная</option>
            <option value="Континентальная">Континентальная</option>
            <option value="Международная">Международная</option>
            <option value="Всероссийская">Всероссийская</option>
          </select>
          <span v-if="errors.category" class="error">{{ errors.category }}</span>
        </div>

        <!-- Контактная информация -->
        <div class="form-group">
          <label for="email">Email</label>
          <input
              v-model="refereeForm.email"
              type="email"
              id="email"
              placeholder="Введите email"
              :disabled="isLoading"
          />
        </div>

        <div class="form-group">
          <label for="phone">Телефон</label>
          <input
              v-model="refereeForm.phone"
              type="tel"
              id="phone"
              placeholder="+7 (999) 123-45-67"
              :disabled="isLoading"
          />
        </div>

        <div class="form-group">
          <label for="region">Регион *</label>
          <input
              v-model="refereeForm.region"
              type="text"
              id="region"
              placeholder="Введите регион"
              :disabled="isLoading"
              required
          />
          <span v-if="errors.region" class="error">{{ errors.region }}</span>
        </div>
      </div>

      <div class="form-actions">
        <button
            type="submit"
            class="submit-button"
            :disabled="isLoading"
        >
          {{ isLoading ? 'Сохранение...' : 'Сохранить профиль' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['show-toast'])

// Состояние загрузки
const isLoading = ref(false)

// Данные для формы рефери
const refereeForm = ref({
  last_name: '',
  first_name: '',
  middle_name: '',
  license_number: '',
  category: '',
  email: '',
  phone: '',
  region: ''
})

const errors = ref({})

// Валидация формы
const validateRefereeForm = () => {
  errors.value = {}
  let isValid = true

  if (!refereeForm.value.last_name) {
    errors.value.last_name = 'Фамилия обязательна'
    isValid = false
  }
  if (!refereeForm.value.first_name) {
    errors.value.first_name = 'Имя обязательно'
    isValid = false
  }
  if (!refereeForm.value.license_number) {
    errors.value.license_number = 'Номер лицензии обязателен'
    isValid = false
  }
  if (!refereeForm.value.category) {
    errors.value.category = 'Категория обязательна'
    isValid = false
  }
  if (!refereeForm.value.region) {
    errors.value.region = 'Регион обязателен'
    isValid = false
  }
  return isValid
}

const saveRefereeProfile = async () => {
  if (!validateRefereeForm()) return

  isLoading.value = true

  try {
    // Имитация сохранения данных
    await new Promise(resolve => setTimeout(resolve, 1500))

    console.log('Сохранение данных рефери:', refereeForm.value)

    emit('show-toast', 'Профиль рефери успешно сохранен!', 'success')
  } catch (error) {
    console.error('Ошибка при сохранении профиля:', error)
    emit('show-toast', 'Ошибка при сохранении профиля: ' + error.message, 'error')
  } finally {
    isLoading.value = false
  }
}
</script>