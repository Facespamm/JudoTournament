<template>
  <div class="judo-tournament">
    <div class="judo-tournament-setting_search">
      <select class="judo-tournament-setting_search_select_category" name="tournament_filter_category">
        <option value="all">Категория турнира</option>
      </select>
      <select class="judo-tournament-setting_select_age_group" name="tournament_age_group">
        <option value="city">Возрастная группа</option>
      </select>
      <select class="judo-tournament-setting_date" name="tournament_date">
        <option value="date">Год проведения</option>
      </select>
        <input type="search" name="tournament_search" placeholder="Поиск турниров">
    </div>
    <div class="judo-tournament_info">
      <section class="judo-tournament-list">
        <h2>Ближайшие турниры</h2>
        <article class="judo-tournament-card">
          <div class="judo-tournament_card_info">
            <h3 class="judo-tournament_card_name">Турнир по дзюдо "Весна 2024"</h3>
            <p class="judo-tournament_card_date">Дата: 15 Марта 2024</p>
            <p class="judo-tournament_card_location">Место: Казахстан, Темиртау</p>
            <p class="judo-tournament_card_age_group">Возрастная группа: 14-18 лет</p>
          </div>
        </article>
      </section>
    </div>
  </div>
</template>
<script setup lang="ts">
</script>