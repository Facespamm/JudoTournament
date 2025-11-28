<template>
  <div class="registration-athletes-page">
    <div class="registration-container">
      <section class="registration-navigation">
        <h2>Регистрация участников</h2>
        <nav class="nav-tabs">
          <button
              class="nav-tab"
              :class="{ active: activeTab === 'add-athlete' }"
              @click="activeTab = 'add-athlete'"
          >
            Добавить спортсмена
          </button>
          <button
              class="nav-tab"
              :class="{ active: activeTab === 'weighing' }"
              @click="activeTab = 'weighing'"
          >
            Взвешивание
          </button>
        </nav>
      </section>

      <section class="registration-content">
        <!-- TOAST УВЕДОМЛЕНИЕ -->
        <transition name="fade">
          <div v-if="toast.visible" class="toast-notification" :class="toast.type">
            <div class="toast-content">
              <span class="toast-icon">{{ toast.type === 'success' ? '✓' : '✕' }}</span>
              <span class="toast-message">{{ toast.message }}</span>
            </div>
          </div>
        </transition>

        <AddAthlete
            v-if="activeTab === 'add-athlete'"
            :toast="toast"
            @show-toast="showToast"
            @athlete-created="handleAthleteCreated"
        />
        <Weighing
            v-if="activeTab === 'weighing'"
            :toast="toast"
            @show-toast="showToast"
        />
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AddAthlete from '@/components/View/RegistrationAthletes/CreateAthleteForm.vue'
import Weighing from '@/components/View/RegistrationAthletes/WeighingForm.vue'
import "./RegistrationAthletes.css"


const activeTab = ref('add-athlete')

// Toast состояние
const toast = ref({
  visible: false,
  message: '',
  type: 'success'
})

// Универсальная функция показа toast
const showToast = (message, type = 'success', duration = type === 'success' ? 3000 : 4000) => {
  toast.value = { visible: true, message, type }
  setTimeout(() => {
    toast.value.visible = false
  }, duration)
}

const handleAthleteCreated = () => {
  // Можно добавить логику при создании спортсмена
  console.log('Спортсмен создан')
}
</script>

<style scoped>
.registration-athletes-page {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(to bottom, #fefefe, #f8f9fa);
  font-family: 'Inter', 'Segoe UI', sans-serif;
  color: #1a1a1a;
  padding: 90px 0 2rem 0;
  margin: 0;
  box-sizing: border-box;
}

.registration-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.registration-navigation {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 1.5rem;
}

.registration-navigation h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1a1a1a;
  text-align: center;
}

.nav-tabs {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

.nav-tab {
  background: #f8f9fa;
  border: 1.5px solid #e9ecef;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #495057;
  flex: 1;
  min-width: 160px;
  text-align: center;
}

.nav-tab:hover {
  border-color: #c89b3c;
  color: #1a1a1a;
  background: #fff9f0;
}

.nav-tab.active {
  background: linear-gradient(135deg, #c89b3c, #e0b456);
  color: white;
  border-color: #c89b3c;
  box-shadow: 0 2px 8px rgba(200, 155, 60, 0.3);
}

.registration-content {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  position: relative;
}

@media (max-width: 768px) {
  .registration-athletes-page {
    padding-top: 80px;
  }

  .registration-container {
    padding: 0 1rem;
  }

  .registration-navigation,
  .registration-content {
    padding: 1.25rem;
  }

  .nav-tabs {
    flex-direction: column;
    gap: 0.5rem;
  }

  .nav-tab {
    min-width: auto;
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .registration-athletes-page {
    padding-top: 75px;
  }

  .registration-navigation,
  .registration-content {
    padding: 1rem;
    border-radius: 8px;
  }

  .registration-navigation h2 {
    font-size: 1.3rem;
    margin-bottom: 0.75rem;
  }

  .nav-tab {
    padding: 0.6rem 0.8rem;
    font-size: 0.8rem;
  }
}
</style>