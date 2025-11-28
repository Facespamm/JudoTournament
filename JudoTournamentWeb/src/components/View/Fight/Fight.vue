<template>
  <div class="fights-overview">
    <div class="fights-header">
      <h1>Схватки и поединки</h1>
      <p class="subtitle">Управление всеми боями турнира</p>
    </div>

    <div class="filters-section">
      <div class="filter-group">
        <label>Татами:</label>
        <select v-model="selectedTatami" @change="filterFights">
          <option value="all">Все татами</option>
          <option v-for="t in availableTatamis" :key="t" :value="t">Татами {{ t }}</option>
        </select>
      </div>
      <div class="filter-group">
        <label>Статус:</label>
        <select v-model="selectedStatus" @change="filterFights">
          <option value="all">Все статусы</option>
          <option value="SCHEDULED">Запланированы</option>
          <option value="IN_PROGRESS">LIVE</option>
          <option value="COMPLETED">Завершены</option>
        </select>
      </div>
    </div>

    <div class="fights-list">
      <div class="tatami-grid">
        <div
            v-for="fight in filteredFights"
            :key="fight.id"
            class="fight-card"
            :class="statusClass(fight.status)"
            @click="viewFightDetail(fight.id)"
        >
          <!-- Цветная полоса слева -->
          <div class="status-bar"></div>

          <!-- Статус в правом верхнем углу -->
          <div class="status-corner">
            <span class="dot"></span>
            {{ statusText(fight.status) }}
          </div>

          <div class="card-content">
            <div class="header">
              <div class="tatami-main">
                <h2 class="tatami-name">Татами {{ fight.tatami }}</h2>
                <span class="fight-number">Схватка #{{ fight.fight_number }}</span>
              </div>
              <div class="timer-big">
                {{ displayTime(fight) }}
              </div>
            </div>

            <div class="actions">
              <button v-if="fight.status === 'SCHEDULED'" @click.stop="startFight(fight.id)" class="btn-start">
                Начать
              </button>
              <button v-if="fight.status === 'IN_PROGRESS'" @click.stop="controlFight(fight.id)" class="btn-control">
                Управление
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredFights.length === 0" class="empty-state">
        <div class="empty-icon">Gi</div>
        <h3>Схватки не найдены</h3>
        <button class="reset-filters-btn" @click="resetFilters">Сбросить фильтры</button>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchGetFights } from '@/components/View/Fight/fetchFights.js'

export default {
  name: 'FightsOverview',
  data() {
    return {
      fights: [],
      selectedTatami: 'all',
      selectedStatus: 'all',
      refreshInterval: null // Добавляем переменную для хранения интервала
    }
  },
  computed: {
    availableTatamis() {
      return [...new Set(this.fights.map(f => f.tatami))].sort((a, b) => a - b)
    },
    filteredFights() {
      let list = this.fights
      if (this.selectedTatami !== 'all') list = list.filter(f => f.tatami === +this.selectedTatami)
      if (this.selectedStatus !== 'all') list = list.filter(f => f.status === this.selectedStatus)
      return list
    }
  },
  async mounted() {
    await this.loadFights()
    // УБИРАЕМ автоматическое обновление или настраиваем по необходимости
    // this.refreshInterval = setInterval(this.loadFights, 10000)
  },
  beforeUnmount() {
    // Очищаем интервал при уничтожении компонента
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
      this.refreshInterval = null
    }
  },
  methods: {
    async loadFights() {
      try {
        console.log('Загрузка списка боев...') // Для отладки
        const res = await fetchGetFights()
        if (res.success) {
          this.fights = res.data.fights || []
          console.log('Бои загружены:', this.fights.length) // Для отладки
        }
      } catch (err) {
        console.error('Ошибка загрузки боев:', err)
      }
    },
    filterFights() {},
    resetFilters() {
      this.selectedTatami = 'all'
      this.selectedStatus = 'all'
    },
    statusText(s) {
      return s === 'IN_PROGRESS' ? 'LIVE' : s === 'SCHEDULED' ? 'Запланировано' : 'Завершено'
    },
    statusClass(s) {
      return `status-${s.toLowerCase()}`
    },
    displayTime(f) {
      if (f.status === 'IN_PROGRESS') return this.formatTimer(f.timer_seconds || 0)
      if (f.status === 'SCHEDULED' && f.scheduled_time) return this.formatScheduledTime(f.scheduled_time)
      if (f.status === 'COMPLETED') return 'Завершено'
      return '—'
    },
    formatTimer(sec) {
      const m = String(Math.floor(sec / 60)).padStart(2, '0')
      const s = String(sec % 60).padStart(2, '0')
      return `${m}:${s}`
    },
    formatScheduledTime(date) {
      return new Date(date).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    },
    viewFightDetail(id) { this.$router.push(`/fights/${id}`) },
    controlFight(id) { this.$router.push(`/referee?fight=${id}`) },
    startFight(id) { console.log('Start:', id) },

    // Дополнительные методы для ручного обновления если нужно
    manualRefresh() {
      this.loadFights()
    },

    // Метод для включения/выключения автообновления
    toggleAutoRefresh(enable) {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval)
        this.refreshInterval = null
      }

      if (enable) {
        this.refreshInterval = setInterval(this.loadFights, 10000)
        console.log('Автообновление включено')
      } else {
        console.log('Автообновление выключено')
      }
    }
  }
}
</script>

