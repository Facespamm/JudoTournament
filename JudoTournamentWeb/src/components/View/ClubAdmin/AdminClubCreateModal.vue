<template>
  <div v-if="isOpen" class="admin-modal-overlay" @click.self="close">
    <div class="admin-modal-content">
      <h2>{{ t('clubsAdmin.createClubTitle') }}</h2>

      <form @submit.prevent="submit" class="admin-form-grid">
        <!-- поля формы — как в предыдущем примере -->
        <div class="admin-form-group">
          <label>{{ t('clubsAdmin.clubNameRequired') }}</label>
          <input v-model="form.name" required />
        </div>

        <div class="admin-form-group">
          <label>{{ t('clubsAdmin.shortName') }}</label>
          <input v-model="form.short_name" />
        </div>

        <div class="admin-form-group">
          <label>{{ t('clubsAdmin.cityRequired') }}</label>
          <input v-model="form.city" required />
        </div>

        <!-- остальные поля: country, address, phone, email, website, coach_name, founded_year -->

        <div class="admin-modal-actions">
          <button type="button" class="admin-modal-button admin-modal-button-cancel" @click="close">
            {{ t('clubsAdmin.cancel') }}
          </button>
          <button type="submit" class="admin-modal-button admin-modal-button-submit" :disabled="saving">
            {{ saving ? t('clubsAdmin.creating') : t('clubsAdmin.createClub') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { createClub } from '@/components/View/ClubAdmin/fetchClubAdmin.js'  // добавьте эту функцию, если её нет
import { useI18n } from '@/i18n'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close', 'created'])
const { t } = useI18n()

const form = ref({
  name: '',
  short_name: '',
  city: '',
  country: t('clubsAdmin.defaultCountry'),
  address: '',
  phone: '',
  email: '',
  website: '',
  coach_name: '',
  founded_year: null
})

const saving = ref(false)

const submit = async () => {
  saving.value = true
  try {
    await createClub(form.value)
    emit('created')
    emit('close')
  } catch (err) {
    alert(t('clubsAdmin.createClubError', { message: err.message }))
  } finally {
    saving.value = false
  }
}

const close = () => {
  emit('close')
}
</script>

<style src="@/components/View/ClubAdmin/ClubsAdmin.css" scoped></style>
