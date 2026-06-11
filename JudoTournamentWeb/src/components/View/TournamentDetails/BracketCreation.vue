<template>
  <!-- КНОПКА СОЗДАНИЯ СЕТКИ -->
  <section class="bracket-setup" v-if="!bracketGenerated">
    <button class="create-bracket-btn" @click="showModal = true">{{ t('brackets.generateBracket') }}</button>
  </section>

  <!-- МОДАЛЬНОЕ ОКНО -->
  <div class="modal-overlay" v-if="showModal" @click="showModal = false">
    <div class="modal-content" @click.stop>
      <button class="modal-close" @click="showModal = false">×</button>
      <h2>{{ t('tournamentDetails.bracketSetupTitle') }}</h2>
      <div class="setup-group">
        <label>{{ t('tournamentDetails.participantsCountLabel') }}</label>
        <select v-model.number="participantsCount">
          <option :value="4">{{ t('tournamentDetails.participantsOption', { count: 4 }) }}</option>
          <option :value="8">{{ t('tournamentDetails.participantsOption', { count: 8 }) }}</option>
          <option :value="16">{{ t('tournamentDetails.participantsOption', { count: 16 }) }}</option>
        </select>
      </div>
      <div class="setup-group">
        <label>{{ t('tournamentDetails.participantsInputLabel') }}</label>
        <textarea
            v-model="participantsInput"
            :placeholder="t('tournamentDetails.participantsPlaceholder')"
            rows="8"
        ></textarea>
      </div>
      <button class="action-button" @click="generateBracket">{{ t('brackets.generateBracket') }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import { useI18n } from '@/i18n'

const emit = defineEmits(['bracket-created'])
const { t } = useI18n()

const bracketGenerated = ref(false)
const participantsCount = ref(8)
const participantsInput = ref('')
const showModal = ref(false)

const generateBracket = () => {
  const names = participantsInput.value
      .split('\n')
      .map(n => n.trim())
      .filter(n => n.length > 0)

  if (names.length < 2) {
    alert(t('tournamentDetails.minParticipantsError'))
    return
  }

  while (names.length < participantsCount.value) {
    names.push(t('tournamentDetails.participantFallback', { number: names.length + 1 }))
  }

  const teamsList = names.slice(0, participantsCount.value)

  const rounds = []
  let currentTeams = [...teamsList]

  while (currentTeams.length > 1) {
    const matches = []
    const roundName = currentTeams.length === 2 ? t('brackets.final') :
        currentTeams.length === 4 ? t('brackets.semifinal') :
            t('tournamentDetails.fractionFinal', { denominator: currentTeams.length / 2 })

    for (let i = 0; i < currentTeams.length; i += 2) {
      matches.push({
        team1: currentTeams[i],
        team2: currentTeams[i + 1] || 'TBD',
        score1: 0,
        score2: 0,
        winner: null,
        status: 'SCHEDULED'
      })
    }

    rounds.push({ name: roundName, matches })
    currentTeams = new Array(Math.ceil(currentTeams.length / 2)).fill('TBD')
  }

  emit('bracket-created', rounds)
  bracketGenerated.value = true
  showModal.value = false
}

// Метод для сброса сетки (если нужен извне)
const resetBracket = () => {
  bracketGenerated.value = false
  participantsInput.value = ''
  showModal.value = true
}

// Экспортируем методы для использования в родительском компоненте
defineExpose({
  resetBracket
})
</script>

<style scoped>
</style>
