<template>
  <div class="judo-tournament">
    <!-- ФИЛЬТРЫ -->
    <div class="judo-tournament-setting_search">
      <select class="judo-tournament-setting_search_select_category" name="tournament_filter_category">
        <option value="all">Категория турнира</option>
        <option value="continental">Континентальные</option>
        <option value="national">Национальные</option>
        <option value="regional">Региональные</option>
      </select>
      <select class="judo-tournament-setting_select_age_group" name="tournament_age_group">
        <option value="all">Возрастная группа</option>
        <option value="cadets">Кадеты (15-17 лет)</option>
        <option value="juniors">Юниоры (18-20 лет)</option>
        <option value="seniors">Взрослые (21+ лет)</option>
      </select>
      <select class="judo-tournament-setting_date" name="tournament_date">
        <option value="all">Год проведения</option>
        <option value="2025">2025</option>
        <option value="2024">2024</option>
        <option value="2023">2023</option>
      </select>
      <input type="search" name="tournament_search" placeholder="Поиск турниров" class="search-input" />
      <button class="judo-tournament_button_create" @click="openCreateModal">Создать турнир</button>
    </div>

    <!-- СПИСОК ТУРНИРОВ -->
    <div class="judo-tournament_info">
      <section class="judo-tournament-list">
        <h2>Ближайшие турниры</h2>
        <div class="tournament-cards-container">
          <!-- Примеры с разными статусами -->
          <article class="judo-tournament-card" @click="navigateToDetails('champ-kz-cadets-2025')">
            <div class="judo-tournament_card_info">
              <div class="tournament-header">
                <span class="tournament-date-badge">17 марта 2025</span>
                <span class="tournament-status-badge status-planned">PLANNED</span>
              </div>
              <h3 class="judo-tournament_card_name">Чемпионат Казахстана среди кадетов</h3>
              <p class="judo-tournament_card_location">Астана, Казахстан</p>
              <div class="tournament-stats">
                <span class="stat-item">14 регионов</span>
                <span class="stat-divider">•</span>
                <span class="stat-item">125 дзюдоистов</span>
              </div>
            </div>
          </article>

          <article class="judo-tournament-card featured" @click="navigateToDetails('grand-prix-kz-2025')">
            <div class="featured-badge">Главный турнир</div>
            <div class="judo-tournament_card_info">
              <div class="tournament-header">
                <span class="tournament-date-badge">10–12 мая 2025</span>
                <span class="tournament-status-badge status-live">LIVE</span>
              </div>
              <h3 class="judo-tournament_card_name">Гран-при Казахстана 2025</h3>
              <p class="judo-tournament_card_location">Астана, Казахстан</p>
              <div class="tournament-stats">
                <span class="stat-item">17 регионов</span>
                <span class="stat-divider">•</span>
                <span class="stat-item">240 дзюдоистов</span>
              </div>
            </div>
          </article>

          <article class="judo-tournament-card" @click="navigateToDetails('cup-astana-2024')">
            <div class="judo-tournament_card_info">
              <div class="tournament-header">
                <span class="tournament-date-badge">15 ноября 2024</span>
                <span class="tournament-status-badge status-completed">COMPLETED</span>
              </div>
              <h3 class="judo-tournament_card_name">Кубок Астаны 2024</h3>
              <p class="judo-tournament_card_location">Астана, Казахстан</p>
              <div class="tournament-stats">
                <span class="stat-item">12 регионов</span>
                <span class="stat-divider">•</span>
                <span class="stat-item">180 дзюдоистов</span>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>

    <!-- ПАГИНАЦИЯ -->
    <div class="judo-tournament_button_pagination">
      <button type="button" class="judo-tournament_button_pagination_next">
        Показать ещё турниры
      </button>
    </div>

    <!-- МОДАЛЬНОЕ ОКНО СОЗДАНИЯ -->
    <div v-if="isCreateModalOpen" class="modal-overlay" @click.self="closeCreateModal">
      <div class="modal-content">
        <h2>Создать новый турнир</h2>
        <form @submit.prevent="createTournament">
          <div class="form-grid">
            <div class="form-group">
              <label for="name">Название турнира</label>
              <input v-model="form.name" type="text" id="name" placeholder="Введите название" required />
              <span v-if="errors.name" class="error">{{ errors.name }}</span>
            </div>
            <div class="form-group">
              <label for="description">Описание</label>
              <textarea v-model="form.description" id="description" placeholder="Введите описание турнира"></textarea>
            </div>
            <div class="form-group">
              <label for="start_date">Дата начала</label>
              <input v-model="form.start_date" type="date" id="start_date" required />
              <span v-if="errors.start_date" class="error">{{ errors.start_date }}</span>
            </div>
            <div class="form-group">
              <label for="end_date">Дата окончания</label>
              <input v-model="form.end_date" type="date" id="end_date" required />
              <span v-if="errors.end_date" class="error">{{ errors.end_date }}</span>
            </div>
            <div class="form-group">
              <label for="venue">Место проведения</label>
              <input v-model="form.venue" type="text" id="venue" placeholder="Введите место" required />
              <span v-if="errors.venue" class="error">{{ errors.venue }}</span>
            </div>
            <div class="form-group">
              <label for="city">Город</label>
              <input v-model="form.city" type="text" id="city" placeholder="Введите город" />
            </div>
            <div class="form-group">
              <label for="country">Страна</label>
              <input v-model="form.country" type="text" id="country" value="Казахстан" />
            </div>
            <div class="form-group">
              <label for="tatami_count">Количество татами</label>
              <input v-model.number="form.tatami_count" type="number" id="tatami_count" min="1" required />
            </div>
            <div class="form-group">
              <label for="fight_duration">Длительность схватки (сек)</label>
              <input v-model.number="form.fight_duration" type="number" id="fight_duration" min="60" required />
            </div>
            <div class="form-group">
              <label for="golden_score_duration">Длительность золотого скора (сек)</label>
              <input v-model.number="form.golden_score_duration" type="number" id="golden_score_duration" min="60" />
            </div>
            <div class="form-group">
              <label for="organizer">Организатор</label>
              <input v-model="form.organizer" type="text" id="organizer" placeholder="Введите организатора" />
            </div>
            <div class="form-group">
              <label for="min_athletes_per_category">Мин. участников в категории</label>
              <input v-model.number="form.min_athletes_per_category" type="number" id="min_athletes_per_category" min="2" />
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" class="modal-button cancel" @click="closeCreateModal">Отмена</button>
            <button type="submit" class="modal-button submit">Создать</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const isCreateModalOpen = ref(false)
