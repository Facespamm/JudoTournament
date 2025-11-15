<template>
  <div class="tournament-details">
    <!-- ИНФОРМАЦИЯ О ТУРНИРЕ -->
    <section class="tournament-info">
      <h1>{{ tournament.name }}</h1>
      <p class="tournament-description">{{ tournament.description }}</p>
      <div class="tournament-meta">
        <span>Дата: {{ tournament.start_date }} - {{ tournament.end_date }}</span>
        <span>Место: {{ tournament.location }}</span>
        <span>Организатор: {{ tournament.organizer }}</span>
      </div>
    </section>

    <!-- ТАБЛО СО СЧЕТОМ (МОК ДАННЫЕ) -->
    <div class="scoreboard-section">
      <div class="scoreboard">
        <span class="team-left">Команда A: 5</span>
        <span class="vs">vs</span>
        <span class="team-right">Команда B: 3</span>
      </div>
    </div>

    <!-- СЕТКА ТУРНИРА -->
    <section class="bracket-section">
      <h2>Турнирная сетка</h2>
      <div class="bracket">
        <!-- 1/4 финала -->
        <div class="bracket-round">
          <h3>1/4 финала</h3>
          <div class="match-pair">
            <div class="match">
              <span class="team">Passion UA</span>
              <span class="score">0</span>
              <span class="time">14.11.25 в 11:00</span>
            </div>
            <div class="match vs-match">
              <span class="team">paiN</span>
              <span class="score">2</span>
            </div>
            <div class="connector"></div>
            <div class="match-result">paiN</div>
          </div>
          <div class="match-pair">
            <div class="match">
              <span class="team">Vitality</span>
              <span class="score">2</span>
              <span class="time">14.11.25 в 13:30</span>
            </div>
            <div class="match vs-match">
              <span class="team">Spirit</span>
              <span class="score">1</span>
            </div>
            <div class="connector"></div>
            <div class="match-result">Vitality</div>
          </div>
        </div>

        <!-- Полуфинал -->
        <div class="bracket-round">
          <h3>Полуфинал</h3>
          <div class="match-pair">
            <div class="match">
              <span class="team">FURIA</span>
              <span class="score">1</span>
              <span class="time">Сегодня в 10:30</span>
            </div>
            <div class="match vs-match">
              <span class="team">paiN</span>
              <span class="score">0</span>
            </div>
            <div class="connector"></div>
            <div class="match-result">TBD</div>
          </div>
          <div class="match-pair">
            <div class="match">
              <span class="team">Falcons</span>
              <span class="score">1</span>
              <span class="time">Сегодня в 13:30</span>
            </div>
            <div class="match vs-match">
              <span class="team">Vitality</span>
              <span class="score">2</span>
            </div>
            <div class="connector"></div>
            <div class="match-result">TBD</div>
          </div>
        </div>

        <!-- Финал -->
        <div class="bracket-round final-round">
          <h3>Финал</h3>
          <div class="match-pair">
            <div class="match-result">TBD</div>
            <div class="connector"></div>
            <div class="match-result">TBD</div>
            <div class="final-time">16.11.25 в 11:00</div>
          </div>
        </div>
      </div>
      <div class="bracket-actions">
        <button class="action-button" @click="editBracket">Редактировать сетку</button>
        <button class="action-button" @click="addClubToBracket">Добавить клуб в сетку</button>
      </div>
    </section>

    <!-- СПИСОК УЧАСТНИКОВ -->
    <section class="participants-list">
      <h2>Список участников</h2>
      <div class="participants-grid">
        <div v-for="participant in participants" :key="participant.id" class="participant-card">
          <span class="participant-name">{{ participant.name }}</span>
          <span class="participant-club">{{ participant.club }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const tournamentId = route.params.id

const tournament = ref({
  name: '',
  description: '',
  start_date: '',
  end_date: '',
  location: '',
  organizer: ''
})

const participants = ref([])

// Загрузка данных турнира (мок)
onMounted(() => {
  tournament.value = {
    name: tournamentId === 'champ-kz-cadets-2025' ? 'Чемпионат Казахстана среди кадетов' : 'Гран-при Казахстана 2025',
    description: 'Ежегодный турнир по дзюдо с участием лучших спортсменов.',
    start_date: tournamentId === 'champ-kz-cadets-2025' ? '2025-03-17' : '2025-05-10',
    end_date: tournamentId === 'champ-kz-cadets-2025' ? '2025-03-17' : '2025-05-12',
    location: 'Астана, Казахстан',
    organizer: 'Федерация дзюдо Казахстана'
  }
  participants.value = [
    { id: 1, name: 'Азамат Сарсенбеков', club: 'Динамо Алматы' },
    { id: 2, name: 'Гульжан Искакова', club: 'Президентский клуб' }
  ]
})

const editBracket = () => {
  alert('Функционал редактирования сетки в разработке')
}

const addClubToBracket = () => {
  alert('Функционал добавления клуба в сетку в разработке')
}
</script>

<style scoped>
.tournament-details {
  max-width: 1600px; /* Увеличена максимальная ширина для более просторного вида */
  margin: 0 auto;
  padding: 90px 2rem 4rem;
  background: #ffffff; /* Изменен фон на белый для устранения черной фигни по бокам */
  font-family: 'Inter', 'Segoe UI', sans-serif;
  color: #1a1a1a;
  box-sizing: border-box;
}

/* ИНФОРМАЦИЯ О ТУРНИРЕ */
.tournament-info {
  background: white;
  padding: 3rem; /* Увеличен внутренний отступ */
  border: 2px solid #e0b456; /* Добавлена граница, как в скриншоте */
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem; /* Увеличен внешний отступ */
  transition: all 0.3s ease;
  text-align: center; /* Центрирование текста, как в скриншоте */
}

.tournament-info:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #c89b3c;
}

