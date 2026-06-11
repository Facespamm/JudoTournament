<template>
  <div class="manage-categories">
    <h3>{{ t('tournamentManagement.createCategoryTitle') }}</h3>

    <!-- Индикатор загрузки -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>{{ t('tournamentManagement.creatingCategory') }}</p>
    </div>

    <!-- Модалка УСПЕХА -->
    <div v-if="showSuccessModal" class="admin-modal-overlay" @click.self="closeSuccessModal">
      <div class="admin-modal-content success-modal">
        <div class="success-icon">✅</div>
        <h2>{{ t('tournamentManagement.categoryCreatedTitle') }}</h2>
        <p class="success-text">
          {{ t('tournamentManagement.categoryCreatedText') }}
        </p>
        <div class="admin-modal-actions">
          <button class="admin-modal-button admin-modal-button-submit" @click="closeSuccessModal">
            {{ t('tournamentManagement.continue') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Модалка ОШИБКИ -->
    <div v-if="showErrorModal" class="admin-modal-overlay" @click.self="closeErrorModal">
      <div class="admin-modal-content error-modal">
        <div class="error-icon">❌</div>
        <h2>{{ t('tournamentManagement.createErrorTitle') }}</h2>
        <p class="error-text">{{ errorMessage }}</p>
        <div class="admin-modal-actions">
          <button class="admin-modal-button admin-modal-button-cancel" @click="closeErrorModal">
            {{ t('tournamentManagement.close') }}
          </button>
        </div>
      </div>
    </div>

    <form @submit.prevent="submit">
      <div class="form-grid">
        <div class="form-group">
          <label for="gender">{{ t('tournamentManagement.gender') }}</label>
          <select
              v-model="formData.gender"
              id="gender"
              :disabled="isLoading"
              required
          >
            <option value="мужской">{{ t('tournamentManagement.male') }}</option>
            <option value="женский">{{ t('tournamentManagement.female') }}</option>
          </select>
        </div>

        <!-- Числовые поля теперь компактные -->
        <div class="form-group number-group">
          <label for="min_age">{{ t('tournamentManagement.minBirthYear') }}</label>
          <input
              v-model.number="formData.min_age"
              type="number"
              id="min_age"
              min="0"
              :placeholder="t('tournamentManagement.noLimit')"
              :disabled="isLoading"
          />
        </div>

        <div class="form-group number-group">
          <label for="max_age">{{ t('tournamentManagement.maxBirthYear') }}</label>
          <input
              v-model.number="formData.max_age"
              type="number"
              id="max_age"
              min="0"
              :placeholder="t('tournamentManagement.noLimit')"
              :disabled="isLoading"
          />
          <span v-if="errors.max_age" class="error">{{ errors.max_age }}</span>
        </div>

        <div class="form-group number-group">
          <label for="min_weight">{{ t('tournamentManagement.minWeight') }}</label>
          <input
              v-model.number="formData.min_weight"
              type="number"
              id="min_weight"
              min="0"
              step="0.1"
              :placeholder="t('tournamentManagement.noLimit')"
              :disabled="isLoading"
          />
        </div>

        <div class="form-group number-group">
          <label for="max_weight">{{ t('tournamentManagement.maxWeight') }}</label>
          <input
              v-model.number="formData.max_weight"
              type="number"
              id="max_weight"
              min="0"
              step="0.1"
              :placeholder="t('tournamentManagement.noLimit')"
              :disabled="isLoading"
          />
          <span v-if="errors.max_weight" class="error">{{ errors.max_weight }}</span>
        </div>
      </div>

      <div class="form-actions">
        <button
            type="submit"
            class="submit-button"
            :disabled="isLoading"
        >
          {{ isLoading ? t('tournamentManagement.creating') : t('tournamentManagement.createCategory') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { createCategory } from '@/components/View/TournamentManagement/fetchTournamentManagement.js'
import { useI18n } from '@/i18n'

const { t } = useI18n()

const isLoading = ref(false)
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')

const formData = ref({
  gender: 'мужской',
  min_age: 0,
  max_age: 0,
  min_weight: 0,
  max_weight: 0
})

const errors = ref({})

const generateCategoryName = (data) => {
  const genderTitle = data.gender === 'мужской'
      ? t('tournamentManagement.maleCategory')
      : t('tournamentManagement.femaleCategory')
  const parts = [genderTitle]

  let agePart = ''
  if (data.min_age > 0 || data.max_age > 0) {
    if (data.min_age > 0 && data.max_age > 0) {
      agePart = `${data.min_age}-${data.max_age} ${t('tournamentManagement.years')}`
    } else if (data.min_age > 0) {
      agePart = `${data.min_age}+ ${t('tournamentManagement.years')}`
    } else if (data.max_age > 0) {
      agePart = `${t('tournamentManagement.upTo')} ${data.max_age} ${t('tournamentManagement.years')}`
    }
  }
  if (agePart) parts.push(agePart)

  let weightPart = ''
  if (data.min_weight > 0 || data.max_weight > 0) {
    const minW = data.min_weight.toString().replace('.', ',')
    const maxW = data.max_weight.toString().replace('.', ',')
    if (data.min_weight > 0 && data.max_weight > 0) {
      weightPart = `${minW}-${maxW} ${t('tournamentManagement.kg')}`
    } else if (data.min_weight > 0) {
      weightPart = `${minW}+ ${t('tournamentManagement.kg')}`
    } else if (data.max_weight > 0) {
      weightPart = `${t('tournamentManagement.upTo')} ${maxW} ${t('tournamentManagement.kg')}`
    }
  }
  if (weightPart) parts.push(weightPart)

  return parts.join(' ')
}

const generatedName = computed(() => generateCategoryName(formData.value))

const validateForm = () => {
  errors.value = {}
  let isValid = true

  if (formData.value.min_age > formData.value.max_age && formData.value.max_age > 0) {
    errors.value.max_age = t('tournamentManagement.maxAgeError')
    isValid = false
  }

  if (formData.value.min_weight > formData.value.max_weight && formData.value.max_weight > 0) {
    errors.value.max_weight = t('tournamentManagement.maxWeightError')
    isValid = false
  }

  return isValid
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
}

const closeErrorModal = () => {
  showErrorModal.value = false
  errorMessage.value = ''
}

const submit = async () => {
  if (!validateForm()) return

  isLoading.value = true

  try {
    const payload = {
      name: generatedName.value,
      gender: formData.value.gender,
      min_age: formData.value.min_age || 0,
      max_age: formData.value.max_age || 0,
      min_weight: formData.value.min_weight || 0,
      max_weight: formData.value.max_weight || 0
    }

    const result = await createCategory(payload)

    if (result.success) {
      showSuccessModal.value = true

      formData.value = {
        gender: 'мужской',
        min_age: 0,
        max_age: 0,
        min_weight: 0,
        max_weight: 0
      }
      errors.value = {}
    } else {
      throw new Error(result.error || t('tournamentManagement.unknownError'))
    }
  } catch (error) {
    console.error('Ошибка при создании категории:', error)
    errorMessage.value = error.message || t('tournamentManagement.categoryUnknownError')
    showErrorModal.value = true
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.manage-categories {
  position: relative; /* обязательно для loading-overlay */
  padding: 1.5rem;
  background: #f9f9f9;
  border-radius: 12px;
}

/* ==================== КОМПАКТНЫЙ ГРИД ==================== */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 14px;
}

.form-group label {
  font-size: 0.95rem;
  margin-bottom: 5px;
  display: block;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 9px 12px;
  font-size: 0.96rem;
  border-radius: 8px;
  border: 1px solid #ddd;
}

/* Узкие поля для чисел */
.number-group input[type="number"] {
  max-width: 165px;
}

/* ==================== КНОПКА И ОШИБКИ ==================== */
.form-actions {
  margin-top: 20px;
  text-align: right;
}

.submit-button {
  padding: 10px 24px;
  font-size: 1rem;
  border-radius: 8px;
  background: #2c8f3c;
  color: white;
  border: none;
  cursor: pointer;
}

.submit-button:disabled {
  background: #aaa;
  cursor: not-allowed;
}

.error {
  color: #e53935;
  font-size: 0.82rem;
  margin-top: 3px;
}

/* ====================== МОДАЛКИ ====================== */
.admin-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.admin-modal-content {
  background: white;
  border-radius: 16px;
  width: 380px;
  max-width: 92vw;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  padding: 30px 24px;
  text-align: center;
}

.success-icon, .error-icon { font-size: 3.5rem; margin-bottom: 10px; }
.admin-modal-content h2 { margin: 0 0 10px; font-size: 1.4rem; }
.success-text, .error-text { font-size: 1.05rem; line-height: 1.4; margin-bottom: 24px; }

.admin-modal-button-submit {
  background: linear-gradient(135deg, #c89b3c, #e0b456);
  color: white;
  border: none;
  padding: 12px 32px;
  font-size: 1rem;
  border-radius: 10px;
  cursor: pointer;
}

.admin-modal-button-cancel {
  background: #e53935;
  color: white;
  border: none;
  padding: 12px 32px;
  font-size: 1rem;
  border-radius: 10px;
  cursor: pointer;
}

.error-modal .error-icon { color: #e53935; }
.error-modal h2 { color: #e53935; }

/* Лоадер */
.loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: 12px;
}

.loading-spinner {
  width: 46px;
  height: 46px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #c89b3c;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
