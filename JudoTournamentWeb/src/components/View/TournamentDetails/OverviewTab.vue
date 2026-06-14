<template>
  <div class="overview-wrapper">
    <section class="tournament-main-info">
      <div class="tournament-info">
        <!-- Заголовок + кнопка Документ -->
        <div class="tournament-header">
          <h1>{{ tournament?.name || t('tournamentDetails.tournamentNameFallback') }}</h1>
          <button
              class="document-btn"
              @click="downloadDocument"
              :title="t('tournamentDetails.documentTitle')"
          >
            {{ t('tournamentDetails.document') }}
          </button>
        </div>

        <p class="tournament-description">{{ tournament?.description || t('tournamentDetails.descriptionMissing') }}</p>

        <div class="tournament-meta">
          <div class="meta-item">
            <span class="meta-label">{{ t('tournamentDetails.dateLabel') }}</span>
            <span class="meta-value">{{ formatDate(tournament?.start_date, tournament?.end_date) }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">{{ t('tournamentDetails.locationLabel') }}</span>
            <span class="meta-value">{{ getLocation(tournament) }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">{{ t('tournamentDetails.statusLabel') }}</span>
            <span class="meta-value status-badge" :class="getStatusClass(tournament?.status)">
              {{ getStatusText(tournament?.status) }}
            </span>
          </div>
          <div class="meta-item">
            <span class="meta-label">{{ t('tournamentDetails.athletesCountLabel') }}</span>
            <span class="meta-value">{{ tournament?.athletes_count || 0 }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">{{ t('tournamentDetails.tatamiCountLabel') }}</span>
            <span class="meta-value">{{ tournament?.tatami_count || 0 }}</span>
          </div>
          <div v-if="tournament?.progress_percentage > 0" class="meta-item">
            <span class="meta-label">{{ t('tournamentDetails.progressLabel') }}</span>
            <span class="meta-value">{{ t('tournamentDetails.progressValue', { count: tournament?.progress_percentage }) }}</span>
          </div>
        </div>

        <div class="overview-categories">
          <h2>{{ t('tournamentDetails.categoriesTitle') }}</h2>

          <div v-if="isLoadingCategories" class="categories-state">
            {{ t('tournamentDetails.loadingCategories') }}
          </div>
          <div v-else-if="!categories.length" class="categories-state">
            {{ t('tournamentDetails.noCategories') }}
          </div>
          <div v-else class="overview-categories-list">
            <span
                v-for="category in categories"
                :key="category.id"
                class="overview-category-chip"
            >
              {{ getCategoryName(category) }}
            </span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { inject, computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { fetchGetDocument } from "@/components/View/Brackets/fetchBrackets.js"
import { fetchGetCategoryByTournament } from "@/components/View/Brackets/fetchBrackets.js"
import { useI18n } from '@/i18n'

const tournament = inject('tournament')
const route = useRoute()
const { locale, t } = useI18n()
const dateLocale = computed(() => ({ ru: 'ru-RU', en: 'en-US', kk: 'kk-KZ' })[locale.value] ?? 'ru-RU')
const categories = ref([])
const isLoadingCategories = ref(false)

// Надёжное получение ID турнира
const tournamentId = computed(() => {
  if (tournament?.id) return Number(tournament.id)
  if (tournament?.tournament_id) return Number(tournament.tournament_id)
  return Number(route.params.id)
})

const formatDate = (startDate, endDate) => {
  if (!startDate) return t('tournamentDetails.dateMissing')
  const start = new Date(startDate)
  const end = new Date(endDate || startDate)
  if (startDate === endDate) return start.toLocaleDateString(dateLocale.value)
  return `${start.toLocaleDateString(dateLocale.value)} – ${end.toLocaleDateString(dateLocale.value)}`
}

const getLocation = (t) => {
  if (!t) return t('tournamentDetails.locationMissing')
  const parts = []
  if (t.venue && t.venue !== 'string') parts.push(t.venue)
  if (t.city && t.city !== 'string') parts.push(t.city)
  if (t.country && t.country !== 'string') parts.push(t.country)
  return parts.join(', ') || t('tournamentDetails.locationMissing')
}

const getStatusClass = (status) => {
  const map = {
    'LIVE': 'status-live',
    'PLANNED': 'status-planned',
    'COMPLETED': 'status-completed',
    'REGISTRATION': 'status-registration',
    'WEIGHING': 'status-weighing',
    'BRACKETS': 'status-brackets'
  }
  return map[status] || 'status-planned'
}

const getStatusText = (status) => {
  const map = {
    'LIVE': 'LIVE',
    'PLANNED': t('tournamentDetails.statusPlanned'),
    'COMPLETED': t('tournamentDetails.statusCompleted'),
    'REGISTRATION': t('tournamentDetails.statusRegistration'),
    'WEIGHING': t('tournamentDetails.statusWeighing'),
    'BRACKETS': t('tournamentDetails.statusBrackets')
  }
  return map[status] || status
}

const getCategoryName = (category) => {
  return category?.name || t('tournamentDetails.categoryFallback', { id: category?.id })
}

const loadCategories = async () => {
  const id = tournamentId.value
  if (!id || isNaN(id)) return

  isLoadingCategories.value = true
  try {
    const data = await fetchGetCategoryByTournament(id)
    categories.value = Array.isArray(data) ? data : data?.categories || data?.data?.categories || []
  } catch (error) {
    console.error('Ошибка загрузки категорий турнира:', error)
    categories.value = []
  } finally {
    isLoadingCategories.value = false
  }
}

// Функция скачивания PDF турнира
const downloadDocument = async () => {
  const id = tournamentId.value

  if (!id || isNaN(id)) {
    console.error('❌ Не удалось определить ID турнира', { tournament, routeParams: route.params })
    alert(t('tournamentDetails.documentIdError'))
    return
  }

  try {
    const blob = await fetchGetDocument(id)

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${t('tournamentDetails.protocolFileName')}_${(tournament?.name || t('tournamentDetails.tournamentFileFallback')).replace(/\s+/g, '_')}_${id}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    console.log(`✅ PDF турнира ${id} успешно скачан`)
  } catch (error) {
    console.error('❌ Ошибка при скачивании PDF турнира:', error)
    alert(t('tournamentDetails.documentDownloadError'))
  }
}

onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
.overview-wrapper { padding: 0 1rem; }

.tournament-main-info {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.tournament-info { text-align: center; }

.tournament-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}

.tournament-info h1 {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  color: #1a1a1a;
}

.tournament-description {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  max-width: 85%;
  margin-left: auto;
  margin-right: auto;
}

.tournament-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.meta-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.meta-label { font-weight: 500; color: #666; }
.meta-value { font-weight: 600; color: #333; }

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-planned { background: #e3f2fd; color: #1976d2; }
.status-live { background: #fbe9e7; color: #d32f2f; }
.status-completed { background: #e8f5e8; color: #2e7d32; }
.status-registration { background: #fff3e0; color: #f57c00; }
.status-weighing { background: #f3e5f5; color: #7b1fa2; }
.status-brackets { background: #e8eaf6; color: #303f9f; }

.overview-categories {
  margin-top: 1.75rem;
  text-align: left;
}

.overview-categories h2 {
  margin: 0 0 1rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a1a1a;
}

.categories-state {
  padding: 0.9rem 1rem;
  border-radius: 8px;
  background: #f8f9fa;
  color: #666;
  font-weight: 500;
}

.overview-categories-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.overview-category-chip {
  display: inline-flex;
  align-items: center;
  min-height: 38px;
  max-width: 100%;
  padding: 0.55rem 0.85rem;
  border-radius: 8px;
  background: #f8f9fa;
  color: #333;
  font-weight: 600;
  line-height: 1.25;
  word-break: break-word;
}

.document-btn {
  padding: 0.55rem 1.6rem;
  border-radius: 50px;
  background: #c89b3c;
  color: #fff;
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(200, 155, 60, 0.3);
}

.document-btn:hover:not(:disabled) {
  background: #d4aa5a;
  transform: translateY(-1px);
}

.document-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .tournament-header { justify-content: center; }
  .tournament-meta { grid-template-columns: 1fr; }
}
</style>
