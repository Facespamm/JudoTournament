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

      <input
          type="search"
          name="tournament_search"
          placeholder="Поиск турниров"
          class="search-input"
      />
    </div>

    <!-- СПИСОК ТУРНИРОВ -->
    <div class="judo-tournament_info">
      <section class="judo-tournament-list">
        <h2>Ближайшие турниры</h2>

        <div class="tournament-cards-container">
          <article class="judo-tournament-card">
            <div class="judo-tournament_card_info">
              <span class="tournament-date-badge">17 марта 2025</span>
              <h3 class="judo-tournament_card_name">Чемпионат Казахстана среди кадетов</h3>
              <p class="judo-tournament_card_location">📍 Астана, Казахстан</p>
              <div class="tournament-stats">
                <span class="stat-item">14 регионов</span>
                <span class="stat-divider">•</span>
                <span class="stat-item">125 дзюдоистов</span>
              </div>
            </div>
          </article>

          <article class="judo-tournament-card">
            <div class="judo-tournament_card_info">
              <span class="tournament-date-badge">22 марта 2025</span>
              <h3 class="judo-tournament_card_name">Кубок Алматы по дзюдо</h3>
              <p class="judo-tournament_card_location">📍 Алматы, Казахстан</p>
              <div class="tournament-stats">
                <span class="stat-item">8 регионов</span>
                <span class="stat-divider">•</span>
                <span class="stat-item">70 дзюдоистов</span>
              </div>
            </div>
          </article>

          <article class="judo-tournament-card">
            <div class="judo-tournament_card_info">
              <span class="tournament-date-badge">5 апреля 2025</span>
              <h3 class="judo-tournament_card_name">Открытый турнир Караганды</h3>
              <p class="judo-tournament_card_location">📍 Караганда, Казахстан</p>
              <div class="tournament-stats">
                <span class="stat-item">10 регионов</span>
                <span class="stat-divider">•</span>
                <span class="stat-item">95 дзюдоистов</span>
              </div>
            </div>
          </article>

          <article class="judo-tournament-card">
            <div class="judo-tournament_card_info">
              <span class="tournament-date-badge">15 апреля 2025</span>
              <h3 class="judo-tournament_card_name">Чемпионат Казахстана среди юниоров</h3>
              <p class="judo-tournament_card_location">📍 Шымкент, Казахстан</p>
              <div class="tournament-stats">
                <span class="stat-item">16 регионов</span>
                <span class="stat-divider">•</span>
                <span class="stat-item">160 дзюдоистов</span>
              </div>
            </div>
          </article>

          <article class="judo-tournament-card">
            <div class="judo-tournament_card_info">
              <span class="tournament-date-badge">28 апреля 2025</span>
              <h3 class="judo-tournament_card_name">Кубок Павлодара</h3>
              <p class="judo-tournament_card_location">📍 Павлодар, Казахстан</p>
              <div class="tournament-stats">
                <span class="stat-item">12 регионов</span>
                <span class="stat-divider">•</span>
                <span class="stat-item">110 дзюдоистов</span>
              </div>
            </div>
          </article>

          <article class="judo-tournament-card featured">
            <div class="featured-badge">🏆 Главный турнир</div>
            <div class="judo-tournament_card_info">
              <span class="tournament-date-badge">10-12 мая 2025</span>
              <h3 class="judo-tournament_card_name">Гран-при Казахстана 2025</h3>
              <p class="judo-tournament_card_location">📍 Астана, Казахстан</p>
              <div class="tournament-stats">
                <span class="stat-item">17 регионов</span>
                <span class="stat-divider">•</span>
                <span class="stat-item">240 дзюдоистов</span>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>

    <!-- КНОПКА ЗАГРУЗИТЬ ЕЩЁ -->
    <div class="judo-tournament_button_pagination">
      <button type="button" class="judo-tournament_button_pagination_next">
        Показать ещё турниры
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// Логика при необходимости
</script>

