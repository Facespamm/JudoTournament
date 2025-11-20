<template>
  <div class="clubs-management">
    <!-- ЗАГОЛОВОК -->
    <div class="management-header">
      <h1>Управление клубами</h1>
      <p>Регистрация и редактирование клубов дзюдо</p>
    </div>

    <!-- ПОИСК И ФИЛЬТРЫ -->
    <div class="management-filters">
      <input
          v-model="searchQuery"
          type="search"
          placeholder="Поиск клубов..."
          class="search-input"
      />
      <select v-model="cityFilter" class="filter-select">
        <option value="">Все города</option>
        <option value="Астана">Астана</option>
        <option value="Алматы">Алматы</option>
        <option value="Шымкент">Шымкент</option>
        <option value="Актобе">Актобе</option>
        <option value="Караганда">Караганда</option>
      </select>
      <button class="add-button" @click="openCreateModal">
        + Добавить клуб
      </button>
    </div>

    <!-- ТАБЛИЦА КЛУБОВ -->
    <div class="clubs-table">
      <div class="table-header">
        <div class="table-cell">Название</div>
        <div class="table-cell">Город</div>
        <div class="table-cell">Тренер</div>
        <div class="table-cell">Участников</div>
        <div class="table-cell">Контакты</div>
        <div class="table-cell">Действия</div>
      </div>

      <div
          v-for="club in filteredClubs"
          :key="club.id"
          class="table-row"
      >
        <div class="table-cell">
          <strong>{{ club.name }}</strong>
          <div v-if="club.short_name" class="short-name">
            {{ club.short_name }}
          </div>
        </div>
        <div class="table-cell">
          {{ club.city }}
          <div class="country">{{ club.country }}</div>
        </div>
        <div class="table-cell">
          {{ club.coach_name || 'Не указан' }}
        </div>
        <div class="table-cell">
          <span class="athletes-count">{{ club.athletes_count || 0 }}</span>
        </div>
        <div class="table-cell contacts">
          <div v-if="club.phone" class="contact-item">
            📞 {{ club.phone }}
          </div>
          <div v-if="club.email" class="contact-item">
            ✉️ {{ club.email }}
          </div>
          <div v-if="club.website" class="contact-item">
            🌐 {{ club.website }}
          </div>
        </div>
        <div class="table-cell actions">
          <button class="edit-btn" @click="editClub(club)" title="Редактировать">
            ✏️
          </button>
          <button class="delete-btn" @click="deleteClub(club.id)" title="Удалить">
            🗑️
          </button>
        </div>
      </div>

      <div v-if="filteredClubs.length === 0" class="no-data">
        <div class="no-data-icon">🏢</div>
        <p>Клубы не найдены</p>
        <button class="create-first-btn" @click="openCreateModal">
          Создать первый клуб
        </button>
      </div>
    </div>

    <!-- МОДАЛКА СОЗДАНИЯ/РЕДАКТИРОВАНИЯ КЛУБА -->
    <ClubModal
        :is-open="isModalOpen"
        :editing-club="editingClub"
        @close="closeModal"
        @submit="handleClubSubmission"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import ClubModal from '@/components/View/Clubs/ClubModal.vue'

// Данные клубов
const clubs = ref([])
const searchQuery = ref('')
const cityFilter = ref('')

// Модалки
const isModalOpen = ref(false)
const editingClub = ref(null)

// Фильтрация клубов
const filteredClubs = computed(() => {
  return clubs.value.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        (club.short_name && club.short_name.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
        (club.coach_name && club.coach_name.toLowerCase().includes(searchQuery.value.toLowerCase()))

    const matchesCity = !cityFilter.value || club.city === cityFilter.value

    return matchesSearch && matchesCity
  })
})

// Загрузка данных
const loadClubs = async () => {
  try {
    const response = await fetch('http://127.0.0.1:5000/api/clubs/', {
      headers: { 'X-API-Key': 'mobile_app_2024' }
    })

    if (response.ok) {
      const data = await response.json()
      clubs.value = data.clubs || data || []
    } else {
      // Мок данные для демонстрации
      clubs.value = [
        {
          id: 1,
          name: 'Динамо Алматы',
          short_name: 'Динамо',
          city: 'Алматы',
          country: 'Казахстан',
          coach_name: 'Иван Петров',
          phone: '+7 (777) 123-45-67',
          email: 'dinamo.almaty@mail.ru',
          website: 'https://dinamo-almaty.kz',
          address: 'ул. Абая, 123',
          athletes_count: 25,
          founded_year: 1995
        },
        {
          id: 2,
          name: 'Президентский клуб',
          short_name: 'Президентский',
          city: 'Астана',
          country: 'Казахстан',
          coach_name: 'Мария Сидорова',
          phone: '+7 (717) 234-56-78',
          email: 'president.club@mail.ru',
          athletes_count: 18,
          founded_year: 2010
        }
      ]
    }
  } catch (error) {
    console.error('Ошибка загрузки клубов:', error)
    // Мок данные при ошибке
    clubs.value = [
      {
        id: 1,
        name: 'Динамо Алматы',
        short_name: 'Динамо',
        city: 'Алматы',
        country: 'Казахстан',
        coach_name: 'Иван Петров',
        phone: '+7 (777) 123-45-67',
        email: 'dinamo.almaty@mail.ru',
        website: 'https://dinamo-almaty.kz',
        address: 'ул. Абая, 123',
        athletes_count: 25,
        founded_year: 1995
      }
    ]
  }
}

