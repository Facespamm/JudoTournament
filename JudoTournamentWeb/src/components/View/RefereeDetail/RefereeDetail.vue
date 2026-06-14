<template>
  <div class="referee-detail">
    <div class="detail-container">
      <!-- Заголовок и кнопка назад -->
      <div class="detail-header">
        <button class="back-button" type="button" @click="goBack" :title="t('refereeDetail.back')">
          ←
        </button>
        <h1>{{ t('refereeDetail.title') }}</h1>
      </div>

      <!-- Лоадер -->
      <div v-if="isLoading" class="loading">
        <div class="spinner"></div>
        <p>{{ t('refereeDetail.loading') }}</p>
      </div>

      <!-- Ошибка -->
      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
        <button class="retry-button" @click="loadRefereeDetail">{{ t('refereeDetail.retry') }}</button>
      </div>

      <!-- Детальная информация -->
      <div v-else-if="referee" class="info-card">
        <div class="main-info">
          <h2 class="name">{{ getFullName(referee) }}</h2>
          <div class="badge">{{ referee.certification_level }}</div>
        </div>

        <div class="details-grid">
          <div class="detail-section">
            <h3>{{ t('refereeDetail.mainInfo') }}</h3>
            <div class="detail-item">
              <span class="detail-label">{{ t('refereeDetail.lastName') }}</span>
              <span class="detail-value">{{ referee.last_name }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">{{ t('refereeDetail.firstName') }}</span>
              <span class="detail-value">{{ referee.first_name }}</span>
            </div>
            <div v-if="referee.middle_name" class="detail-item">
              <span class="detail-label">{{ t('refereeDetail.middleName') }}</span>
              <span class="detail-value">{{ referee.middle_name }}</span>
            </div>
          </div>

          <div class="detail-section">
            <h3>{{ t('refereeDetail.contactInfo') }}</h3>
            <div v-if="referee.phone" class="detail-item">
              <span class="detail-label">{{ t('refereeDetail.phone') }}</span>
              <a class="detail-value phone-link" :href="getPhoneHref(referee.phone)">
                {{ formatPhone(referee.phone) }}
              </a>
            </div>
            <div v-if="referee.email" class="detail-item">
              <span class="detail-label">Email:</span>
              <span class="detail-value">{{ referee.email }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchRefereeDetail } from './fetchRefereeDetail.js'
import { useI18n } from '@/i18n'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const referee = ref(null)
const isLoading = ref(true)
const error = ref('')

const getFullName = (referee) => {
  if (referee.full_name) return referee.full_name
  return `${referee.last_name || ''} ${referee.first_name || ''} ${referee.middle_name || ''}`.trim()
}

const formatPhone = (phone) => {
  const digits = String(phone || '').replace(/\D/g, '')
  if (digits.length === 11 && (digits.startsWith('7') || digits.startsWith('8'))) {
    return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9)}`
  }

  if (digits.length === 10) {
    return `+7 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8)}`
  }

  return String(phone || '')
}

const getPhoneHref = (phone) => {
  const digits = String(phone || '').replace(/\D/g, '')
  if (!digits) return ''
  const normalized = digits.length === 11 && digits.startsWith('8')
      ? `7${digits.slice(1)}`
      : digits
  return `tel:+${normalized}`
}

const goBack = () => {
  router.back()
}

const loadRefereeDetail = async () => {
  isLoading.value = true
  error.value = ''

  try {
    const refereeId = Number(route.params.id)
    if (isNaN(refereeId)) {
      throw new Error(t('refereeDetail.invalidId'))
    }

    const data = await fetchRefereeDetail(refereeId)
    referee.value = data.referee
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('refereeDetail.loadError')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadRefereeDetail()
})
</script>

<style scoped>
.referee-detail {
  width: 100%;
  min-height: 100vh;
  background: #ffffff;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  color: #1a1a1a;
  box-sizing: border-box;
  margin-left: 0;
  padding-top: 80px;
  max-width: calc(100vw - var(--sidebar-width, 120px) - 40px);
  padding-left: 20px;
  padding-right: 100px;

}

.detail-container {
  max-width: 1200px;
  margin: 0 auto;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.back-button {
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  border: 2px solid #c89b3c;
  border-radius: 12px;
  background: #fff;
  color: #c89b3c;
  cursor: pointer;
  font-weight: 800;
  font-size: 1.4rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.back-button:hover {
  background: #c89b3c;
  color: #fff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(200, 155, 60, 0.25);
}

.detail-header h1 {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  color: #1a1a1a;
}

.info-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid #e8e8e8;
}

.main-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #f0f0f0;
}

.name {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  color: #1a1a1a;
}

.badge {
  background: linear-gradient(135deg, #c89b3c, #f4d03f);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 4px 12px rgba(200, 155, 60, 0.3);
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.detail-section {
  background: #f8f9fa;
  padding: 1.2rem;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
}

.detail-section h3 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 0;
  border-bottom: 1px solid #e0e0e0;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.detail-value {
  font-size: 0.9rem;
  color: #333;
  font-weight: 600;
  text-align: right;
}

.phone-link {
  color: #1f6fbd;
  text-decoration: none;
  padding: 0.35rem 0.65rem;
  border-radius: 8px;
  background: #eef6ff;
  border: 1px solid #d7eaff;
  transition: all 0.2s ease;
}

.phone-link:hover {
  color: #155a9c;
  background: #e2f0ff;
  border-color: #b9ddff;
}

.loading, .error {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #c89b3c;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error {
  background: #ffebee;
  border: 1px solid #ffcdd2;
  border-radius: 12px;
  color: #d32f2f;
  padding: 2rem;
}

.retry-button {
  background: #c89b3c;
  color: white;
  border: none;
  padding: 0.7rem 1.4rem;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 1rem;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(200, 155, 60, 0.2);
}

.retry-button:hover {
  background: #e0b456;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(200, 155, 60, 0.3);
}

@media (max-width: 768px) {
  .referee-detail {
    padding: 50px 1rem 2rem 1rem;
  }

  .detail-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .detail-header h1 {
    font-size: 1.5rem;
  }

  .main-info {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .name {
    font-size: 1.5rem;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .detail-value {
    text-align: left;
  }
}
</style>
