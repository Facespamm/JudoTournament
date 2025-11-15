<template>
  <div class="judo_athletes">
    <!-- ФОРМЫ РЕГИСТРАЦИИ -->
    <div class="judo_form-athletes_info">
      <section class="athlete-registration">
        <h2>Регистрация участников</h2>

        <!-- Форма добавления спортсмена -->
        <div class="form-section">
          <h3>Добавить спортсмена</h3>
          <form @submit.prevent="createAthlete">
            <div class="form-grid form-grid-multi">
              <div class="form-group">
                <label for="full_name">ФИО</label>
                <input
                    v-model="athleteForm.full_name"
                    type="text"
                    id="full_name"
                    placeholder="Введите ФИО"
                    required
                />
                <span v-if="errors.full_name" class="error">{{ errors.full_name }}</span>
              </div>
              <div class="form-group">
                <label for="gender">Пол</label>
                <select v-model="athleteForm.gender" id="gender" required>
                  <option value="MALE">Мужской</option>
                  <option value="FEMALE">Женский</option>
                </select>
              </div>
              <div class="form-group">
                <label for="date_of_birth">Дата рождения</label>
                <input
                    v-model="athleteForm.date_of_birth"
                    type="date"
                    id="date_of_birth"
                    required
                />
                <span v-if="errors.date_of_birth" class="error">{{ errors.date_of_birth }}</span>
              </div>
              <div class="form-group">
                <label for="region">Регион</label>
                <input
                    v-model="athleteForm.region"
                    type="text"
                    id="region"
                    placeholder="Введите регион"
                    required
                />
                <span v-if="errors.region" class="error">{{ errors.region }}</span>
              </div>
              <div class="form-group">
                <label for="club">Клуб</label>
                <input
                    v-model="athleteForm.club"
                    type="text"
                    id="club"
                    placeholder="Введите клуб"
                />
              </div>
              <div class="form-group">
                <label for="coach">Тренер</label>
                <input
                    v-model="athleteForm.coach"
                    type="text"
                    id="coach"
                    placeholder="Введите тренера"
                />
              </div>
            </div>
            <button type="submit" class="submit-button">Добавить спортсмена</button>
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
import '@/components/View/Athletes/Athletes.css'

