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
          <!-- КАРТОЧКИ (оставил как есть) -->
          <article class="judo-tournament-card">
            <div class="judo-tournament_card_info">
              <span class="tournament-date-badge">17 марта 2025</span>
              <h3 class="judo-tournament_card_name">Чемпионат Казахстана среди кадетов</h3>
              <p class="judo-tournament_card_location">Астана, Казахстан</p>
              <div class="tournament-stats">
                <span class="stat-item">14 регионов</span>
                <span class="stat-divider">•</span>
                <span class="stat-item">125 дзюдоистов</span>
              </div>
            </div>
          </article>

          <!-- Остальные карточки — без изменений -->
          <!-- ... (всё как было) ... -->

          <article class="judo-tournament-card featured">
            <div class="featured-badge">Главный турнир</div>
            <div class="judo-tournament_card_info">
              <span class="tournament-date-badge">10-12 мая 2025</span>
              <h3 class="judo-tournament_card_name">Гран-при Казахстана 2025</h3>
              <p class="judo-tournament_card_location">Астана, Казахстан</p>
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
import "@/components/View/Tournaments/Tournaments.css"
</script>

<style scoped>

</style>