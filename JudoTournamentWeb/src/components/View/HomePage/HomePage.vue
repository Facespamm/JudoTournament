<template>
  <div class="home_page_background"></div>

  <!-- общий flex контейнер -->
  <div class="home_page_main-layout">

    <!-- Левая панель -->
    <div class="home_page_navbar-container">
      <form class="navbar-base">
        <p>Judo Tournament</p>
        <button type="button" name="main_page">Главная</button>
        <button type="button" name="athletes_page">Дзюдоисты</button>
        <button type="button" name="tournament_page">Турниры</button>
        <button type="button" name="forecast_page">Прогнозы</button>
        <button type="button" name="language_submit">Язык</button>
      </form>
    </div>

    <!-- Центральная часть -->
    <div class="home_page-form_main-container">
      <p class="home_page_main_container_header">Актуальные соревнования</p>
      <div class="home_page_main_container_content_info_card">
        <p><strong>Дата:</strong></p>
        <p><strong>Место:</strong></p>
        <p><strong>Наций:</strong></p>
        <p><strong>Дзюдоистов:</strong></p>
      </div>
    </div>

    <!-- Правая панель -->
    <div class="home_page_main_info_content">
      <p>Дата проведения</p>
      <p>Название турнира</p>
      <p>Участники и города страны участники</p>

      <button type="button" name="date_calendar_button">Календарь соревнований</button>
      <button type="button" name="current_tournament_button">Обзор текущего соревнования</button>
    </div>

  </div>
</template>

<style scoped>

.home_page_background {
  position: fixed;
  inset: 0;
  background: #b1b0b0;
  z-index: -1;
}

/* общий контейнер */
.home_page_main-layout {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 30px;
  padding: 40px;
  height: 100vh;
  box-sizing: border-box;
}

/* навбар */
.home_page_navbar-container {
  width: 220px;
  background: #1c1c1c;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: white;
}

.navbar-base p {
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 15px;
  text-align: center;
}

.navbar-base button {
  width: 100%;
  padding: 8px;
  border: none;
  border-radius: 6px;
  background-color: #292929;
  color: white;
  cursor: pointer;
  transition: 0.2s;
}
.navbar-base button:hover {
  background-color: #444;
}

/* центральный блок */
.home_page-form_main-container {
  flex: 1;
  background: #181818;
  border-radius: 12px;
  padding: 20px;
  color: white;
}

/* правая панель */
.home_page_main_info_content {
  width: 250px;
  background: #1a1a1a;
  border-radius: 12px;
  padding: 20px;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.home_page_main_info_content button {
  background: #292929;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px;
  cursor: pointer;
  transition: 0.2s;
}

.home_page_main_info_content button:hover {
  background: #444;
}

</style>
<script>
</script>