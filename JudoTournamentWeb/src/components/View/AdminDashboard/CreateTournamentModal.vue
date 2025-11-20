<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <h2>Создать новый турнир</h2>

      <!-- Индикатор загрузки -->
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-spinner"></div>
        <p>Создание турнира...</p>
      </div>

      <form @submit.prevent="submit">
        <div class="form-grid">
          <div class="form-group">
            <label for="name">Название турнира *</label>
            <input
                v-model="formData.name"
                type="text"
                id="name"
                placeholder="Введите название"
                :disabled="isLoading"
                required
            />
            <span v-if="errors.name" class="error">{{ errors.name }}</span>
          </div>

          <div class="form-group">
            <label for="description">Описание</label>
            <textarea
                v-model="formData.description"
                id="description"
                placeholder="Введите описание турнира"
                :disabled="isLoading"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="start_date">Дата начала *</label>
            <input
                v-model="formData.start_date"
                type="date"
                id="start_date"
                :disabled="isLoading"
                required
            />
            <span v-if="errors.start_date" class="error">{{ errors.start_date }}</span>
          </div>

          <div class="form-group">
            <label for="end_date">Дата окончания *</label>
            <input
                v-model="formData.end_date"
                type="date"
                id="end_date"
                :disabled="isLoading"
                required
            />
            <span v-if="errors.end_date" class="error">{{ errors.end_date }}</span>
          </div>

          <div class="form-group">
            <label for="venue">Место проведения *</label>
            <input
                v-model="formData.venue"
                type="text"
                id="venue"
                placeholder="Введите место"
                :disabled="isLoading"
                required
            />
            <span v-if="errors.venue" class="error">{{ errors.venue }}</span>
          </div>

          <div class="form-group">
            <label for="city">Город</label>
            <input
                v-model="formData.city"
                type="text"
                id="city"
                placeholder="Введите город"
                :disabled="isLoading"
            />
          </div>

          <div class="form-group">
            <label for="country">Страна</label>
            <input
                v-model="formData.country"
                type="text"
                id="country"
                :disabled="isLoading"
            />
          </div>

          <div class="form-group">
            <label for="tatami_count">Количество татами *</label>
            <input
                v-model.number="formData.tatami_count"
                type="number"
                id="tatami_count"
                min="1"
                :disabled="isLoading"
                required
            />
            <span v-if="errors.tatami_count" class="error">{{ errors.tatami_count }}</span>
          </div>

          <!-- Дополнительные поля -->
          <div class="form-group">
            <label for="fight_duration">Длительность схватки (сек)</label>
            <input
                v-model.number="formData.fight_duration"
                type="number"
                id="fight_duration"
                min="60"
                :disabled="isLoading"
            />
          </div>

          <div class="form-group">
            <label for="organizer">Организатор</label>
            <input
                v-model="formData.organizer"
                type="text"
                id="organizer"
                placeholder="Введите организатора"
                :disabled="isLoading"
            />
          </div>
        </div>

        <div class="modal-actions">
          <button
              type="button"
              class="modal-button cancel"
              @click="close"
              :disabled="isLoading"
          >
            Отмена
          </button>
          <button
              type="submit"
              class="modal-button submit"
              :disabled="isLoading"
          >
            {{ isLoading ? 'Создание...' : 'Создать' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'submit'])

const formData = ref({
  name: '',
  description: '',
  start_date: '',
  end_date: '',
  venue: '',
  city: '',
  country: 'Казахстан',
  tatami_count: 1,
  status: 'PLANNED',
  // Дополнительные поля для UI
  fight_duration: 300,
  organizer: ''
})

const errors = ref({})
const isLoading = ref(false)

// Сбрасываем форму при открытии модалки
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    resetForm()
  }
})

const resetForm = () => {
  formData.value = {
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    venue: '',
    city: '',
    country: 'Казахстан',
    tatami_count: 1,
    status: 'PLANNED',
    fight_duration: 300,
    organizer: ''
  }
  errors.value = {}
  isLoading.value = false
}

const validateForm = () => {
  errors.value = {}
  let isValid = true

  if (!formData.value.name.trim()) {
    errors.value.name = 'Название обязательно'
    isValid = false
  }

  if (!formData.value.start_date) {
    errors.value.start_date = 'Дата начала обязательна'
    isValid = false
  }

  if (!formData.value.end_date) {
    errors.value.end_date = 'Дата окончания обязательна'
    isValid = false
  }

  if (formData.value.start_date && formData.value.end_date && formData.value.start_date > formData.value.end_date) {
    errors.value.end_date = 'Дата окончания не может быть раньше начала'
    isValid = false
  }

  if (!formData.value.venue.trim()) {
    errors.value.venue = 'Место проведения обязательно'
    isValid = false
  }

  if (formData.value.tatami_count < 1) {
    errors.value.tatami_count = 'Минимум 1 татами'
    isValid = false
  }

  return isValid
}

const close = () => {
  if (!isLoading.value) {
    emit('close')
  }
}

const submit = async () => {
  if (!validateForm()) return

  isLoading.value = true

  try {
    // Подготавливаем данные для отправки
    const payload = {
      name: formData.value.name,
      description: formData.value.description || "",
      start_date: formData.value.start_date,
      end_date: formData.value.end_date,
      venue: formData.value.venue,
      city: formData.value.city || "",
      country: formData.value.country || "Казахстан",
      status: formData.value.status || "PLANNED",
      tatami_count: formData.value.tatami_count || 1
    }

    const response = await fetch('http://127.0.0.1:5000/api/tournaments/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    // Успешное создание - эмитим событие с данными
    emit('submit', { success: true, data: result })

  } catch (error) {
    console.error('Ошибка при создании турнира:', error)
    // Эмитим событие с ошибкой
    emit('submit', {
      success: false,
      error: error.message || 'Произошла неизвестная ошибка'
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
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
  border-radius: 16px;
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

.modal-content {
  position: relative;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-content h2 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #1a1a1a;
  text-align: center;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 0.75rem;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #c89b3c;
}

.form-group input:disabled,
.form-group textarea:disabled,
.form-group select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.error {
  color: #ff4444;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.modal-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.modal-button.cancel {
  background: #f5f5f5;
  color: #666;
}

.modal-button.cancel:hover:not(:disabled) {
  background: #e8e8e8;
}

.modal-button.submit {
  background: linear-gradient(135deg, #c89b3c, #e0b456);
  color: white;
}

.modal-button.submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(200, 155, 60, 0.3);
}

@media (max-width: 768px) {
  .modal-content {
    padding: 1.5rem;
    margin: 1rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>