<style scoped>
/* === ОСНОВА === */
.judo-tournament {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(to bottom, #fefefe, #f8f9fa);
  font-family: 'Inter', 'Segoe UI', sans-serif;
  color: #1a1a1a;
  padding: 0;
  padding-bottom: 4rem; /* Добавляем отступ снизу */
  margin: 0;
  box-sizing: border-box;
}
/* === ФИЛЬТРЫ === */
.judo-tournament-setting_search {
  display: flex;
  gap: 1rem;
  margin: 2rem 2rem 3rem 0;
  padding-left: 2rem;
  flex-wrap: wrap;
  align-items: center;
}

.judo-tournament-setting_search_select_category,
.judo-tournament-setting_select_age_group,
.judo-tournament-setting_date {
  padding: 0.85rem 1.2rem;
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  background: white;
  font-size: 0.95rem;
  color: #333;
  min-width: 200px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.judo-tournament-setting_search_select_category:hover,
.judo-tournament-setting_select_age_group:hover,
.judo-tournament-setting_date:hover {
  border-color: #c89b3c;
}

.judo-tournament-setting_search_select_category:focus,
.judo-tournament-setting_select_age_group:focus,
.judo-tournament-setting_date:focus {
  outline: none;
  border-color: #c89b3c;
  box-shadow: 0 0 0 3px rgba(200, 155, 60, 0.1);
}

.search-input {
  flex: 1;
  min-width: 260px;
  max-width: 380px;
  padding: 0.85rem 1.2rem 0.85rem 2.8rem;
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  background: white url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.35-4.35'/%3E%3C/svg%3E") no-repeat 1rem center;
  background-size: 18px;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.search-input:hover {
  border-color: #c89b3c;
}

.search-input:focus {
  outline: none;
  border-color: #c89b3c;
  box-shadow: 0 0 0 3px rgba(200, 155, 60, 0.1);
}

/* === ЗАГОЛОВОК === */
.judo-tournament-list h2 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 2.5rem;
  color: #1a1a1a;
  text-align: center;
}

/* === КОНТЕЙНЕР ТУРНИРОВ === */
.judo-tournament_info {
  max-width: 1400px;
  margin: 0;
  padding: 0 2rem;
}

.tournament-cards-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* === КАРТОЧКИ ТУРНИРОВ === */
.judo-tournament-card {
  background: white;
  border-radius: 16px;
  padding: 1.8rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.judo-tournament-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #c89b3c, #e0b456);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.judo-tournament-card:hover::before {
  transform: scaleX(1);
}

.judo-tournament-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #c89b3c;
  cursor: pointer;
}

/* Избранная карточка */
.judo-tournament-card.featured {
  background: linear-gradient(135deg, #fff9e6 0%, #ffffff 100%);
  border: 2px solid #c89b3c;
}

.featured-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: linear-gradient(135deg, #c89b3c, #e0b456);
  color: white;
  font-weight: 700;
  font-size: 0.8rem;
  padding: 0.4rem 0.9rem;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(200, 155, 60, 0.3);
}

.judo-tournament_card_info {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.tournament-date-badge {
  display: inline-block;
  background: #f8f9fa;
  color: #666;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.4rem 0.9rem;
  border-radius: 8px;
  width: fit-content;
}

.judo-tournament_card_name {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.3;
  padding-right: 8rem;
}

.featured .judo-tournament_card_name {
  padding-right: 10rem;
}

.judo-tournament_card_location {
  margin: 0;
  font-size: 0.95rem;
  color: #666;
  font-weight: 500;
}

.tournament-stats {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-top: 0.3rem;
}

.stat-item {
  font-size: 0.9rem;
  color: #888;
  font-weight: 500;
}

.stat-divider {
  color: #ccc;
  font-weight: 300;
}

/* === КНОПКА === */
.judo-tournament_button_pagination {
  text-align: center;
  margin: 3rem 0 2rem 0;
  padding: 0 2rem;
}

.judo-tournament_button_pagination_next {
  background: white;
  border: 2px solid #c89b3c;
  color: #c89b3c;
  padding: 1rem 3rem;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.judo-tournament_button_pagination_next:hover {
  background: #c89b3c;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(200, 155, 60, 0.3);
}

/* === АДАПТИВ === */
@media (max-width: 992px) {
  .judo-tournament-setting_search {
    margin: 1.5rem 1.5rem 2.5rem 0;
    padding-left: 1.5rem;
  }

  .judo-tournament_info {
    padding: 0 1.5rem;
  }

  .tournament-cards-container {
    gap: 1.2rem;
  }

  .judo-tournament_button_pagination {
    padding: 0 1.5rem;
  }
}

@media (max-width: 768px) {
  .judo-tournament-setting_search {
    flex-direction: column;
    margin: 1.5rem 1rem 2rem 0;
    padding-left: 1rem;
  }

  .judo-tournament-setting_search_select_category,
  .judo-tournament-setting_select_age_group,
  .judo-tournament-setting_date,
  .search-input {
    width: 100%;
    max-width: 100%;
    min-width: 100%;
  }

  .judo-tournament_info {
    padding: 0 1rem;
  }

  .judo-tournament_card_name {
    font-size: 1.2rem;
    padding-right: 0;
  }

  .featured .judo-tournament_card_name {
    padding-right: 0;
    padding-top: 2rem;
  }

  .featured-badge {
    top: 0.8rem;
    right: 0.8rem;
    font-size: 0.75rem;
    padding: 0.35rem 0.7rem;
  }

  .judo-tournament-list h2 {
    font-size: 1.6rem;
  }

  .judo-tournament_button_pagination {
    padding: 0 1rem;
  }
}

@media (max-width: 480px) {
  .judo-tournament-setting_search {
    margin: 1rem 0.75rem 1.5rem 0;
    padding-left: 0.75rem;
  }

  .judo-tournament_info {
    padding: 0 0.75rem;
  }

  .judo-tournament_card_name {
    font-size: 1.1rem;
  }

  .judo-tournament_button_pagination {
    padding: 0 0.75rem;
  }
}
</style>