// Управление модалками
const openCreateModal = () => {
  isModalOpen.value = true
  editingClub.value = null
}

const closeModal = () => {
  isModalOpen.value = false
}

const editClub = (club) => {
  isModalOpen.value = true
  editingClub.value = club
}

// Обработка сохранения клуба
const handleClubSubmission = (result) => {
  if (result.success) {
    // Успешное сохранение - перезагружаем список
    loadClubs()
    // Модалка закроется автоматически через 3 секунды
  } else {
    alert('Ошибка: ' + result.error)
  }
}

// Удаление клуба
const deleteClub = async (clubId) => {
  if (!confirm('Вы уверены, что хотите удалить клуб? Все связанные данные будут потеряны.')) {
    return
  }

  try {
    const response = await fetch(`http://127.0.0.1:5000/api/clubs/${clubId}`, {
      method: 'DELETE',
      headers: { 'X-API-Key': 'mobile_app_2024' }
    })

    if (!response.ok) throw new Error('Ошибка удаления клуба')

    alert('Клуб успешно удален!')
    loadClubs()
  } catch (error) {
    alert('Ошибка: ' + error.message)
  }
}

onMounted(() => {
  loadClubs()
})
</script>

<style scoped>
/* Стили остаются без изменений */
.clubs-management {
  padding: 90px 2rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
}

.management-header {
  text-align: center;
  margin-bottom: 3rem;
}

.management-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.management-header p {
  font-size: 1.1rem;
  color: #666;
}

.management-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  align-items: center;
}

.search-input {
  flex: 1;
  min-width: 250px;
  padding: 0.75rem 1rem;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #c89b3c;
}

.filter-select {
  padding: 0.75rem;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  min-width: 150px;
  background: white;
  cursor: pointer;
}

.add-button {
  background: linear-gradient(135deg, #c89b3c, #e0b456);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.add-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(200, 155, 60, 0.3);
}

/* Таблица клубов */
.clubs-table {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr 1fr 2fr 100px;
  background: #f8f9fa;
  padding: 1.2rem 1rem;
  font-weight: 700;
  color: #1a1a1a;
  border-bottom: 2px solid #e8e8e8;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr 1fr 2fr 100px;
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
  align-items: start;
  transition: background-color 0.3s ease;
}

.table-row:hover {
  background: #f8f9fa;
}

.table-cell {
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.short-name {
  font-size: 0.85rem;
  color: #666;
  font-style: italic;
}

.country {
  font-size: 0.8rem;
  color: #888;
}

.athletes-count {
  background: linear-gradient(135deg, #c89b3c, #e0b456);
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.85rem;
  width: fit-content;
}

.contacts {
  gap: 0.5rem;
}

.contact-item {
  font-size: 0.85rem;
  color: #555;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
  flex-direction: row;
}

.edit-btn, .delete-btn {
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-btn {
  background: #e3f2fd;
  color: #1976d2;
}

.edit-btn:hover {
  background: #bbdefb;
  transform: scale(1.1);
}

.delete-btn {
  background: #ffebee;
  color: #d32f2f;
}

.delete-btn:hover {
  background: #ffcdd2;
  transform: scale(1.1);
}

.no-data {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
}

.no-data-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.no-data p {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
}

.create-first-btn {
  background: linear-gradient(135deg, #c89b3c, #e0b456);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.create-first-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(200, 155, 60, 0.3);
}

/* Адаптив */
@media (max-width: 768px) {
  .clubs-management {
    padding: 80px 1rem 1rem;
  }

  .management-filters {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input,
  .filter-select {
    min-width: auto;
  }

  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .table-cell:before {
    content: attr(data-label);
    font-weight: 700;
    display: block;
    margin-bottom: 0.25rem;
    color: #666;
  }

  .actions {
    flex-direction: row;
    justify-content: flex-start;
  }
}

@media (max-width: 480px) {
  .management-header h1 {
    font-size: 2rem;
  }

  .table-cell {
    font-size: 0.9rem;
  }

  .contact-item {
    font-size: 0.8rem;
  }
}
</style>