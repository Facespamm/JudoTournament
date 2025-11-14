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
</style>