<template>
  <div class="brackets-view">
    <h3>Созданные сетки</h3>

    <div class="view-controls">
      <div class="filter-group">
        <label for="tournament_filter">Фильтр по турниру:</label>
        <select v-model="tournamentFilter" id="tournament_filter">
          <option :value="null">Все турниры</option>
          <option v-for="t in tournaments" :key="t.id" :value="t.id">
            {{ t.name }}
          </option>
        </select>
      </div>

      <div class="search-group">
        <input
            v-model="searchQuery"
            placeholder="Поиск по названию сетки..."
            class="search-input"
        />
      </div>
    </div>

    <div v-if="loading" class="loading">Загрузка сеток...</div>

    <div v-else-if="filteredBrackets.length" class="brackets-grid">
      <div
          v-for="b in filteredBrackets"
          :key="b.id"
          class="bracket-card"
          @click="viewBracket(b.id)"
      >
        <div class="bracket-header">
          <div class="bracket-name">{{ b.name }}</div>
          <div class="bracket-status" :class="getStatusClass(b.status)">
            {{ getStatusText(b.status) }}
          </div>
        </div>

        <div class="bracket-tournament">
          {{ getTournamentName(b.tournament_id) }}
        </div>

        <div class="bracket-progress">
          <div class="progress-bar">
            <div
                class="progress-fill"
                :style="{ width: b.progress_percentage + '%' }"
            ></div>
          </div>
          <span class="progress-text">{{ b.progress_percentage }}% завершено</span>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">Трофей</div>
      <h4>Сетки не найдены</h4>
      <p>Создайте первую сетку или измените параметры фильтра</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchBrackets } from "@/components/View/Brackets/fetchBrackets.js"

const props = defineProps({
  tournaments: { type: Array, default: () => [] }
})

const router = useRouter()
const brackets = ref([])
const loading = ref(true)
const tournamentFilter = ref(null)
const searchQuery = ref('')

onMounted(async () => {
  const result = await fetchBrackets()
  if (result.success) {
    brackets.value = result.brackets
  }
  loading.value = false
})

const filteredBrackets = computed(() => {
  return brackets.value.filter(b => {
    const matchTournament = tournamentFilter.value === null || b.tournament_id === tournamentFilter.value
    const q = searchQuery.value.trim().toLowerCase()
    const matchSearch = !q ||
        b.name.toLowerCase().includes(q) ||
        getTournamentName(b.tournament_id).toLowerCase().includes(q)
    return matchTournament && matchSearch
  })
})

const getTournamentName = (id) => props.tournaments.find(t => t.id === id)?.name || '—'

const getStatusClass = (s) => ({
  GENERATED: 'status-active',
  DRAFT: 'status-draft',
  COMPLETED: 'status-completed'
}[s] || 'status-draft')

const getStatusText = (s) => ({
  GENERATED: 'Сгенерирована',
  DRAFT: 'Черновик',
  COMPLETED: 'Завершена'
}[s] || 'Черновик')

const viewBracket = (id) => {
  router.push(`/brackets/${id}`)
}
</script>

<style scoped>
.brackets-view { padding: 20px; }
.view-controls { display: flex; gap: 20px; margin-bottom: 24px; flex-wrap: wrap; align-items: center; }
.filter-group, .search-group { display: flex; align-items: center; gap: 8px; }
.search-input { padding: 8px 12px; border: 1px solid #ccc; border-radius: 4px; width: 300px; }

.brackets-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
}

.bracket-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  cursor: pointer;
  transition: all 0.3s ease;
}

.bracket-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
  border-color: #007bff;
}

.bracket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.bracket-name {
  font-size: 1.2em;
  font-weight: 600;
}

.bracket-status {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8em;
  font-weight: 500;
}

.status-active { background: #d4edda; color: #155724; }
.status-draft { background: #fff3cd; color: #856404; }
.status-completed { background: #d1ecf1; color: #0c5460; }

.bracket-tournament {
  color: #007bff;
  font-weight: 500;
  margin-bottom: 12px;
}

.bracket-progress {
  margin-top: 16px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 6px;
}

.progress-fill {
  height: 100%;
  background: #007bff;
  border-radius: 4px;
  transition: width 0.4s ease;
}

.progress-text {
  font-size: 0.85em;
  color: #666;
  text-align: right;
}

.loading, .empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 1.1em;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 16px;
}
</style>