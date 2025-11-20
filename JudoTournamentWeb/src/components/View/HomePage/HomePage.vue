<template>
  <div class="home_page_main-layout">
    <div class="content-wrapper">
      <!-- Левая карточка: Текущий турнир -->
      <div class="tournament-card">
        <div class="tournament-placeholder">
          <div class="tournament-overlay">
            <h1>Текущий турнир</h1>
            <p class="date">14–16 нояб. 2025 — Алматы</p>
            <p class="stats">370 дзюдоистов</p>
            <div class="tournament-buttons">
              <button class="btn-outline">Обзор</button>
              <button class="btn-primary">Календарь</button>
            </div>
          </div>
        </div>
      </div>

      <div class="events-panel">
        <h2 class="panel-title">Актуальные соревнования</h2>
        <div class="events-list">
          <div class="event-item live">
            <span class="live-badge">ПРЯМОЙ ЭФИР</span>
            <p class="event-date">13 нояб. 2025 — Астана</p>
            <h3>Чемпионат Казахстана</h3>
            <p class="event-stats">206 дзюдоистов</p>
          </div>
          <div class="event-item">
            <p class="event-date">14 нояб. 2025 — Алматы</p>
            <h3>Кубок Алматы</h3>
            <p class="event-stats">176 дзюдоистов</p>
          </div>
          <div class="event-item">
            <p class="event-date">15–16 нояб. 2025 — Шымкент</p>
            <h3>Южный турнир</h3>
            <p class="event-stats">220 дзюдоистов</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "@/components/View/HomePage/HomePage.css"
</script>

<style scoped>
/* === ОСНОВНОЙ КОНТЕЙНЕР === */
.home_page_main-layout {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(to bottom, #fefefe, #f8f9fa);
  padding: 2rem 2rem 4rem 1.5rem; /* ← Уменьшил левый padding */
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

/* === КОНТЕНТ — СМЕЩЁН ЧУТЬ ЛЕВЕЕ === */
.content-wrapper {
  display: grid;
  grid-template-columns: 600px 600px;
  gap: 2rem;
  width: 100%;
  max-width: 1400px;
  margin-left: 4%; /* ← Лёгкое смещение влево от центра */
  align-items: start;
}

/* === ЛЕВАЯ КАРТОЧКА === */
.tournament-card {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  width: 100%;
}

.tournament-placeholder {
  position: relative;
  height: 500px;
  width: 100%;
  background: linear-gradient(135deg, #8B6F47, #A67C52);
}

.tournament-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40px;
  background: linear-gradient(to top, rgba(0,0,0,0.85), transparent);
  color: white;
}

.tournament-overlay h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 12px;
}

.tournament-overlay .date {
  font-size: 1.1rem;
  margin: 8px 0;
  opacity: 0.95;
}

.tournament-overlay .stats {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 16px 0;
}

.tournament-buttons {
  display: flex;
  gap: 16px;
  margin-top: 20px;
}

.btn-outline,
.btn-primary {
  padding: 12px 24px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-outline {
  background: transparent;
  border: 2px solid white;
  color: white;
}

.btn-outline:hover {
  background: white;
  color: #333;
  transform: translateY(-2px);
}

.btn-primary {
  background: linear-gradient(135deg, #c89b3c, #e0b456);
  border: none;
  color: white;
  box-shadow: 0 4px 12px rgba(200, 155, 60, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(200, 155, 60, 0.4);
}

/* === ПРАВАЯ ПАНЕЛЬ === */
.events-panel {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  height: fit-content;
  width: 100%;
  border: 1px solid #f0f0f0;
}

.panel-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1.5rem;
  color: #1a1a1a;
  text-align: center;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.event-item {
  padding: 1rem;
  border-radius: 12px;
  background: #fafafa;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
}

.event-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  background: white;
  border-color: #c89b3c;
}

.live-badge {
  display: inline-block;
  background: linear-gradient(135deg, #4caf50, #66bb6a);
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  margin-bottom: 0.6rem;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}

.event-date {
  font-size: 0.85rem;
  color: #666;
  margin: 0.4rem 0;
  font-weight: 500;
}

.event-item h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0.6rem 0;
  color: #1a1a1a;
}

.event-stats {
  font-size: 0.9rem;
  color: #888;
  font-weight: 500;
  margin: 0.4rem 0 0;
}

/* === АДАПТИВНОСТЬ === */
@media (max-width: 1300px) {
  .content-wrapper {
    grid-template-columns: 1fr;
    max-width: 700px;
    margin-left: 3%; /* ← Лёгкое смещение на планшетах */
  }
}

@media (max-width: 768px) {
  .home_page_main-layout {
    padding: 1.5rem 1rem 3rem;
  }

  .content-wrapper {
    gap: 1.5rem;
    margin-left: 2%;
  }

  .tournament-overlay h1 {
    font-size: 2rem;
  }

  .tournament-placeholder {
    height: 400px;
  }

  .tournament-overlay {
    padding: 30px;
  }

  .events-panel {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .home_page_main-layout {
    padding: 1rem 0.75rem 2rem;
  }

  .content-wrapper {
    margin-left: 1%;
  }

  .tournament-overlay h1 {
    font-size: 1.6rem;
  }

  .tournament-placeholder {
    height: 350px;
  }

  .tournament-overlay {
    padding: 24px;
  }

  .tournament-buttons {
    flex-direction: column;
    gap: 12px;
  }

  .btn-outline,
  .btn-primary {
    width: 100%;
  }
}

</style>