<template>
  <div class="home">
    <div class="hero">
      <h1>Турниры по дзюдо</h1>
      <p>Добро пожаловать на официальный сайт соревнований!</p>
      <button class="btn">Посмотреть расписание</button>
    </div>
  </div>
</template>

<script setup>
// Здесь позже можно подключить router для перехода на страницу турниров
// import { useRouter } from 'vue-router'
</script>

<style scoped>
.home {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  background: linear-gradient(135deg, #003366, #0077cc);
  color: white;
  text-align: center;
}

.hero {
  max-width: 600px;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.btn {
  background: #ffcc00;
  color: #003366;
  border: none;
  padding: 12px 24px;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn:hover {
  background: #ffd633;
}
</style>
