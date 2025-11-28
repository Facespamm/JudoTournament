<template>
  <div class="bracket-creation">
    <h3>Создание сетки турнира</h3>

    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>Создание сетки...</p>
    </div>

    <div class="creation-form">
      <div class="form-grid">
        <div class="form-group">
          <label for="tournament_id">Турнир *</label>
          <select v-model="formData.tournament_id" id="tournament_id" :disabled="isLoading" required>
            <option value="">Выберите турнир</option>
            <option v-for="t in tournaments" :key="t.id" :value="t.id">{{ t.name }}</option>
          </select>
          <span v-if="errors.tournament_id" class="error">{{ errors.tournament_id }}</span>
        </div>

        <div class="form-group">
          <label for="category_id">Категория *</label>
          <select
              v-model="formData.category_id"
              id="category_id"
              :disabled="isLoading || !formData.tournament_id || categories.length === 0"
              required
          >
            <option value="">
              {{ formData.tournament_id ? 'Выберите категорию' : 'Сначала выберите турнир' }}
            </option>
            <option v-for="c in categories" :key="c.id" :value="c.id">
              {{ c.name }} ({{ c.gender === 'MALE' ? 'М' : 'Ж' }})
            </option>
          </select>
          <span v-if="errors.category_id" class="error">{{ errors.category_id }}</span>
        </div>

        <div class="form-group">
          <label for="bracket_type">Тип сетки *</label>
          <select v-model="formData.bracket_type" id="bracket_type" :disabled="isLoading" required>
            <option value="">Выберите тип</option>
            <option value="single_elimination">Олимпийская система</option>
            <option value="double_elimination">Двойная элиминация</option>
            <option value="round_robin">Круговая система</option>
          </select>
          <span v-if="errors.bracket_type" class="error">{{ errors.bracket_type }}</span>
        </div>

        <div class="form-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="formData.has_consolation" :disabled="isLoading" />
            <span class="checkmark"></span>
            Утешительные встречи
          </label>
        </div>

        <div class="form-group full-width">
          <label for="name">Название сетки *</label>
          <input
              type="text"
              v-model="formData.name"
              id="name"
              placeholder="Например: Мужчины -73 кг"
              :disabled="isLoading"
              required
          />
          <span v-if="errors.name" class="error">{{ errors.name }}</span>
        </div>
      </div>

      <!-- Предпросмотр -->
      <div v-if="previewData" class="preview-section">
        <h4>Предварительный просмотр:</h4>
        <div class="preview-card">
          <div class="preview-row">
            <span class="preview-label">Турнир:</span>
            <span class="preview-value">{{ getTournamentName(previewData.tournament_id) }}</span>
          </div>
          <div class="preview-row">
            <span class="preview-label">Категория:</span>
            <span class="preview-value">{{ getCategoryName(previewData.category_id) }}</span>
          </div>
          <div class="preview-row">
            <span class="preview-label">Тип сетки:</span>
            <span class="preview-value">{{ getBracketTypeName(previewData.bracket_type) }}</span>
          </div>
          <div class="preview-row">
            <span class="preview-label">Утешительные:</span>
            <span class="preview-value">{{ previewData.has_consolation ? 'Да' : 'Нет' }}</span>
          </div>
          <div class="preview-row">
            <span class="preview-label">Название:</span>
            <span class="preview-value">{{ previewData.name }}</span>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button @click="preview" class="preview-button" :disabled="isLoading || !isFormValid">
          Предварительный просмотр
        </button>
        <button @click="submit" class="submit-button" :disabled="isLoading || !previewData">
          {{ isLoading ? 'Создание...' : 'Создать сетку' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { fetchCategories } from '@/components/View/TournamentManagement/fetchTournamentManagement.js'
import { createBracket } from '@/components/View/Brackets/fetchBrackets.js'

const props = defineProps({
  tournaments: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['bracket-created'])

const isLoading = ref(false)
const categories = ref([])
const previewData = ref(null)

const formData = ref({
  tournament_id: null,
  category_id: null,
  bracket_type: '',
  has_consolation: false,
  name: ''
})

const errors = ref({})

const isFormValid = computed(() =>
    formData.value.tournament_id &&
    formData.value.category_id &&
    formData.value.bracket_type &&
    formData.value.name.trim()
)

watch(() => formData.value.tournament_id, async (id) => {
  formData.value.category_id = null
  previewData.value = null
  if (id) await loadCategories(id)
  else categories.value = []
})

const loadCategories = async (tId) => {
  const res = await fetchCategories(tId)
  if (res.success) {
    categories.value = res.categories || res.data?.categories || res.data || []
  } else categories.value = []
}

const getTournamentName = (id) => props.tournaments.find(t => t.id === id)?.name || '—'
const getCategoryName = (id) => {
  const c = categories.value.find(c => c.id === id)
  return c ? `${c.name} (${c.gender === 'MALE' ? 'М' : 'Ж'})` : '—'
}
const getBracketTypeName = (t) => ({
  single_elimination: 'Олимпийская система',
  double_elimination: 'Двойная элиминация',
  round_robin: 'Круговая система'
}[t] || '—')

const validateForm = () => {
  errors.value = {}
  if (!formData.value.tournament_id) errors.value.tournament_id = 'Выберите турнир'
  if (!formData.value.category_id) errors.value.category_id = 'Выберите категорию'
  if (!formData.value.bracket_type) errors.value.bracket_type = 'Выберите тип'
  if (!formData.value.name.trim()) errors.value.name = 'Введите название'
  return Object.keys(errors.value).length === 0
}

const preview = () => {
  if (validateForm()) previewData.value = { ...formData.value }
}

const submit = async () => {
  if (!validateForm()) return
  isLoading.value = true
  try {
    const payload = { ...formData.value }

    // Используем импортированную функцию
    const result = await createBracket(payload)

    if (result.success) {
      const newBracket = {
        ...payload,
        id: result.data.id || Date.now(),
        status: 'draft',
        participants_count: 0
      }

      emit('bracket-created', newBracket)

      // Сброс формы
      formData.value = {
        tournament_id: null,
        category_id: null,
        bracket_type: '',
        has_consolation: false,
        name: ''
      }
      previewData.value = null
    } else {
      throw new Error(result.error)
    }
  } catch (e) {
    alert('Ошибка: ' + e.message)
  } finally {
    isLoading.value = false
  }
}
</script>