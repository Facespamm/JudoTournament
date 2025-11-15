<template>
  <div class="judo_athletes">
    <!-- ФИЛЬТРЫ -->
    <div class="judo_athletes-setting_search">
      <select class="judo-athletes-setting_search_select_category" name="athlete_filter_category">
        <option value="all">Категория спортсмена</option>
        <option value="60">до 60 кг</option>
        <option value="66">до 66 кг</option>
        <option value="73">до 73 кг</option>
        <option value="81">до 81 кг</option>
        <option value="90">до 90 кг</option>
        <option value="100">до 100 кг</option>
        <option value="+100">свыше 100 кг</option>
      </select>

      <select class="judo-athletes-setting_select_filter_city" name="athlete_filter_city">
        <option value="">Город</option>
        <option value="Астана">Астана</option>
        <option value="Алматы">Алматы</option>
        <option value="Шымкент">Шымкент</option>
        <option value="Актобе">Актобе</option>
        <option value="Караганда">Караганда</option>
        <option value="Павлодар">Павлодар</option>
        <option value="Усть-Каменогорск">Усть-Каменогорск</option>
        <option value="Тараз">Тараз</option>
        <option value="Костанай">Костанай</option>
        <option value="Атырау">Атырау</option>
      </select>

      <input
          type="search"
          name="athlete_search"
          placeholder="Поиск спортсменов"
          class="search-input"
      />

      <button
          type="button"
          class="register-button"
          @click="$router.push('/registrationathletes')"
      >
        Зарегистрировать участника
      </button>
    </div>

    <!-- СПИСОК -->
    <div class="judo_form-athletes_info">
      <section class="judo-list">
        <h2>Лучшие дзюдоисты</h2>
        <div class="cards-container">
          <article class="judo-card">
            <div class="rank-badge">#1</div>
            <div class="judo_card_info">
              <h3 class="judo_card_name">Азамат Сарсенбеков</h3>
              <div class="card-details">
                <p class="judo_card_category">до 66 кг</p>
                <p class="judo_card_city">Алматы</p>
                <p class="judo_card_club">Динамо Алматы</p>
              </div>
            </div>
          </article>
          <article class="judo-card">
            <div class="rank-badge">#2</div>
            <div class="judo_card_info">
              <h3 class="judo_card_name">Гульжан Искакова</h3>
              <div class="card-details">
                <p class="judo_card_category">до 57 кг</p>
                <p class="judo_card_city">Астана</p>
                <p class="judo_card_club">Президентский клуб</p>
              </div>
            </div>
          </article>
          <article class="judo-card">
            <div class="rank-badge">#3</div>
            <div class="judo_card_info">
              <h3 class="judo_card_name">Ерлан Серикжанов</h3>
              <div class="card-details">
                <p class="judo_card_category">до 81 кг</p>
                <p class="judo_card_city">Шымкент</p>
                <p class="judo_card_club">Южный ветер</p>
              </div>
            </div>
          </article>
          <article class="judo-card">
            <div class="rank-badge">#4</div>
            <div class="judo_card_info">
              <h3 class="judo_card_name">Айгерим Абилова</h3>
              <div class="card-details">
                <p class="judo_card_category">до 48 кг</p>
                <p class="judo_card_city">Актобе</p>
                <p class="judo_card_club">Актобе Дзюдо</p>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>

    <!-- КНОПКА -->
    <div class="judo-tournament_button_pagination">
      <button type="button" class="judo-tournament_button_pagination_next">
        Показать ещё
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import '@/components/View/Athletes/Athletes.css'
</script>

<style scoped>
</style>