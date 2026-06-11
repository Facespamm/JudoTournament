<!-- AthleteRole.vue -->
<template>
  <div class="role-content">
    <div class="role-header">
      <h3>{{ t('selectRole.athleteProfile') }}</h3>
      <p>{{ t('selectRole.athleteSubtitle') }}</p>
    </div>

    <div class="loading-overlay" v-if="isLoading">
      <div class="loading-spinner"></div>
      <p>{{ t('selectRole.saving') }}</p>
    </div>

    <form @submit.prevent="saveAthleteProfile" class="role-form" novalidate>
      <div class="form-grid">

        <!-- Дата рождения + возраст -->
        <div class="form-group">
          <label>{{ t('selectRole.birthDate') }}</label>
          <div class="input-with-badge">
            <input v-model="athleteForm.birth_date" type="date" :disabled="isLoading" required />
            <span class="age-badge" v-if="calculatedAge !== null">{{ t('selectRole.years', { count: calculatedAge }) }}</span>
          </div>
        </div>

        <!-- Пол -->
        <div class="form-group">
          <label>{{ t('selectRole.gender') }}</label>
          <select v-model="athleteForm.gender" :disabled="isLoading" required>
            <option value="" disabled>{{ t('selectRole.selectGender') }}</option>
            <option value="мужской">{{ t('selectRole.male') }}</option>
            <option value="женский">{{ t('selectRole.female') }}</option>
          </select>
        </div>

        <!-- Вес -->
        <div class="form-group">
          <label>{{ t('selectRole.weight') }}</label>
          <input v-model.number="athleteForm.weight" type="number" min="20" step="0.5" :disabled="isLoading" placeholder="68.5" required />
        </div>

        <!-- Кю/Дан -->
        <div class="form-group">
          <label>{{ t('selectRole.rank') }}</label>
          <select v-model="athleteForm.rank_id" :disabled="isLoading" required>
            <option value="" disabled>{{ t('selectRole.selectRank') }}</option>
            <option v-for="dan in dans" :key="dan.id" :value="dan.id">{{ dan.description }}</option>
          </select>
        </div>

        <!-- Клуб (необязательно) -->
        <div class="form-group">
          <label>{{ t('selectRole.clubOptional') }} <span class="optional">{{ t('selectRole.optional') }}</span></label>
          <select v-model="athleteForm.club_id" :disabled="isLoading">
            <option value="">{{ t('selectRole.noClub') }}</option>
            <option v-for="club in clubs" :key="club.id" :value="club.id">{{ club.name }}</option>
          </select>
        </div>

        <!-- Лицензия -->
        <div class="form-group">
          <label>{{ t('selectRole.licenseOptional') }} <span class="optional">{{ t('selectRole.optional') }}</span></label>
          <input v-model="athleteForm.license_number" type="text" :disabled="isLoading" :placeholder="t('selectRole.enterNumber')" />
        </div>

        <!-- Страховка -->
        <div class="form-group">
          <label>{{ t('selectRole.insuranceOptional') }} <span class="optional">{{ t('selectRole.optional') }}</span></label>
          <input v-model="athleteForm.insurance_number" type="text" :disabled="isLoading" :placeholder="t('selectRole.enterNumber')" />
        </div>

        <!-- Чекбокс -->
        <div class="form-group full-width">
          <label class="checkbox-label">
            <input type="checkbox" v-model="athleteForm.medical_check" :disabled="isLoading" class="hidden-checkbox" />
            <span class="custom-checkbox"></span>
            <span class="checkbox-text">{{ t('selectRole.medicalCertificate') }}</span>
          </label>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="submit-button" :disabled="isLoading">
          {{ isLoading ? t('selectRole.saving') : t('selectRole.saveProfile') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchClubs, fetchDan, fetchCreateAthlete } from '@/components/View/Authentication/SelectRoleView/fetchGetInformation.js'
import { useI18n } from '@/i18n'
import './Roles.css'

const emit = defineEmits(['show-toast'])
const router = useRouter()
const { t } = useI18n()

const isLoading = ref(false)
const clubs = ref([])
const dans = ref([])

const athleteForm = ref({
  birth_date: '',
  gender: '',
  weight: null,
  club_id: '',
  rank_id: '',
  license_number: '',
  insurance_number: '',
  medical_check: false
})

const calculatedAge = computed(() => {
  if (!athleteForm.value.birth_date) return null
  const birth = new Date(athleteForm.value.birth_date)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
})

const getUserId = () => {
  const token = document.cookie.split('; ').find(r => r.startsWith('jwt_token='))?.split('=')[1]
  if (!token) return null
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    base64 += '='.repeat((4 - base64.length % 4) % 4)
    const payload = JSON.parse(decodeURIComponent(
        Array.from(atob(base64), c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    ))
    return Number(payload.sub ?? payload.id ?? payload.user_id) || null
  } catch { return null }
}

const loadData = async () => {
  try {
    const [clubsResult, dansResult] = await Promise.all([fetchClubs(), fetchDan()])
    if (clubsResult?.success) {
      clubs.value = Array.isArray(clubsResult.clubs) ? clubsResult.clubs : clubsResult.data || []
    }
    if (dansResult?.success && Array.isArray(dansResult.dans)) {
      dans.value = dansResult.dans.sort((a, b) => a.id - b.id)
    }
  } catch (err) {
    console.error('Ошибка загрузки данных:', err)
  }
}

const validateForm = () => {
  const f = athleteForm.value
  return f.birth_date && f.gender && f.weight !== null && f.weight !== '' && f.rank_id
}

const saveAthleteProfile = async () => {
  if (!validateForm()) {
    emit('show-toast', t('selectRole.requiredFields'), 'error')
    return
  }
  const userId = getUserId()
  if (!userId) {
    emit('show-toast', t('selectRole.userIdError'), 'error')
    return
  }

  isLoading.value = true
  try {
    const res = await fetchCreateAthlete({
      birth_date: athleteForm.value.birth_date,
      gender: athleteForm.value.gender,
      club_id: athleteForm.value.club_id ? Number(athleteForm.value.club_id) : null,
      rank_id: Number(athleteForm.value.rank_id),
      license_number: athleteForm.value.license_number || null,
      medical_check: athleteForm.value.medical_check,
      insurance_number: athleteForm.value.insurance_number || null,
      weight: Number(athleteForm.value.weight)
    }, userId)

    if (res?.success) {
      emit('show-toast', t('selectRole.athleteSaved'), 'success')
      router.push({ name: 'login' })
    } else {
      emit('show-toast', res?.error || t('selectRole.saveFailed'), 'error')
    }
  } catch {
    emit('show-toast', t('selectRole.serverError'), 'error')
  } finally {
    isLoading.value = false
  }
}

onMounted(loadData)
</script>

<style scoped>
.input-with-badge {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 100%;
}

.input-with-badge input[type="date"] {
  width: 100%;
  box-sizing: border-box;
  padding: 0.65rem 0.9rem;
}

.age-badge {
  position: absolute;
  right: 2.2rem;
  background: #c89b3c;
  color: white;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 20px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 1;
}

.optional {
  font-size: 0.75rem;
  font-weight: 400;
  color: #9ca3af;
}
</style>