<style scoped>
.fights-overview { min-height: 100vh; background: #f9f9fb; padding: 90px 2rem 4rem; font-family: 'SF Pro Display', -apple-system, sans-serif; color: #1a1a1a; }

.fights-header h1 { font-size: 2.8rem; font-weight: 900; background: linear-gradient(90deg, #1a1a1a, #333); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-align: center; }
.subtitle { font-size: 1.25rem; color: #666; text-align: center; margin-top: 0.5rem; }

.filters-section { display: flex; gap: 2rem; margin: 3rem auto; max-width: 900px; padding: 1rem 1.5rem; background: white; border-radius: 20px; box-shadow: 0 8px 25px rgba(0,0,0,0.08); }
.filter-group select { padding: 0.75rem 1rem; border: 2px solid #e0e0e0; border-radius: 14px; font-weight: 600; }

.tatami-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 2rem; max-width: 1400px; margin: 0 auto; }

.fight-card {
  position: relative;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}
.fight-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.16); }

/* Цветная полоса слева */
.status-bar { position: absolute; left: 0; top: 0; bottom: 0; width: 10px; }
.status-in_progress .status-bar { background: linear-gradient(#ff3b30, #ff6b6b); }
.status-scheduled   .status-bar { background: linear-gradient(#007aff, #5ac8fa); }
.status-completed   .status-bar { background: linear-gradient(#34c759, #7ed957); }

/* Статус в правом верхнем углу — как на скриншоте */
.status-corner {
  position: absolute;
  top: 16px;
  right: 16px;
  background: white;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 800;
  text-transform: uppercase;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 10;
}
.status-in_progress .status-corner { color: #007aff; }
.status-scheduled   .status-corner { color: #007aff; }
.status-completed   .status-corner { color: #34c759; }
.dot {
  width: 9px; height: 9px; border-radius: 50%; background: currentColor;
  animation: pulse 1.8s infinite;
}

.card-content { padding: 2rem; padding-top: 3rem; }

.header { margin-bottom: 1.5rem; }
.tatami-name { font-size: 2.2rem; font-weight: 900; margin: 0; color: #000; }
.fight-number {
  display: inline-block;
  background: #f0f0f0;
  color: #555;
  padding: 0.4rem 1rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 0.5rem;
}

.timer-big {
  font-size: 2.6rem;
  font-weight: 900;
  font-family: 'SF Pro Display', monospace;
  text-align: center;
  color: #1a1a1a;
  margin: 1.5rem 0;
}

.actions { text-align: center; }
.btn-start, .btn-control {
  background: linear-gradient(135deg, #c89b3c, #f4d03f);
  color: white;
  border: none;
  border-radius: 30px;
  padding: 0.9rem 2.4rem;
  font-weight: 800;
  font-size: 1.1rem;
  box-shadow: 0 8px 25px rgba(200,155,60,0.4);
  transition: all 0.3s;
}
.btn-start:hover, .btn-control:hover { transform: translateY(-4px); box-shadow: 0 14px 35px rgba(200,155,60,0.5); }

.empty-state { text-align: center; padding: 6rem; color: #666; }
.reset-filters-btn {
  background: linear-gradient(135deg, #c89b3c, #f4d03f);
  color: white; padding: 1rem 2.5rem; border: none; border-radius: 16px; font-weight: 700;
}

@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }

@media (max-width: 768px) {
  .tatami-grid { grid-template-columns: 1fr; }
  .filters-section { flex-direction: column; }
  .tatami-name { font-size: 1.9rem; }
  .timer-big { font-size: 2.2rem; }
}
</style>