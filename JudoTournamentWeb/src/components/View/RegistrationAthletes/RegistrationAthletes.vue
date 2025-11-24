<template>
  <div class="registration_athletes">
    <!-- TOAST УВЕДОМЛЕНИЕ -->
    <transition name="fade">
      <div v-if="toast.visible" class="toast-notification" :class="toast.type">
        <div class="toast-content">
          <span class="toast-icon">{{ toast.type === 'success' ? '✓' : '✕' }}</span>
          <span class="toast-message">{{ toast.message }}</span>
        </div>
      </div>
    </transition>

    <!-- ФОРМЫ РЕГИСТРАЦИИ -->
    <div class="judo_form-athletes_info">
      <section class="athlete-registration">
        <h2>Регистрация участников</h2>

        <!-- Форма добавления спортсмена -->
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

        <!-- Форма регистрации на турнир -->
        <div class="form-section">
          <h3>Зарегистрировать на турнир</h3>
          <form @submit.prevent="registerAthlete">
            <div class="form-grid form-grid-double">
              <div class="form-group">
                <label for="tournament_id">Турнир</label>
                <select v-model="registrationForm.tournament_id" id="tournament_id" required>
                  <option value="">Выберите турнир</option>
                  <option v-for="tournament in tournaments" :key="tournament.id" :value="tournament.id">
                    {{ tournament.name }}
                  </option>
                </select>
                <span v-if="errors.tournament_id" class="error">{{ errors.tournament_id }}</span>
              </div>
              <div class="form-group">
                <label for="athlete_id">Спортсмен</label>
                <select v-model="registrationForm.athlete_id" id="athlete_id" required>
                  <option value="">Выберите спортсмена</option>
                  <option v-for="athlete in athletes" :key="athlete.id" :value="athlete.id">
                    {{ athlete.full_name }}
                  </option>
                </select>
                <span v-if="errors.athlete_id" class="error">{{ errors.athlete_id }}</span>
              </div>
            </div>
            <button type="submit" class="submit-button">Зарегистрировать</button>
          </form>
        </div>

        <!-- Форма взвешивания -->
        <div class="form-section">
          <h3>Взвешивание</h3>
          <form @submit.prevent="weighAthlete">
            <div class="form-grid form-grid-double">
              <div class="form-group">
                <label for="registration_id">Регистрация</label>
                <select v-model="weighingForm.registration_id" id="registration_id" required>
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
                    v-model.number="weighingForm.weight"
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
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { createAthlete, fetchAthletes } from '@/components/View/RegistrationAthletes/fetchRegistrationAthletes'
import "./RegistrationAthletes.css"

// Состояние загрузки
const isLoading = ref(false)

// Toast состояние
const toast = ref({
  visible: false,
  message: '',
  type: 'success' // success | error
})

// Данные для форм
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

const registrationForm = ref({
  tournament_id: null,
  athlete_id: null
})

const weighingForm = ref({
  registration_id: null,
  weight: null
})

const errors = ref({})
const athletes = ref([])
const tournaments = ref([])
const registrations = ref([])

// Универсальная функция показа toast
const showToast = (message, type = 'success', duration = type === 'success' ? 3000 : 4000) => {
  toast.value = { visible: true, message, type }
  setTimeout(() => {
    toast.value.visible = false
  }, duration)
}

// Получение данных
const loadAthletes = async () => {
  try {
    const result = await fetchAthletes()
    if (result.success) {
      athletes.value = result.data
      // Добавляем full_name для отображения в выпадающих списках
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

const fetchTournaments = async () => {
  try {
    const response = await fetch('/api/tournaments', {
      headers: { 'X-API-Key': 'mobile_app_2024' }
    })
    if (!response.ok) throw new Error('Ошибка загрузки турниров')
    tournaments.value = await response.json()
  } catch (error) {
    console.error('Ошибка:', error)
  }
}

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

// Валидация и отправка форм
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

const validateRegistrationForm = () => {
  errors.value = {}
  let isValid = true

  if (!registrationForm.value.tournament_id) {
    errors.value.tournament_id = 'Выберите турнир'
    isValid = false
  }
  if (!registrationForm.value.athlete_id) {
    errors.value.athlete_id = 'Выберите спортсмена'
    isValid = false
  }
  return isValid
}

const validateWeighingForm = () => {
  errors.value = {}
  let isValid = true

  if (!weighingForm.value.registration_id) {
    errors.value.registration_id = 'Выберите регистрацию'
    isValid = false
  }
  if (!weighingForm.value.weight || weighingForm.value.weight <= 0) {
    errors.value.weight = 'Вес должен быть больше 0'
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
      showToast('Спортсмен успешно добавлен!', 'success')

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
    } else {
      showToast(result.error || 'Ошибка при добавлении спортсмена', 'error')
    }

  } catch (error) {
    console.error('Ошибка при создании спортсмена:', error)
    showToast('Ошибка при добавлении спортсмена: ' + error.message, 'error')
  } finally {
    isLoading.value = false
  }
}

const registerAthlete = async () => {
  if (!validateRegistrationForm()) return

  try {
    // Мок запрос для демонстрации
    console.log('Регистрация на турнир:', registrationForm.value)

    showToast('Спортсмен зарегистрирован на турнир!', 'success')
    registrationForm.value = { tournament_id: null, athlete_id: null }
    await fetchRegistrations()
  } catch (error) {
    showToast('Ошибка: ' + error.message, 'error')
  }
}

const weighAthlete = async () => {
  if (!validateWeighingForm()) return

  try {
    // Находим регистрацию для получения tournament_id и athlete_id
    const registration = registrations.value.find(r => r.id === weighingForm.value.registration_id)

    if (!registration) {
      throw new Error('Регистрация не найдена')
    }

    // ПРАВИЛЬНЫЙ payload для бэкенда
    const payload = {
      tournament_id: registration.tournament_id,
      athlete_id: registration.athlete_id,
      weight: weighingForm.value.weight
    }

    console.log('Отправка взвешивания:', payload)

    // Мок ответ для демонстрации
    const mockResponse = {
      category: determineMockCategory(weighingForm.value.weight, registration.athlete_id)
    }

    showToast(`Вес зарегистрирован! Категория: ${mockResponse.category}`, 'success')
    weighingForm.value = { registration_id: null, weight: null }
    await fetchRegistrations()
  } catch (error) {
    showToast('Ошибка: ' + error.message, 'error')
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
  loadAthletes()
  fetchTournaments()
  fetchRegistrations()
})
</script>

<style scoped>
</style>