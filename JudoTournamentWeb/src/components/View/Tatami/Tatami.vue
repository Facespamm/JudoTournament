<template>
  <div class="tatami-overview">
    <!-- ЗАГОЛОВОК -->
    <div class="tatami-header">
      <h1>Турнирные татами</h1>
      <p class="subtitle">Чемпионат Казахстана по дзюдо 2024</p>
      <div class="tournament-stats">
        <div class="stat-item">
          <span class="stat-number">{{ liveFightsCount }}</span>
          <span class="stat-label">LIVE схваток</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ completedFightsCount }}</span>
          <span class="stat-label">Завершено</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ totalFightsCount }}</span>
          <span class="stat-label">Всего схваток</span>
        </div>
      </div>
    </div>

    <!-- СЕТКА ТАМИМИ -->
    <div class="tatami-grid">
      <!-- ТАМИМИ 1 -->
      <div
          class="tatami-card status-live"
          @click="viewTatamiDetail(1)"
      >
        <div class="tatami-card-header">
          <div class="tatami-info">
            <h2 class="tatami-name">Татами 1</h2>
            <span class="tatami-category">Мужчины до 73кг</span>
          </div>
          <div class="tatami-status live">
            <span class="status-dot"></span>
            LIVE
          </div>
        </div>

        <div class="current-fight">
          <div class="fight-header">
            <span class="fight-number">Схватка #24</span>
          </div>

          <div class="athletes">
            <div class="athlete white-athlete">
              <div class="athlete-info">
                <span class="belt white"></span>
                <div class="athlete-details">
                  <h3 class="athlete-name">Азамат Сарсенбеков</h3>
                  <p class="athlete-club">Динамо Алматы</p>
                </div>
              </div>
            </div>

            <div class="vs-section">
              <span class="vs">VS</span>
              <div class="timer">04:00</div>
            </div>

            <div class="athlete blue-athlete">
              <div class="athlete-info">
                <div class="athlete-details">
                  <h3 class="athlete-name">Соперник</h3>
                  <p class="athlete-club">Клуб</p>
                </div>
                <span class="belt blue"></span>
              </div>
            </div>
          </div>
        </div>

        <div class="tatami-footer">
          <div class="progress-section">
            <div class="progress-bar">
              <div class="progress-fill" style="width: 65%"></div>
            </div>
            <span class="progress-text">65% завершено</span>
          </div>

          <div class="queue-section">
            <span class="queue-label">В очереди: 8 схваток</span>
            <div class="next-categories">
              <span class="category-tag">До 81кг</span>
              <span class="category-tag">До 90кг</span>
            </div>
          </div>
        </div>

        <button class="control-btn" @click.stop="controlTatami(1)">
          Управление
        </button>
      </div>

      <!-- ТАМИМИ 2 -->
      <div
          class="tatami-card status-preparation"
          @click="viewTatamiDetail(2)"
      >
        <div class="tatami-card-header">
          <div class="tatami-info">
            <h2 class="tatami-name">Татами 2</h2>
            <span class="tatami-category">Женщины до 57кг</span>
          </div>
          <div class="tatami-status preparation">
            <span class="status-dot"></span>
            Подготовка
          </div>
        </div>

        <div class="no-fight">
          <p class="no-fight-text">Нет активной схватки</p>
          <p class="next-fight">Следующая: 14:30</p>
        </div>

        <div class="tatami-footer">
          <div class="progress-section">
            <div class="progress-bar">
              <div class="progress-fill" style="width: 40%"></div>
            </div>
            <span class="progress-text">40% завершено</span>
          </div>

          <div class="queue-section">
            <span class="queue-label">В очереди: 12 схваток</span>
            <div class="next-categories">
              <span class="category-tag">До 63кг</span>
              <span class="category-tag">До 70кг</span>
            </div>
          </div>
        </div>

        <button class="control-btn" @click.stop="controlTatami(2)">
          Управление
        </button>
      </div>

      <!-- ТАМИМИ 3 -->
      <div
          class="tatami-card status-free"
          @click="viewTatamiDetail(3)"
      >
        <div class="tatami-card-header">
          <div class="tatami-info">
            <h2 class="tatami-name">Татами 3</h2>
            <span class="tatami-category">Юниоры до 66кг</span>
          </div>
          <div class="tatami-status free">
            <span class="status-dot"></span>
            Свободно
          </div>
        </div>

        <div class="no-fight">
          <p class="no-fight-text">Нет активной схватки</p>
        </div>

        <div class="tatami-footer">
          <div class="progress-section">
            <div class="progress-bar">
              <div class="progress-fill" style="width: 85%"></div>
            </div>
            <span class="progress-text">85% завершено</span>
          </div>

          <div class="queue-section">
            <span class="queue-label">В очереди: 3 схватки</span>
            <div class="next-categories">
              <span class="category-tag">До 73кг</span>
            </div>
          </div>
        </div>

        <button class="control-btn" @click.stop="controlTatami(3)">
          Управление
        </button>
      </div>

      <!-- ТАМИМИ 4 -->
      <div
          class="tatami-card status-pause"
          @click="viewTatamiDetail(4)"
      >
        <div class="tatami-card-header">
          <div class="tatami-info">
            <h2 class="tatami-name">Татами 4</h2>
            <span class="tatami-category">Кадеты до 55кг</span>
          </div>
          <div class="tatami-status pause">
            <span class="status-dot"></span>
            Пауза
          </div>
        </div>

        <div class="no-fight">
          <p class="no-fight-text">Нет активной схватки</p>
        </div>

        <div class="tatami-footer">
          <div class="progress-section">
            <div class="progress-bar">
              <div class="progress-fill" style="width: 50%"></div>
            </div>
            <span class="progress-text">50% завершено</span>
          </div>

          <div class="queue-section">
            <span class="queue-label">В очереди: 6 схваток</span>
            <div class="next-categories">
              <span class="category-tag">До 60кг</span>
            </div>
          </div>
        </div>

        <button class="control-btn" @click.stop="controlTatami(4)">
          Управление
        </button>
      </div>
    </div>

    <!-- СТАТУС-ЛЕГЕНДА -->
    <div class="status-legend">
      <h3>Статусы тамими:</h3>
      <div class="legend-items">
        <div class="legend-item">
          <span class="status-dot free"></span>
          <span>Свободно</span>
        </div>
        <div class="legend-item">
          <span class="status-dot preparation"></span>
          <span>Подготовка</span>
        </div>
        <div class="legend-item">
          <span class="status-dot live"></span>
          <span>LIVE</span>
        </div>
        <div class="legend-item">
          <span class="status-dot pause"></span>
          <span>Пауза</span>
        </div>
        <div class="legend-item">
          <span class="status-dot break"></span>
          <span>Перерыв</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TatamiOverview',
  data() {
    return {
      liveFightsCount: 1,
      completedFightsCount: 14,
      totalFightsCount: 52
    }
  },
  methods: {
    viewTatamiDetail(tatamiId) {
      this.$router.push(`/tatami/${tatamiId}`)
    },

    controlTatami(tatamiId) {
      this.$router.push(`/referee?tatami=${tatamiId}`)
    }
  }
}
</script>