.tournament-info h1 {
  font-size: 2.5rem; /* Увеличен размер заголовка */
  font-weight: 700;
  margin: 0 0 1.5rem; /* Увеличен отступ */
  color: #1a1a1a;
}

.tournament-description {
  font-size: 1rem; /* Увеличен размер текста */
  color: #666;
  line-height: 1.6; /* Увеличена высота строки */
  margin-bottom: 2rem; /* Увеличен отступ */
  max-width: 80%; /* Ограничение ширины для читаемости */
  margin-left: auto;
  margin-right: auto;
}

.tournament-meta {
  display: flex;
  flex-direction: column;
  gap: 0.75rem; /* Увеличен промежуток */
  font-size: 1rem; /* Увеличен размер текста */
  color: #888;
}

/* ТАБЛО */
.scoreboard-section {
  background: white;
  padding: 2rem; /* Увеличен внутренний отступ */
  border: 2px solid #e0b456; /* Добавлена граница, как в скриншоте */
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem; /* Увеличен внешний отступ */
  text-align: center;
  transition: all 0.3s ease;
}

.scoreboard-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #c89b3c;
}

.scoreboard {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem; /* Увеличен промежуток */
  font-size: 1.8rem; /* Увеличен размер текста */
  font-weight: 700;
}

.team-left, .team-right {
  color: #c89b3c;
}

.vs {
  color: #1a1a1a;
  font-size: 1.5rem; /* Увеличен размер */
}

/* СЕТКА ТУРНИРА */
.bracket-section {
  margin-bottom: 2rem; /* Увеличен внешний отступ */
}

.bracket-section h2 {
  font-size: 2rem; /* Увеличен размер заголовка */
  font-weight: 700;
  margin: 0 0 2rem; /* Увеличен отступ */
  color: #1a1a1a;
  text-align: center;
}

.bracket {
  background: #ffffff; /* Изменен фон на белый, чтобы убрать черную фигню */
  padding: 3rem; /* Увеличен внутренний отступ */
  border: 2px solid #e0b456; /* Добавлена граница, как в скриншоте */
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  color: #1a1a1a; /* Изменен цвет текста на черный для читаемости на белом фоне */
}

.bracket-round {
  margin-bottom: 2.5rem; /* Увеличен внешний отступ */
  position: relative;
}

.bracket-round h3 {
  font-size: 1.3rem; /* Увеличен размер текста */
  font-weight: 600;
  margin: 0 0 2rem; /* Увеличен отступ */
  text-align: center;
  color: #c89b3c;
}

.match-pair {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2.5rem; /* Увеличен внешний отступ */
  position: relative;
}

.match {
  background: #f8f9fa; /* Светлый фон для карточек, как в скриншоте */
  padding: 1.5rem; /* Увеличен внутренний отступ */
  border: 1px solid #e0e0e0; /* Добавлена легкая граница */
  border-radius: 10px; /* Увеличен радиус */
  width: 250px; /* Увеличена ширина */
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.75rem; /* Увеличен промежуток */
}

