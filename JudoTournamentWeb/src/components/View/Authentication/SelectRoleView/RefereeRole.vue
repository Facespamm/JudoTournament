<!-- [file name]: RefereeRole.vue -->
<template>
  <div class="role-content">
    <div class="role-header">
      <h3>{{ t('selectRole.refereePanel') }}</h3>
      <p>{{ t('selectRole.refereeSubtitle') }}</p>
    </div>

    <!-- Индикатор загрузки -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>{{ t('selectRole.savingData') }}</p>
    </div>

    <form @submit.prevent="saveRefereeProfile" class="role-form">
      <div class="form-grid form-grid-multi">
        <!-- Основные поля -->
        <div class="form-group">
          <label for="last_name">{{ t('selectRole.lastName') }}</label>
          <input
              v-model="refereeForm.last_name"
              type="text"
              id="last_name"
              :placeholder="t('selectRole.enterLastName')"
              :disabled="isLoading"
              required
          />
          <span v-if="errors.last_name" class="error">{{ errors.last_name }}</span>
        </div>

        <div class="form-group">
          <label for="first_name">{{ t('selectRole.firstName') }}</label>
          <input
              v-model="refereeForm.first_name"
              type="text"
              id="first_name"
              :placeholder="t('selectRole.enterFirstName')"
              :disabled="isLoading"
              required
          />
          <span v-if="errors.first_name" class="error">{{ errors.first_name }}</span>
        </div>

        <div class="form-group">
          <label for="middle_name">{{ t('selectRole.middleName') }}</label>
          <input
              v-model="refereeForm.middle_name"
              type="text"
              id="middle_name"
              :placeholder="t('selectRole.enterMiddleName')"
              :disabled="isLoading"
          />
        </div>

        <div class="form-group">
          <label for="license_number">{{ t('selectRole.refereeLicense') }}</label>
          <input
              v-model="refereeForm.license_number"
              type="text"
              id="license_number"
              :placeholder="t('selectRole.enterLicense')"
              :disabled="isLoading"
              required
          />
          <span v-if="errors.license_number" class="error">{{ errors.license_number }}</span>
        </div>

        <div class="form-group">
          <label for="category">{{ t('selectRole.refereeCategory') }}</label>
          <select v-model="refereeForm.category" id="category" :disabled="isLoading" required>
            <option value="">{{ t('selectRole.selectCategory') }}</option>
            <option value="Национальная">{{ t('selectRole.national') }}</option>
            <option value="Континентальная">{{ t('selectRole.continental') }}</option>
            <option value="Международная">{{ t('selectRole.international') }}</option>
            <option value="Всероссийская">{{ t('selectRole.allRussian') }}</option>
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
              :placeholder="t('selectRole.enterEmail')"
              :disabled="isLoading"
          />
        </div>

        <div class="form-group">
          <label for="phone">{{ t('selectRole.phone') }}</label>
          <input
              v-model="refereeForm.phone"
              type="tel"
              id="phone"
              placeholder="+7 (999) 123-45-67"
              :disabled="isLoading"
          />
        </div>

        <div class="form-group">
          <label for="region">{{ t('selectRole.region') }}</label>
          <input
              v-model="refereeForm.region"
              type="text"
              id="region"
              :placeholder="t('selectRole.enterRegion')"
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
          {{ isLoading ? t('selectRole.saving') : t('selectRole.saveProfile') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from '@/i18n'

const emit = defineEmits(['show-toast'])
const { t } = useI18n()

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
    errors.value.last_name = t('selectRole.lastNameRequired')
    isValid = false
  }
  if (!refereeForm.value.first_name) {
    errors.value.first_name = t('selectRole.firstNameRequired')
    isValid = false
  }
  if (!refereeForm.value.license_number) {
    errors.value.license_number = t('selectRole.licenseRequired')
    isValid = false
  }
  if (!refereeForm.value.category) {
    errors.value.category = t('selectRole.categoryRequired')
    isValid = false
  }
  if (!refereeForm.value.region) {
    errors.value.region = t('selectRole.regionRequired')
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

    emit('show-toast', t('selectRole.refereeSaved'), 'success')
  } catch (error) {
    console.error('Ошибка при сохранении профиля:', error)
    emit('show-toast', t('selectRole.refereeSaveError', { message: error.message }), 'error')
  } finally {
    isLoading.value = false
  }
}
</script>