// Данные для форм
const athleteForm = ref({
  full_name: '',
  gender: 'MALE',
  date_of_birth: '',
  region: '',
  club: '',
  coach: ''
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

// Получение данных
const fetchAthletes = async () => {
  try {
    const response = await fetch('/api/athletes', {
      headers: { 'X-API-Key': 'mobile_app_2024' }
    })
    if (!response.ok) throw new Error('Ошибка загрузки спортсменов')
    athletes.value = await response.json()
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
    registrations.value = await response.json()
  } catch (error) {
    console.error('Ошибка:', error)
  }
}

// Валидация и отправка форм
const validateAthleteForm = () => {
  errors.value = {}
  let isValid = true

  if (!athleteForm.value.full_name) {
    errors.value.full_name = 'ФИО обязательно'
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

const createAthlete = async () => {
  if (!validateAthleteForm()) return

  try {
    const response = await fetch('/api/athletes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'mobile_app_2024'
      },
      body: JSON.stringify(athleteForm.value)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Неизвестная ошибка')
    }

    alert('Спортсмен добавлен!')
    athleteForm.value = { full_name: '', gender: 'MALE', date_of_birth: '', region: '', club: '', coach: '' }
    await fetchAthletes()
  } catch (error) {
    alert('Ошибка: ' + error.message)
  }
}

const registerAthlete = async () => {
  if (!validateRegistrationForm()) return

  try {
    const response = await fetch(`/api/tournaments/${registrationForm.value.tournament_id}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'mobile_app_2024'
      },
      body: JSON.stringify({ athlete_id: registrationForm.value.athlete_id })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Неизвестная ошибка')
    }

    alert('Спортсмен зарегистрирован!')
    registrationForm.value = { tournament_id: null, athlete_id: null }
    await fetchRegistrations()
  } catch (error) {
    alert('Ошибка: ' + error.message)
  }
}

const weighAthlete = async () => {
  if (!validateWeighingForm()) return

  try {
    const response = await fetch(`/api/registrations/${weighingForm.value.registration_id}/weigh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'mobile_app_2024'
      },
      body: JSON.stringify({ weight: weighingForm.value.weight })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Неизвестная ошибка')
    }

    const data = await response.json()
    alert(`Вес зарегистрирован! Категория: ${data.category}`)
    weighingForm.value = { registration_id: null, weight: null }
    await fetchRegistrations()
    await fetchAthletes()
  } catch (error) {
    alert('Ошибка: ' + error.message)
  }
}

onMounted(() => {
  fetchAthletes()
  fetchTournaments()
  fetchRegistrations()
})
</script>

<style scoped>
.judo_athletes {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(to bottom, #fefefe, #f8f9fa);
  font-family: 'Inter', 'Segoe UI', sans-serif;
  color: #1a1a1a;
  padding: 4rem 0;
  margin: 0;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.judo_form-athletes_info {
  max-width: 1600px; /* Сохранена широкая форма */
  width: 95%;
  margin: 0 auto;
  padding: 0 3rem;
}

.athlete-registration {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin: 0;
}

.athlete-registration h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  text-align: center;
  margin-bottom: 2rem;
  letter-spacing: -0.02em;
}

.form-section {
  margin-bottom: 3rem;
  border-bottom: 1px solid #e8e8e8;
  padding-bottom: 2rem;
}

.form-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.form-section h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
}

.form-grid {
  display: grid;
  gap: 2rem;
}

.form-grid-multi {
  grid-template-columns: repeat(3, 1fr);
}

.form-grid-double {
  grid-template-columns: repeat(2, 1fr);
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 0.95rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group select {
  padding: 0.9rem 1.2rem;
  border: 2px solid #e8e8e8;
  border-radius: 10px;
  font-size: 1rem;
  color: #333;
  background: #fafafa;
  transition: all 0.2s ease;
  width: 100%;
  box-sizing: border-box;
}

.form-group select {
  max-width: 300px; /* Ограничение максимальной ширины для дропдаунов */
  width: auto; /* Автоматическая ширина на основе содержимого */
  min-width: 200px; /* Минимальная ширина для читаемости */
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #c89b3c;
  background: white;
  box-shadow: 0 0 0 3px rgba(200, 155, 60, 0.1);
}

.form-group input::placeholder {
  color: #999;
}

.form-group .error {
  color: #d32f2f;
  font-size: 0.85rem;
  margin-top: 0.3rem;
}

.submit-button {
  background: linear-gradient(135deg, #c89b3c, #e0b456);
  color: white;
  padding: 0.9rem 2.5rem;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: block;
  width: fit-content;
  margin: 2rem auto 0;
}

.submit-button:hover {
  background: linear-gradient(135deg, #e0b456, #c89b3c);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(200, 155, 60, 0.3);
}

.submit-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(200, 155, 60, 0.2);
}

/* Адаптивность */
@media (max-width: 1400px) {
  .judo_form-athletes_info {
    max-width: 1300px;
  }

  .form-grid-multi {
    grid-template-columns: repeat(2, 1fr);
  }

  .form-grid-double {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .judo_athletes {
    padding: 2rem 0;
  }

  .judo_form-athletes_info {
    padding: 0 1rem;
    width: 95%;
  }

  .athlete-registration {
    padding: 1.5rem;
    border-radius: 16px;
  }

  .athlete-registration h2 {
    font-size: 1.6rem;
  }

  .form-section h3 {
    font-size: 1.3rem;
  }

  .form-grid-multi {
    grid-template-columns: 1fr;
  }

  .form-group select {
    max-width: 100%; /* Полная ширина на мобильных */
    min-width: 0; /* Удаление минимальной ширины на мобильных */
  }

  .submit-button {
    width: 100%;
    padding: 0.85rem;
  }
}

@media (max-width: 480px) {
  .judo_athletes {
    padding: 1.5rem 0;
  }

  .athlete-registration {
    padding: 1rem;
  }

  .athlete-registration h2 {
    font-size: 1.4rem;
  }

  .form-section h3 {
    font-size: 1.15rem;
  }

  .form-group input,
  .form-group select {
    font-size: 0.95rem;
    padding: 0.8rem;
  }

  .submit-button {
    font-size: 0.95rem;
  }
}
</style>