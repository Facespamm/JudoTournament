<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ t('refereeManagement.addReferee') }}</h2>
        <button class="modal-close-btn" @click="close">×</button>
      </div>

      <form @submit.prevent="handleSubmit" class="referee-form">
        <div class="form-row">
          <div class="form-group">
            <label>{{ t('refereeManagement.lastName') }} <span class="required">*</span></label>
            <input
                v-model.trim="form.last_name"
                type="text"
                required
                :placeholder="t('refereeManagement.lastName')"
                :class="{ 'input-error': errors.last_name }"
            />
            <div v-if="errors.last_name" class="error-text">{{ errors.last_name }}</div>
          </div>

          <div class="form-group">
            <label>{{ t('refereeManagement.firstName') }} <span class="required">*</span></label>
            <input
                v-model.trim="form.first_name"
                type="text"
                required
                :placeholder="t('refereeManagement.firstName')"
                :class="{ 'input-error': errors.first_name }"
            />
            <div v-if="errors.first_name" class="error-text">{{ errors.first_name }}</div>
          </div>
        </div>

        <div class="form-group">
          <label>{{ t('refereeManagement.middleName') }}</label>
          <input v-model.trim="form.middle_name" type="text" :placeholder="t('refereeManagement.middleName')" />
        </div>

        <!-- Дропдаун категории судейства -->
        <div class="form-group">
          <label>{{ t('refereeManagement.certificationCategory') }} <span class="required">*</span></label>
          <select
              v-model="form.certification_level"
              :class="{ 'input-error': errors.certification_level }"
          >
            <option value="" disabled>{{ t('refereeManagement.selectCategory') }}</option>
            <option v-for="level in refereeLevels" :key="level.value" :value="level.value">
              {{ level.label }}
            </option>
          </select>
          <div v-if="errors.certification_level" class="error-text">{{ errors.certification_level }}</div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>{{ t('refereeManagement.phone') }}</label>
            <input
                v-model.trim="form.phone"
                type="tel"
                placeholder="+7 (XXX) XXX-XX-XX"
            />
          </div>

          <div class="form-group">
            <label>Email</label>
            <input
                v-model.trim="form.email"
                type="email"
                placeholder="example@judo.kz"
            />
          </div>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn-cancel" @click="close">{{ t('refereeManagement.cancel') }}</button>
          <button type="submit" class="btn-save" :disabled="isSubmitting">
            {{ isSubmitting ? t('refereeManagement.saving') : t('refereeManagement.add') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { CreateReferee } from '@/components/View/RefereeManagement/fetchRefereeManagement.js'
import { useI18n } from '@/i18n'

const { t } = useI18n()

const refereeLevels = computed(() => [
  { value: 'Национальный 3 категории', label: t('refereeManagement.national3') },
  { value: 'Национальный 2 категории', label: t('refereeManagement.national2') },
  { value: 'Национальный 1 категории', label: t('refereeManagement.national1') },
  { value: 'Континентальный C', label: t('refereeManagement.continentalC') },
  { value: 'Континентальный B', label: t('refereeManagement.continentalB') },
  { value: 'Континентальный A', label: t('refereeManagement.continentalA') },
  { value: 'Международный C', label: t('refereeManagement.internationalC') },
  { value: 'Международный B', label: t('refereeManagement.internationalB') },
  { value: 'Международный A', label: t('refereeManagement.internationalA') },
])

const props = defineProps({
  isOpen: { type: Boolean, required: true }
})

const emit = defineEmits(['close', 'submit'])

const form = ref({
  last_name: '',
  first_name: '',
  middle_name: '',
  certification_level: '',
  phone: '',
  email: ''
})

const errors       = ref({})
const isSubmitting = ref(false)

const resetForm = () => {
  form.value = {
    last_name: '',
    first_name: '',
    middle_name: '',
    certification_level: '',
    phone: '',
    email: ''
  }
  errors.value = {}
}

const validateForm = () => {
  errors.value = {}
  let isValid = true

  if (!form.value.last_name.trim()) {
    errors.value.last_name = t('refereeManagement.required')
    isValid = false
  }
  if (!form.value.first_name.trim()) {
    errors.value.first_name = t('refereeManagement.required')
    isValid = false
  }
  if (!form.value.certification_level) {
    errors.value.certification_level = t('refereeManagement.required')
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  try {
    await CreateReferee(form.value)
    emit('submit', { success: true })
    close()
  } catch (err) {
    console.error('Ошибка создания судьи:', err)
    alert(t('refereeManagement.createFailed', { message: err.message || t('refereeManagement.unknownError') }))
  } finally {
    isSubmitting.value = false
  }
}

const close = () => {
  resetForm()
  emit('close')
}

watch(() => props.isOpen, (val) => {
  if (val) resetForm()
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
}
.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 540px;
  max-height: 92vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0,0,0,0.25);
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #eee;
}
.modal-header h2 { margin: 0; font-size: 1.4rem; }
.modal-close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
  color: #888;
}
.modal-close-btn:hover { color: #333; }
.referee-form { padding: 20px 24px 24px; }
.form-row { display: flex; gap: 16px; }
.form-group { flex: 1; margin-bottom: 18px; }
.form-group label { display: block; margin-bottom: 6px; font-weight: 500; font-size: 0.95rem; }
.required { color: #e53e3e; }
input, select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
  box-sizing: border-box;
  background: white;
  color: #1a1a1a;
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
}
input {
  background-image: none;
  padding-right: 12px;
}
input:focus, select:focus {
  outline: none;
  border-color: #c89b3c;
  box-shadow: 0 0 0 3px rgba(200, 155, 60, 0.15);
}
.input-error { border-color: #e53e3e; }
.error-text { color: #e53e3e; font-size: 0.82rem; margin-top: 4px; }
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 28px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}
.btn-cancel, .btn-save {
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  font-size: 0.95rem;
  border: none;
}
.btn-cancel { background: #f1f5f9; color: #334155; }
.btn-save { background: #c89b3c; color: white; }
.btn-save:hover:not(:disabled) { background: #b5892e; }
.btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
</style>
