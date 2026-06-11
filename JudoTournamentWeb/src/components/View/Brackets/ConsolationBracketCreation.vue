<template>
  <div class="bracket-selection">
    <h3>{{ t('brackets.consolationTitle') }}</h3>

    <!-- Индикатор загрузки -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>{{ t('brackets.creatingConsolation') }}</p>
    </div>

    <!-- Модалка УСПЕХА -->
    <div v-if="showSuccessModal" class="admin-modal-overlay" @click.self="closeSuccessModal">
      <div class="admin-modal-content success-modal">
        <div class="success-icon">✅</div>
        <h2>{{ t('brackets.consolationCreatedTitle') }}</h2>
        <p class="success-text">
          {{ t('brackets.createdTextPrefix') }} «<strong>{{ successBracketName }}</strong>» {{ t('brackets.createdTextSuffix') }}
        </p>
        <div class="admin-modal-actions">
          <button class="admin-modal-button admin-modal-button-submit" @click="closeSuccessModal">
            {{ t('brackets.continue') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Модалка ОШИБКИ -->
    <div v-if="showErrorModal" class="admin-modal-overlay" @click.self="closeErrorModal">
      <div class="admin-modal-content error-modal">
        <div class="error-icon">❌</div>
        <h2>{{ t('brackets.createErrorTitle') }}</h2>
        <p class="error-text">{{ errorMessage }}</p>
        <div class="admin-modal-actions">
          <button class="admin-modal-button admin-modal-button-cancel" @click="closeErrorModal">
            {{ t('brackets.close') }}
          </button>
        </div>
      </div>
    </div>

    <div class="selection-form">
      <div class="form-grid">
        <!-- Турнир -->
        <div class="form-group">
          <label for="tournament_id">{{ t('brackets.tournamentRequired') }}</label>
          <select
              v-model="formData.tournament_id"
              id="tournament_id"
              :disabled="isLoading || categoriesLoading"
          >
            <option value="">{{ t('brackets.selectTournament') }}</option>
            <option v-for="t in tournaments" :key="t.id" :value="t.id">
              {{ t.name }}
            </option>
          </select>
        </div>

        <!-- Категория -->
        <div class="form-group">
          <label for="category_id">{{ t('brackets.categoryRequired') }}</label>
          <select
              v-model="formData.category_id"
              id="category_id"
              :disabled="!formData.tournament_id || categoriesLoading || isLoading"
          >
            <option value="">
              {{ categoriesLoading ? t('brackets.loadingCategories') :
                (formData.tournament_id ? t('brackets.selectCategory') : t('brackets.selectTournamentFirst')) }}
            </option>
            <option v-for="c in categories" :key="c.id" :value="c.id">
              {{ c.name }} ({{ getGenderLabel(c.gender) }})
            </option>
          </select>
        </div>

        <!-- Тип утешительной сетки -->
        <div class="form-group">
          <label for="consolation_type">{{ t('brackets.consolationType') }}</label>
          <select
              v-model="formData.consolation_type"
              id="consolation_type"
              :disabled="!formData.category_id || isLoading"
          >
            <option value="semifinals">{{ t('brackets.consolationSemifinal') }}</option>
            <option value="finals">{{ t('brackets.consolationFinal') }}</option>
          </select>
        </div>

        <!-- Номер татами -->
        <div class="form-group">
          <label for="tatami_number">{{ t('brackets.tatamiNumber') }}</label>
          <input
              type="number"
              v-model.number="formData.tatami_number"
              id="tatami_number"
              min="1"
              step="1"
              class="tatami-input"
              :placeholder="t('brackets.tatamiPlaceholder')"
          />
        </div>
      </div>

      <div class="form-actions">
        <button
            @click="submit"
            class="submit-button"
            :disabled="isLoading || !isFormValid || categoriesLoading"
        >
          {{ isLoading ? t('brackets.creating') : t('brackets.createConsolationButton') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { fetchGetCategoryByTournament } from '@/components/View/Brackets/fetchBrackets.js'
import { createBasketSemiFinals, createBasketFinals } from '@/components/View/Brackets/fetchBrackets.js'
import { useI18n } from '@/i18n'

const { t } = useI18n()

const props = defineProps({
  tournaments: { type: Array, default: () => [] },
  existingBrackets: { type: Array, default: () => [] }
})

const emit = defineEmits(['bracket-created'])

const isLoading = ref(false)
const categoriesLoading = ref(false)
const categories = ref([])

const showSuccessModal = ref(false)
const successBracketName = ref('')

const showErrorModal = ref(false)
const errorMessage = ref('')

const formData = ref({
  tournament_id: null,
  category_id: null,
  tatami_number: null,
  consolation_type: 'semifinals'
})

const isFormValid = computed(() =>
    formData.value.tournament_id &&
    formData.value.category_id &&
    formData.value.consolation_type
)

const getGenderLabel = (gender) => {
  if (!gender) return '?'
  const lower = gender.toString().toLowerCase().trim()
  if (lower === 'male' || lower.includes('муж') || lower === 'м') return 'М'
  if (lower === 'female' || lower.includes('жен') || lower === 'ж') return 'Ж'
  return '?'
}

watch(() => formData.value.tournament_id, async (id) => {
  formData.value.category_id = null
  categories.value = []

  if (!id) {
    categoriesLoading.value = false
    return
  }

  categoriesLoading.value = true
  try {
    const res = await fetchGetCategoryByTournament(id)
    let cats = []

    if (res.success && (res.categories || res.data?.categories)) {
      cats = res.categories || res.data?.categories || []
    } else if (Array.isArray(res)) {
      cats = res
    } else if (res.data && Array.isArray(res.data)) {
      cats = res.data
    }

    categories.value = cats
  } catch (err) {
    console.error('Ошибка загрузки категорий:', err)
    categories.value = []
    alert(t('brackets.loadCategoriesError'))
  } finally {
    categoriesLoading.value = false
  }
})

const getBracketName = () => {
  const c = categories.value.find(cat => cat.id === formData.value.category_id)
  const categoryStr = c ? `${c.name} (${getGenderLabel(c.gender)})` : t('brackets.consolationFallback')
  const stage = formData.value.consolation_type === 'semifinals' ? t('brackets.semifinal') : t('brackets.final')
  return t('brackets.consolationName', { stage, category: categoryStr })
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  successBracketName.value = ''
}

const closeErrorModal = () => {
  showErrorModal.value = false
  errorMessage.value = ''
}

const submit = async () => {
  if (!isFormValid.value) return

  isLoading.value = true
  try {
    const payload = {
      name: getBracketName(),
      bracket_type: 'consolation',
      consolation_stage: formData.value.consolation_type,
      has_consolation: false
    }

    const tournamentId = Number(formData.value.tournament_id)
    const categoryId = Number(formData.value.category_id)
    const tatamiNumber = formData.value.tatami_number ?? null

    let result
    if (formData.value.consolation_type === 'semifinals') {
      result = await createBasketSemiFinals(payload, tournamentId, categoryId, tatamiNumber)
    } else {
      result = await createBasketFinals(payload, tournamentId, categoryId, tatamiNumber)
    }

    if (result.success) {
      const bracketName = getBracketName()

      emit('bracket-created', {
        ...payload,
        id: result.data?.id || Date.now(),
        category_id: categoryId,
        tournament_id: tournamentId,
        status: 'GENERATED',
        progress_percentage: 0,
        is_consolation: true,
        consolation_type: formData.value.consolation_type
      })

      formData.value.category_id = null

      successBracketName.value = bracketName
      showSuccessModal.value = true
    } else {
      throw new Error(result.error || t('brackets.unknownError'))
    }
  } catch (err) {
    console.error(err)
    errorMessage.value = err.message || t('brackets.consolationUnknownError')
    showErrorModal.value = true
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.bracket-selection {
  position: relative;
  padding: 1.5rem;
  background: #f9f9f9;
  border-radius: 12px;
}

.selection-form { margin-top: 1rem; }

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-group { display: flex; flex-direction: column; }

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.form-group select,
.tatami-input {
  padding: 0.8rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
}

.form-group select:disabled,
.tatami-input:disabled {
  background: #f0f0f0;
  color: #888;
}

.form-actions { display: flex; justify-content: flex-end; }

.submit-button {
  padding: 0.85rem 2.2rem;
  font-size: 1.05rem;
  font-weight: 600;
  background: linear-gradient(135deg, #c89b3c, #e0b456);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(200, 155, 60, 0.3);
}

.submit-button:disabled {
  background: #aaa;
  cursor: not-allowed;
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

@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 768px) {
  .form-grid { grid-template-columns: 1fr; }
}
</style>
