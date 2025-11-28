<!-- [file name]: ManageRoles.vue -->
<template>
  <div class="roles-management-page">
    <div class="management-container">
      <section class="management-navigation">
        <h2>Управление ролями</h2>
        <nav class="nav-tabs">
          <button
              class="nav-tab"
              :class="{ active: activeTab === 'athlete' }"
              @click="activeTab = 'athlete'"
          >
            Спортсмен
          </button>
          <button
              class="nav-tab"
              :class="{ active: activeTab === 'referee' }"
              @click="activeTab = 'referee'"
          >
            Рефери
          </button>
          <button
              class="nav-tab"
              :class="{ active: activeTab === 'browsing' }"
              @click="activeTab = 'browsing'"
          >
            Просмотрщик
          </button>
        </nav>
      </section>

      <section class="management-content">
        <!-- TOAST УВЕДОМЛЕНИЕ -->
        <transition name="fade">
          <div v-if="toast.visible" class="toast-notification" :class="toast.type">
            <div class="toast-content">
              <span class="toast-icon">{{ toast.type === 'success' ? '✓' : '✕' }}</span>
              <span class="toast-message">{{ toast.message }}</span>
            </div>
          </div>
        </transition>

        <!-- Панель спортсмена -->
        <AthleteRole
            v-if="activeTab === 'athlete'"
            @show-toast="showToast"
        />

        <!-- Панель рефери -->
        <RefereeRole
            v-if="activeTab === 'referee'"
            @show-toast="showToast"
        />

        <!-- Панель просмотрщика -->
        <BrowsingRole
            v-if="activeTab === 'browsing'"
            @show-toast="showToast"
        />
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AthleteRole from './AthleteRole.vue'
import RefereeRole from './RefereeRole.vue'
import BrowsingRole from './BrowsingRole.vue'
import "./Roles.css"

const activeTab = ref('athlete')

// Toast состояние
const toast = ref({
  visible: false,
  message: '',
  type: 'success'
})

const showToast = (message, type = 'success', duration = 3000) => {
  toast.value = { visible: true, message, type }
  setTimeout(() => {
    toast.value.visible = false
  }, duration)
}
</script>