<style scoped>
.tatami-overview {
  min-height: 100vh;
  background: linear-gradient(to bottom, #fefefe, #f8f9fa);
  padding: 90px 2rem 2rem 2rem;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  color: #1a1a1a;
}

/* ЗАГОЛОВОК */
.tatami-header {
  text-align: center;
  margin-bottom: 3rem;
}

.tatami-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: #1a1a1a;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
  margin: 0 0 2rem 0;
}

.tournament-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-top: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  color: #c89b3c;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

/* СЕТКА ТАМИМИ */
.tatami-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.tatami-card {
  background: white;
  border-radius: 20px;
  padding: 1.8rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
}

.tatami-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

/* СТАТУСНЫЕ РАМКИ */
.tatami-card.status-live {
  border-left: 4px solid #f44336;
}

.tatami-card.status-preparation {
  border-left: 4px solid #2196f3;
}

.tatami-card.status-free {
  border-left: 4px solid #4caf50;
}

.tatami-card.status-pause {
  border-left: 4px solid #ff9800;
}

.tatami-card.status-break {
  border-left: 4px solid #9e9e9e;
}

/* ХЕДЕР ТАМИМИ */
.tatami-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.tatami-name {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: #1a1a1a;
}

.tatami-category {
  background: #f8f9fa;
  color: #666;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
}

