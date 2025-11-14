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
                <p class="judo_card_city">📍 Алматы</p>
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
                <p class="judo_card_city">📍 Астана</p>
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
                <p class="judo_card_city">📍 Шымкент</p>
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
                <p class="judo_card_city">📍 Актобе</p>
                <p class="judo_card_club">Актобе Дзюдо</p>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>

    <!-- КНОПКА -->
    <div class="judo-tournament_button_pagination">
      <button type="submit" class="judo-tournament_button_pagination_next">
        Показать ещё
      </button>
    </div>
  </div>
</template>

<style scoped>
/* === ОСНОВА === */
.judo_athletes {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(to bottom, #fefefe, #f8f9fa);
  font-family: 'Inter', 'Segoe UI', sans-serif;
  color: #1a1a1a;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

/* === ФИЛЬТРЫ === */
.judo_athletes-setting_search {
  display: flex;
  gap: 1rem;
  margin: 2rem 2rem 3rem;
  flex-wrap: wrap;
  align-items: center;
}

.judo-athletes-setting_search_select_category,
.judo-athletes-setting_select_filter_city {
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

.judo-athletes-setting_search_select_category:hover,
.judo-athletes-setting_select_filter_city:hover {
  border-color: #c89b3c;
}

.judo-athletes-setting_search_select_category:focus,
.judo-athletes-setting_select_filter_city:focus {
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
.judo-list h2 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 2.5rem;
  color: #1a1a1a;
  text-align: center;
}

/* === КОНТЕЙНЕР КАРТОЧЕК === */
.judo_form-athletes_info {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: flex-start;
}

/* === КАРТОЧКИ === */
.judo-card {
  background: white;
  border-radius: 16px;
  padding: 1.8rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  flex: 1 1 280px;
  max-width: 350px;
  min-width: 280px;
}

.judo-card::before {
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

.judo-card:hover::before {
  transform: scaleX(1);
}

.judo-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #c89b3c;
}

.rank-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: linear-gradient(135deg, #c89b3c, #e0b456);
  color: white;
  font-weight: 700;
  font-size: 0.85rem;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(200, 155, 60, 0.3);
}

.judo_card_info {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.judo_card_name {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #1a1a1a;
  padding-right: 3rem;
}

.card-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.judo_card_category {
  margin: 0;
  font-size: 0.95rem;
  color: #555;
  font-weight: 600;
  background: #f8f9fa;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  width: fit-content;
}

.judo_card_city {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.judo_card_club {
  margin: 0;
  font-size: 0.85rem;
  color: #888;
  font-style: italic;
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
  .judo_athletes-setting_search {
    margin: 1.5rem 1.5rem 2.5rem;
  }

  .judo_form-athletes_info {
    padding: 0 1.5rem;
  }

  .cards-container {
    gap: 1.2rem;
  }

  .judo-tournament_button_pagination {
    padding: 0 1.5rem;
  }
}

@media (max-width: 768px) {
  .judo_athletes-setting_search {
    flex-direction: column;
    margin: 1.5rem 1rem 2rem;
  }

  .judo-athletes-setting_search_select_category,
  .judo-athletes-setting_select_filter_city,
  .search-input {
    width: 100%;
    max-width: 100%;
    min-width: 100%;
  }

  .judo_form-athletes_info {
    padding: 0 1rem;
  }

  .judo-card {
    flex: 1 1 100%;
    max-width: 100%;
  }

  .judo-list h2 {
    font-size: 1.6rem;
  }

  .judo-tournament_button_pagination {
    padding: 0 1rem;
  }
}

@media (max-width: 480px) {
  .judo_athletes-setting_search {
    margin: 1rem 0.75rem 1.5rem;
  }

  .judo_form-athletes_info {
    padding: 0 0.75rem;
  }

  .judo_card_name {
    font-size: 1.15rem;
  }

  .judo-tournament_button_pagination {
    padding: 0 0.75rem;
  }
}
</style>

<script setup lang="ts">
// Логика при необходимости
</script>