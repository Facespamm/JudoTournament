<template>
  <div class="clubs-view">
    <!-- ЗАГОЛОВОК -->
    <div class="view-header">
      <h1>{{ t('clubsPage.title') }}</h1>
      <p>{{ t('clubsPage.subtitle') }}</p>
    </div>

    <!-- ПОИСК И ФИЛЬТРЫ -->
    <div class="view-filters">
      <input
          v-model="searchQuery"
          type="search"
          :placeholder="t('clubsPage.searchPlaceholder')"
          class="search-input"
      />
      <select v-model="cityFilter" class="filter-select">
        <option value="">{{ t('clubsPage.allCities') }}</option>
        <option value="Астана">{{ t('clubsPage.cityAstana') }}</option>
        <option value="Алматы">{{ t('clubsPage.cityAlmaty') }}</option>
        <option value="Шымкент">{{ t('clubsPage.cityShymkent') }}</option>
        <option value="Актобе">{{ t('clubsPage.cityAktobe') }}</option>
        <option value="Караганда">{{ t('clubsPage.cityKaraganda') }}</option>
      </select>
    </div>

    <!-- СПИСОК КЛУБОВ -->
    <div class="clubs-grid">
      <div
          v-for="club in filteredClubs"
          :key="club.id"
          class="club-card"
      >
        <div class="club-main">
          <h3 class="club-name">{{ club.name || t('clubsPage.unnamed') }}</h3>
          <p v-if="club.short_name" class="club-short">{{ club.short_name }}</p>
        </div>

        <div class="club-info">
          <div class="info-item">
            <span class="label">{{ t('clubsPage.city') }}</span>
            <span class="value">{{ club.city || '—' }}</span>
          </div>
          <div class="info-item">
            <span class="label">{{ t('clubsPage.coach') }}</span>
            <span class="value">{{ club.coach_name || t('clubsPage.notSpecified') }}</span>
          </div>
          <div class="info-item">
            <span class="label">{{ t('clubsPage.athletes') }}</span>
            <span class="value athletes-count">{{ club.athletes_count ?? 0 }}</span>
          </div>
        </div>
      </div>

      <!-- Пустое состояние -->
      <div v-if="filteredClubs.length === 0" class="no-data">
        <div class="no-data-icon">🥋</div>
        <p>{{ t('clubsPage.emptyTitle') }}</p>
        <small v-if="searchQuery || cityFilter">
          {{ t('clubsPage.emptyHint') }}
        </small>
        <small v-else-if="loading">
          {{ t('clubsPage.loading') }}
        </small>
        <small v-else-if="error">
          {{ t('clubsPage.loadFailed') }}
        </small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import {fetchClubs} from "@/components/View/Authentication/SelectRoleView/fetchGetInformation.js";
import { useI18n } from '@/i18n'
import "./Clubs.css"

const { t } = useI18n()
const clubs = ref([])
const searchQuery = ref('')
const cityFilter = ref('')
const loading = ref(false)
const error = ref(null)

// Фильтрация
const filteredClubs = computed(() => {
  if (!Array.isArray(clubs.value)) return []

  const query = searchQuery.value.trim().toLowerCase()

  return clubs.value.filter(club => {
    const nameMatch    = club.name?.toLowerCase().includes(query)      ?? false
    const shortNameMatch = club.short_name?.toLowerCase().includes(query) ?? false
    const coachMatch   = club.coach_name?.toLowerCase().includes(query) ?? false

    const searchMatch = nameMatch || shortNameMatch || coachMatch
    const cityMatch = !cityFilter.value || club.city === cityFilter.value

    return searchMatch && cityMatch
  })
})

// Загрузка клубов
const loadClubs = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await fetch('api/clubs/', {
      headers: { 'X-API-Key': 'mobile_app_2024' }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()

    let fetchedClubs = []
    if (data && Array.isArray(data.clubs)) {
      fetchedClubs = data.clubs
    } else if (data && Array.isArray(data)) {
      fetchedClubs = data
    }

    clubs.value = fetchedClubs

  } catch (err) {
    console.error('Ошибка загрузки клубов:', err)
    error.value = err.message
    clubs.value = []
  } finally {
    loading.value = false
  }
}

onMounted(loadClubs)
</script>

<style scoped>
/* Ваш стиль остаётся без изменений */
</style>
