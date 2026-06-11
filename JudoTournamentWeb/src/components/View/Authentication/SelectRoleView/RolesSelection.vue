<!-- [file name]: RolesSelection.vue -->
<template>
  <div class="roles-selection">
    <div class="selection-header">
      <h3>{{ t('selectRole.roleTitle') }}</h3>
      <p>{{ t('selectRole.roleSubtitle') }}</p>
    </div>

    <div class="roles-grid">
      <div
          class="role-card"
          :class="{ active: selectedRole === 'athlete' }"
          @click="selectRole('athlete')"
      >
        <div class="role-icon">🤼</div>
        <div class="role-title">{{ t('selectRole.athlete') }}</div>
        <div class="role-description">
          {{ t('selectRole.athleteDescription') }}
        </div>
      </div>

      <div
          class="role-card"
          :class="{ active: selectedRole === 'referee' }"
          @click="selectRole('referee')"
      >
        <div class="role-icon">⚖️</div>
        <div class="role-title">{{ t('selectRole.referee') }}</div>
        <div class="role-description">
          {{ t('selectRole.refereeDescription') }}
        </div>
      </div>

      <div
          class="role-card"
          :class="{ active: selectedRole === 'browsing' }"
          @click="selectRole('browsing')"
      >
        <div class="role-icon">👀</div>
        <div class="role-title">{{ t('selectRole.viewer') }}</div>
        <div class="role-description">
          {{ t('selectRole.viewerDescription') }}
        </div>
      </div>
    </div>

    <div class="form-actions">
      <button
          class="submit-button"
          @click="confirmRole"
          :disabled="!selectedRole"
      >
        {{ t('selectRole.confirmRole') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from '@/i18n'

const emit = defineEmits(['role-selected', 'show-toast'])
const { t } = useI18n()

const selectedRole = ref('')

const selectRole = (role) => {
  selectedRole.value = role
}

const confirmRole = () => {
  if (!selectedRole.value) {
    emit('show-toast', t('selectRole.chooseRoleError'), 'error')
    return
  }

  try {
    // Сохраняем выбранную роль
    localStorage.setItem('userRole', selectedRole.value)

    // Отправляем событие с выбранной ролью
    emit('role-selected', selectedRole.value)

  } catch (error) {
    emit('show-toast', t('selectRole.chooseRoleSaveError', { message: error.message }), 'error')
  }
}
</script>

<style scoped>
.roles-selection {
  padding: 1rem;
}

.selection-header {
  text-align: center;
  margin-bottom: 3rem;
}

.selection-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1a1a1a;
}

.selection-header p {
  color: #666;
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.5;
}

.roles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.role-card {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.role-card:hover {
  transform: translateY(-5px);
  border-color: #c89b3c;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.role-card.active {
  background: linear-gradient(135deg, #c89b3c, #e0b456);
  border-color: #c89b3c;
  color: white;
}

.role-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.role-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.role-description {
  font-size: 0.9rem;
  opacity: 0.8;
  line-height: 1.4;
}

.form-actions {
  text-align: center;
}

.submit-button {
  background: linear-gradient(135deg, #c89b3c, #e0b456);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 200px;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(200, 155, 60, 0.3);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

@media (max-width: 768px) {
  .roles-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .role-card {
    padding: 1.5rem;
    min-height: 150px;
  }

  .role-icon {
    font-size: 2.5rem;
  }
}

@media (max-width: 480px) {
  .selection-header h3 {
    font-size: 1.3rem;
  }

  .role-card {
    padding: 1rem;
  }

  .role-icon {
    font-size: 2rem;
  }

  .role-title {
    font-size: 1.1rem;
  }
}
</style>