.tatami-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.tatami-status.free .status-dot { background: #4caf50; }
.tatami-status.preparation .status-dot { background: #2196f3; }
.tatami-status.live .status-dot { background: #f44336; animation: pulse 2s infinite; }
.tatami-status.pause .status-dot { background: #ff9800; }
.tatami-status.break .status-dot { background: #9e9e9e; }

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

/* ТЕКУЩАЯ СХВАТКА */
.current-fight {
  margin-bottom: 1.5rem;
}

.fight-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.fight-number, .fight-round {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.athletes {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.athlete {
  flex: 1;
  display: flex;
  align-items: center;
}

.white-athlete {
  justify-content: flex-start;
}

.blue-athlete {
  justify-content: flex-end;
}

.athlete-info {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.athlete-details {
  text-align: left;
}

.blue-athlete .athlete-details {
  text-align: right;
}

.athlete-name {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.2rem 0;
  color: #1a1a1a;
}

.athlete-club {
  font-size: 0.8rem;
  color: #666;
  margin: 0;
}

.belt {
  width: 20px;
  height: 4px;
  border-radius: 2px;
}

.belt.white {
  background: white;
  border: 1px solid #ddd;
}

.belt.blue {
  background: #2196f3;
}

.athlete-scores {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  margin: 0 1rem;
}

.score-display {
  display: flex;
  gap: 0.3rem;
}

.score {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  color: white;
}

.score.ippon { background: #4caf50; }
.score.wazaari { background: #2196f3; }
.score.yuko { background: #ff9800; }

.penalties {
  display: flex;
  gap: 0.2rem;
}

.penalty {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f44336;
}

/* VS СЕКЦИЯ */
.vs-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.vs {
  font-size: 1.2rem;
  font-weight: 700;
  color: #666;
}

.timer {
  font-size: 1.4rem;
  font-weight: 700;
  font-family: 'Courier New', monospace;
  color: #1a1a1a;
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  min-width: 80px;
  text-align: center;
}

.timer.golden-score {
  background: #fff8e1;
  color: #c89b3c;
  animation: goldenPulse 1.5s infinite;
}

@keyframes goldenPulse {
  0% { background: #fff8e1; }
  50% { background: #ffecb3; }
  100% { background: #fff8e1; }
}

/* ЕСЛИ НЕТ СХВАТКИ */
.no-fight {
  text-align: center;
  padding: 2rem 0;
  color: #666;
}

.no-fight-text {
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
}

.next-fight {
  font-size: 0.9rem;
  margin: 0;
}

/* ФУТЕР ТАМИМИ */
.tatami-footer {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.progress-section {
  margin-bottom: 1rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #c89b3c, #e0b456);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.8rem;
  color: #666;
}

.queue-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.queue-label {
  font-size: 0.9rem;
  color: #666;
}

.next-categories {
  display: flex;
  gap: 0.3rem;
}

.category-tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 500;
}

/* КНОПКА УПРАВЛЕНИЯ */
.control-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: linear-gradient(135deg, #c89b3c, #e0b456);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(200, 155, 60, 0.3);
}

/* ЛЕГЕНДА СТАТУСОВ */
.status-legend {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  max-width: 500px;
  margin: 0 auto;
}

.status-legend h3 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  color: #666;
  text-align: center;
}

.legend-items {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

/* АДАПТИВНОСТЬ */
@media (max-width: 768px) {
  .tatami-overview {
    padding: 80px 1rem 1rem 1rem;
  }

  .tatami-grid {
    grid-template-columns: 1fr;
  }

  .tournament-stats {
    gap: 1.5rem;
  }

  .stat-number {
    font-size: 2rem;
  }

  .athletes {
    flex-direction: column;
    gap: 1rem;
  }

  .athlete {
    justify-content: center !important;
  }

  .vs-section {
    flex-direction: row;
    gap: 1rem;
  }

  .legend-items {
    flex-direction: column;
    gap: 0.8rem;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .tatami-card {
    padding: 1.2rem;
  }

  .tatami-name {
    font-size: 1.2rem;
  }

  .athlete-name {
    font-size: 1rem;
  }

  .timer {
    font-size: 1.2rem;
    min-width: 60px;
  }
}
</style>