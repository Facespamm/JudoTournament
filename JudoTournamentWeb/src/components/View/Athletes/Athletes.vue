<template>
  <div class="judo_athletes" >
  <div class="judo_athletes-setting_search">
    <select class="judo-athletes-setting_search_select_category" name="athlete_filter_category">
      <option value="all">Категория спортсмена</option>
    </select>
    <select class="judo-athletes-setting_select_filter_city" name="athlete_filter_city">
      <option value="city">Город</option>
    </select>
      <input type="search" name="athlete_search" placeholder="Поиск спортсменов">
  </div>
    <div class="judo_form-athletes_info">
      <section class="judo-list">
        <h2>Лучшие дзюдоисты</h2>
        <article class="judo-card">
          <div class="judo_card_info">
            <h3 class="judo_card_name">Иван Иванов</h3>
            <p class="judo_card_category">Категория: до 60 кг</p>
            <p class="judo_card_city">Город: Москва</p>
            <p class="judo_card_club">Клуб: Дзюдо Москва</p>
          </div>
        </article>
      </section>
    </div>
    <div class="judo-tournament_button_pagination">
      <button type="submit" class="judo-tournament_button_pagination_next">Следующая</button>
    </div>
  </div>
</template>

<style scoped>

</style>
<script setup lang="ts">
</script>