const form = ref({
  name: '',
  description: '',
  start_date: '',
  end_date: '',
  venue: '',
  city: '',
  country: 'Казахстан',
  tatami_count: 1,
  fight_duration: 300,
  golden_score_duration: 180,
  organizer: '',
  min_athletes_per_category: 2,
  status: 'PLANNED'
})
const errors = ref({})

const openCreateModal = () => {
  isCreateModalOpen.value = true
  form.value = { ...form.value, name: '', description: '', start_date: '', end_date: '', venue: '', city: '', organizer: '' }
  errors.value = {}
}

const closeCreateModal = () => {
  isCreateModalOpen.value = false
}

const validateForm = () => {
  errors.value = {}
  let isValid = true
  if (!form.value.name) { errors.value.name = 'Название обязательно'; isValid = false }
  if (!form.value.start_date) { errors.value.start_date = 'Дата начала обязательна'; isValid = false }
  if (!form.value.end_date) { errors.value.end_date = 'Дата окончания обязательна'; isValid = false }
  if (form.value.start_date > form.value.end_date) { errors.value.end_date = 'Дата окончания не может быть раньше начала'; isValid = false }
  if (!form.value.venue) { errors.value.venue = 'Место проведения обязательно'; isValid = false }
  if (form.value.tatami_count < 1) { errors.value.tatami_count = 'Минимум 1 татами'; isValid = false }
  if (form.value.fight_duration < 60) { errors.value.fight_duration = 'Минимум 60 секунд'; isValid = false }
  return isValid
}

const createTournament = async () => {
  if (!validateForm()) return

  const payload = {
    name: form.value.name,
    description: form.value.description || undefined,
    start_date: form.value.start_date,
    end_date: form.value.end_date,
    location: [form.value.venue, form.value.city, form.value.country].filter(Boolean).join(', '),
    organizer: form.value.organizer || undefined,
    tatami_count: form.value.tatami_count,
    fight_duration: form.value.fight_duration,
    golden_score_duration: form.value.golden_score_duration || undefined,
    min_athletes_per_category: form.value.min_athletes_per_category || undefined,
    status: form.value.status
  }

  try {
    const response = await fetch('/api/tournaments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'mobile_app_2024'
      },
      body: JSON.stringify(payload)
    })
    if (!response.ok) throw new Error((await response.json()).error || 'Ошибка сервера')
    alert('Турнир успешно создан!')
    closeCreateModal()
  } catch (error) {
    alert('Ошибка: ' + error.message)
  }
}

const navigateToDetails = (id) => {
  router.push({ name: 'tournamentdetails', params: { id } })
}
</script>

<style scoped src="./Tournaments.css"></style>