.vs-match {
  background: #f8f9fa; /* Светлый фон для карточек, как в скриншоте */
  padding: 1.5rem; /* Увеличен внутренний отступ */
  border: 1px solid #e0e0e0; /* Добавлена легкая граница */
  border-radius: 10px; /* Увеличен радиус */
  width: 250px; /* Увеличена ширина */
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.75rem; /* Увеличен промежуток */
}

.match .team, .vs-match .team {
  font-size: 1.1rem; /* Увеличен размер текста */
  font-weight: 500;
}

.match .score, .vs-match .score {
  font-size: 1.4rem; /* Увеличен размер текста */
  font-weight: 700;
  color: #c89b3c;
}

.match .time, .final-time {
  font-size: 0.9rem; /* Увеличен размер текста */
  color: #666;
}

.connector {
  flex-grow: 1;
  height: 2px;
  background: #c89b3c; /* Изменен цвет коннектора на акцентный */
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}

.match-result {
  background: #f8f9fa; /* Светлый фон для результата */
  padding: 1.5rem; /* Увеличен внутренний отступ */
  border: 1px solid #e0e0e0; /* Добавлена легкая граница */
  border-radius: 10px; /* Увеличен радиус */
  width: 250px; /* Увеличена ширина */
  text-align: center;
  font-size: 1.1rem; /* Увеличен размер текста */
  font-weight: 500;
  color: #c89b3c;
}

.final-round .match-pair {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem; /* Увеличен промежуток */
}

.final-round .match-result {
  background: #f0f0f0; /* Чуть темнее для финала */
}

.final-round .final-time {
  text-align: center;
  margin-top: 1.5rem; /* Увеличен отступ */
}

.bracket-actions {
  margin-top: 2rem; /* Увеличен внешний отступ */
  display: flex;
  gap: 1.5rem; /* Увеличен промежуток */
  justify-content: center;
}

.action-button {
  background: #c89b3c;
  color: white;
  border: none;
  padding: 1rem 2rem; /* Увеличены внутренние отступы */
  border-radius: 12px;
  font-size: 1rem; /* Увеличен размер текста */
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button:hover {
  background: #e0b456;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(200, 155, 60, 0.3);
}

/* СПИСОК УЧАСТНИКОВ */
.participants-list {
  margin-bottom: 2rem; /* Увеличен внешний отступ */
}

.participants-list h2 {
  font-size: 2rem; /* Увеличен размер заголовка */
  font-weight: 700;
  margin: 0 0 2rem; /* Увеличен отступ */
  color: #1a1a1a;
  text-align: center;
}

.participants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); /* Увеличена минимальная ширина карточек */
  gap: 2rem; /* Увеличен промежуток */
  padding: 0 1rem; /* Добавлен отступ для равномерного распределения */
}

.participant-card {
  background: white;
  padding: 2rem; /* Увеличен внутренний отступ */
  border: 2px solid #e0b456; /* Добавлена граница, как в скриншоте */
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 1rem; /* Увеличен промежуток */
  transition: all 0.3s ease;
}

.participant-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #c89b3c;
}

.participant-name {
  font-size: 1.2rem; /* Увеличен размер текста */
  font-weight: 600;
  color: #1a1a1a;
}

.participant-club {
  font-size: 1rem; /* Увеличен размер текста */
  color: #888;
}

/* АДАПТИВ */
@media (max-width: 992px) {
  .tournament-details {
    padding: 80px 1.5rem 3rem;
  }

  .match, .vs-match, .match-result {
    width: 200px; /* Снижена ширина на средних экранах */
  }

  .participants-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .tournament-details {
    padding: 75px 1rem 2rem;
  }

  .match, .vs-match, .match-result {
    width: 150px; /* Снижена ширина на мобильных */
  }

  .match .team, .vs-match .team {
    font-size: 0.9rem;
  }

  .match .score, .vs-match .score {
    font-size: 1.2rem;
  }

  .match-pair {
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.5rem;
  }

  .connector {
    display: none; /* Убираем коннектор на мобильных для упрощения */
  }

  .participants-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .tournament-details {
    padding: 70px 0.75rem 1.5rem;
  }

  .match, .vs-match, .match-result {
    width: 120px; /* Снижена ширина на маленьких экранах */
  }

  .match .team, .vs-match .team {
    font-size: 0.8rem;
  }

  .match .score, .vs-match .score {
    font-size: 1rem;
  }
}
</style>