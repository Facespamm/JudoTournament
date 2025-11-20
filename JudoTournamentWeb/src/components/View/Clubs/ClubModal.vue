<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <!-- Успешное создание/редактирование -->
      <div v-if="isSuccess" class="success-overlay">
        <div class="success-icon">✅</div>
        <h3 class="success-title">{{ successTitle }}</h3>
        <p class="success-message">{{ successMessage }}</p>
        <button class="success-button" @click="close">Продолжить</button>
      </div>

      <!-- Форма клуба -->
      <template v-else>
        <h2>{{ editingClub ? 'Редактирование клуба' : 'Создание клуба' }}</h2>

        <!-- Индикатор загрузки -->
        <div v-if="isLoading" class="loading-overlay">
          <div class="loading-spinner"></div>
          <p>{{ editingClub ? 'Сохранение...' : 'Создание...' }}</p>
        </div>

        <form @submit.prevent="submit">
          <div class="form-grid">
            <div class="form-group">
              <label for="club_name">Название клуба *</label>
              <input
                  v-model="formData.name"
                  type="text"
                  id="club_name"
                  placeholder="Введите название клуба"
                  :disabled="isLoading"
                  required
              />
            </div>

            <div class="form-group">
              <label for="short_name">Короткое название</label>
              <input
                  v-model="formData.short_name"
                  type="text"
                  id="short_name"
                  placeholder="Сокращенное название"
                  :disabled="isLoading"
              />
            </div>

            <div class="form-group">
              <label for="city">Город *</label>
              <input
                  v-model="formData.city"
                  type="text"
                  id="city"
                  placeholder="Введите город"
                  :disabled="isLoading"
                  required
              />
            </div>

            <div class="form-group">
              <label for="country">Страна</label>
              <input
                  v-model="formData.country"
                  type="text"
                  id="country"
                  placeholder="Страна"
                  :disabled="isLoading"
              />
            </div>

            <div class="form-group">
              <label for="coach_name">Тренер</label>
              <input
                  v-model="formData.coach_name"
                  type="text"
                  id="coach_name"
                  placeholder="ФИО тренера"
                  :disabled="isLoading"
              />
            </div>

            <div class="form-group">
              <label for="phone">Телефон</label>
              <input
                  v-model="formData.phone"
                  type="tel"
                  id="phone"
                  placeholder="+7 (XXX) XXX-XX-XX"
                  :disabled="isLoading"
              />
            </div>

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
              <label for="founded_year">Год основания</label>
              <input
                  v-model.number="formData.founded_year"
                  type="number"
                  id="founded_year"
                  placeholder="2020"
                  min="1900"
                  :max="new Date().getFullYear()"
                  :disabled="isLoading"
              />
            </div>

            <div class="form-group full-width">
              <label for="website">Веб-сайт</label>
              <input
                  v-model="formData.website"
                  type="url"
                  id="website"
                  placeholder="https://example.com"
                  :disabled="isLoading"
              />
            </div>

            <div class="form-group full-width">
              <label for="address">Адрес</label>
              <textarea
                  v-model="formData.address"
                  id="address"
                  placeholder="Полный адрес клуба"
                  rows="3"
                  :disabled="isLoading"
              ></textarea>
            </div>
          </div>

          <div class="form-notes">
            <p>* - обязательные поля для заполнения</p>
          </div>

          <div class="modal-actions">
            <button type="button" class="modal-button cancel" @click="close" :disabled="isLoading">
              Отмена
            </button>
            <button type="submit" class="modal-button submit" :disabled="isLoading">
              {{ isLoading ? (editingClub ? 'Сохранение...' : 'Создание...') : (editingClub ? 'Сохранить' : 'Создать') }}
            </button>
          </div>
        </form>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { createClub, updateClub } from '@/components/View/Clubs/fetchClubs.js'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  editingClub: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'submit'])

const formData = ref({
  name: '',
  short_name: '',
  city: '',
  country: 'Казахстан',
  address: '',
  phone: '',
  email: '',
  website: '',
  coach_name: '',
  founded_year: null
})

const isLoading = ref(false)
const isSuccess = ref(false)
const successTitle = ref('')
const successMessage = ref('')
let successTimer = null

// Вычисляемые свойства для текста успеха
const successTexts = computed(() => {
  if (props.editingClub) {
    return {
      title: 'Клуб успешно обновлен!',
      message: `Данные клуба "${formData.value.name}" были успешно сохранены.`
    }
  } else {
    return {
      title: 'Клуб успешно создан!',
      message: `Клуб "${formData.value.name}" был успешно создан и добавлен в систему.`
    }
  }
})

// Сбрасываем форму при открытии модалки
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    resetForm()
    if (props.editingClub) {
      formData.value = { ...props.editingClub }
    }
  }
})

const resetForm = () => {
  formData.value = {
    name: '',
    short_name: '',
    city: '',
    country: 'Казахстан',
    address: '',
    phone: '',
    email: '',
    website: '',
    coach_name: '',
    founded_year: null
  }
  isLoading.value = false
  isSuccess.value = false

  if (successTimer) {
    clearTimeout(successTimer)
    successTimer = null
  }
}

const showSuccessAndClose = () => {
  successTitle.value = successTexts.value.title
  successMessage.value = successTexts.value.message
  isSuccess.value = true

  // Автоматическое закрытие через 3 секунды
  successTimer = setTimeout(() => {
    emit('close')
  }, 3000)
}

const close = () => {
  if (!isLoading.value) {
    emit('close')
  }
}

const submit = async () => {
  isLoading.value = true

  try {
    const payload = {
      name: formData.value.name,
      short_name: formData.value.short_name || undefined,
      city: formData.value.city,
      country: formData.value.country || 'Казахстан',
      address: formData.value.address || undefined,
      phone: formData.value.phone || undefined,
      email: formData.value.email || undefined,
      website: formData.value.website || undefined,
      coach_name: formData.value.coach_name || undefined,
      founded_year: formData.value.founded_year || undefined
    }

    let result

    if (props.editingClub) {
      // Редактирование клуба
      result = await updateClub(props.editingClub.id, payload)
    } else {
      // Создание клуба
      result = await createClub(payload)
    }

    // Показываем успех и запускаем таймер закрытия
    showSuccessAndClose()

    // Эмитим событие с данными
    emit('submit', { success: true, data: result, isEdit: !!props.editingClub })

  } catch (error) {
    console.error('Ошибка при сохранении клуба:', error)
    // Эмитим событие с ошибкой
    emit('submit', {
      success: false,
      error: error.message || 'Произошла неизвестная ошибка',
      isEdit: !!props.editingClub
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Стили остаются без изменений */
.success-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem 2rem;
  animation: fadeIn 0.5s ease-in-out;
}

.success-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  animation: bounce 0.6s ease-in-out;
}

.success-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #10b981;
  margin-bottom: 1rem;
}

.success-message {
  font-size: 1.1rem;
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.5;
  max-width: 400px;
}

.success-button {
  background: linear-gradient(135deg, #10b981, #34d399);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.success-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
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
  margin-bottom: 1rem;
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
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 0.75rem;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  font-family: inherit;
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

.form-notes {
  margin-bottom: 1.5rem;
}

.form-notes p {
  font-size: 0.85rem;
  color: #666;
  font-style: italic;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
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

  .success-overlay {
    padding: 2rem 1rem;
  }

  .success-icon {
    font-size: 3rem;
  }

  .success-title {
    font-size: 1.5rem;
  }
}
</style>